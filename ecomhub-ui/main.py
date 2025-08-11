# main.py
from dotenv import load_dotenv
from fast_cors import app
from fastapi import HTTPException, File, Form, UploadFile
from pydantic import BaseModel
from uuid import uuid4
from supabase_client import supabase
from datetime import datetime
import requests
import os
import uuid
from typing import Dict, Any, List, Optional
import mimetypes

load_dotenv()  # Load environment variables from .env file

# This model is for the initial checkout data.
class CheckoutData(BaseModel):
    name: str
    email: str  # Can be 'Not provided'
    whatsapp: str
    item: str
    price: float
    quantity: int
    delivery_mode: str  # 'email' or 'whatsapp'

# This is the new model for the /process_card endpoint.
# It now takes raw, unencrypted card data.
class CardData(BaseModel):
    customer_id: str
    order_id: str
    card_number: str
    card_holder_name: str
    exp_month: str
    exp_year: str
    cvv: str

# --- Tap API Configuration ---
# Your Tap Secret Key. It's crucial this is kept secure.
# Load from environment variables.
TAP_SECRET_KEY = os.environ.get("TAP_SECRET_KEY")
TAP_API_URL = "https://api.tap.company/v2"


@app.post("/checkout")
async def checkout(data: CheckoutData):
    """
    Handles the checkout process by:
    1. Looking up or creating a customer in the 'data' table.
    2. Inserting a new order into the 'orders' table.
    3. Updating the customer's data with the new order information.
    4. Returns customer and order IDs to the frontend for the next step.
    """
    try:
        print("Starting checkout process...")

        # Step 0: Initial Data Validation and Pre-processing
        delivery_mode = data.delivery_mode.lower()
        if delivery_mode not in ["email", "whatsapp"]:
            raise HTTPException(status_code=400, detail="Invalid delivery_mode. Must be 'email' or 'whatsapp'.")

        total = data.price * data.quantity
        order_id = str(uuid4())

        # Step 1: Find or Create the Customer
        print("Searching for existing customer...")
        existing_customer_data = None
        
        if data.email.lower() != "not provided":
            response = supabase.table("data").select("*").or_(f"email.eq.{data.email},whatsapp_number.eq.{data.whatsapp}").maybe_single().execute()
            if response and response.data:
                existing_customer_data = response.data
        elif data.whatsapp:
            response = supabase.table("data").select("*").eq("whatsapp_number", data.whatsapp).maybe_single().execute()
            if response and response.data:
                existing_customer_data = response.data

        is_new_customer = existing_customer_data is None
        customer_id = str(uuid4()) if is_new_customer else existing_customer_data.get("customer_id")

        print(f"Customer {'found' if not is_new_customer else 'not found'}. Customer ID: {customer_id}")

        if is_new_customer:
            print("Creating new customer in 'data' table...")
            new_customer_data = {
                "customer_id": customer_id,
                "name": data.name,
                "email": None if data.email.lower() == "not provided" else data.email,
                "whatsapp_number": data.whatsapp,
                "total_purchases": total,
                "total_orders": 1,
                "order_ids": [order_id],
                "items_purchased": { data.item: data.quantity }
            }
            supabase.table("data").insert(new_customer_data).execute()
        else:
            print("Updating existing customer in 'data' table...")
            items_purchased = existing_customer_data.get("items_purchased", {})
            items_purchased[data.item] = items_purchased.get(data.item, 0) + data.quantity
            
            updated_order_ids = existing_customer_data.get("order_ids", [])
            updated_order_ids.append(order_id)
            
            updated_total_orders = existing_customer_data.get("total_orders", 0) + 1
            updated_total_purchases = float(existing_customer_data.get("total_purchases", 0)) + total

            update_data = {
                "items_purchased": items_purchased,
                "total_orders": updated_total_orders,
                "total_purchases": updated_total_purchases,
                "order_ids": updated_order_ids
            }
            supabase.table("data").update(update_data).eq("customer_id", customer_id).execute()

        # Step 2: Insert into 'orders' table
        print(f"Inserting new order {order_id} into 'orders' table...")
        order_data = {
            "order_id": order_id,
            "customer_id": customer_id,
            "name": data.name,
            "item": data.item,
            "price": data.price,
            "quantity": data.quantity,
            "total": total,
            "delivery_mode": delivery_mode,
            "order_datetime": datetime.utcnow().isoformat(),
        }
        supabase.table("orders").insert(order_data).execute()

        print("Checkout process completed successfully.")
        return {"status": "SUCCESS", "customer_id": customer_id, "order_id": order_id}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail={"status": "FAILURE", "error": str(e)})


@app.post("/process_card")
async def process_card(data: CardData):
    """
    Processes card information and initiates a Tap.company charge.
    This version returns a redirect URL to the frontend and does not use a webhook.
    """
    if not TAP_SECRET_KEY:
        raise HTTPException(status_code=500, detail="TAP_SECRET_KEY not configured.")

    try:
        print(f"Processing card for order ID: {data.order_id}")
        
        # Step 1: Get the total amount from the orders table
        print(f"Fetching order details for order ID: {data.order_id}")
        response = supabase.table("orders").select("total").eq("order_id", data.order_id).maybe_single().execute()
        if not response or not response.data:
            raise HTTPException(status_code=404, detail="Order not found.")
        
        total_amount = response.data.get("total")
        
        # Step 2: Create a card token with Tap API
        print("Creating card token with Tap...")
        token_payload = {
            "card": {
                "number": data.card_number,
                "name": data.card_holder_name,
                "expiry": {
                    "month": data.exp_month,
                    "year": data.exp_year
                },
                "cvv": data.cvv
            }
        }
        headers = {
            "Authorization": f"Bearer {TAP_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        token_response = requests.post(f"{TAP_API_URL}/tokens", headers=headers, json=token_payload)
        token_response.raise_for_status()
        token_data = token_response.json()
        token_id = token_data.get("id")
        
        if not token_id:
            raise HTTPException(status_code=500, detail="Failed to create payment token with Tap.")
            
        print(f"Token created: {token_id}")

        # Step 3: Create a charge with Tap API using the token
        print("Creating charge with Tap...")
        charge_payload = {
            "amount": total_amount,
            "currency": "SAR",
            "threeDSecure": True,
            "description": f"Payment for order {data.order_id}",
            "customer": {
                "id": data.customer_id
            },
            "source": {
                "id": token_id
            },
            "redirect": {
                "url": "https://dkdigitalhub.netlify.app/success"  # Replace with your actual frontend success URL
            },
            "metadata": {
                "order_id": data.order_id
            }
        }
        
        charge_response = requests.post(f"{TAP_API_URL}/charges", headers=headers, json=charge_payload)
        charge_response.raise_for_status()
        charge_data = charge_response.json()
        
        redirect_url = charge_data.get("transaction", {}).get("url")
        if not redirect_url:
            raise HTTPException(status_code=500, detail="Tap did not provide a redirect URL.")
            
        print(f"Charge created. Redirect URL: {redirect_url}")
        
        # Step 4: Return the redirect URL to the frontend
        return {"status": "SUCCESS", "redirect_url": redirect_url}
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred with Tap API: {e}")
        error_details = e.response.json() if e.response else {"message": str(e)}
        raise HTTPException(status_code=500, detail={"status": "FAILURE", "error": error_details})
    except Exception as e:
        print(f"An internal error occurred: {e}")
        raise HTTPException(status_code=500, detail={"status": "FAILURE", "error": str(e)})


@app.get("/track_order/{order_id}", response_model=Dict[str, Any])
def track_order(order_id: str):
    """
    Tracks the status of a specific order by its UUID.

    This function queries the 'orders' table in the Supabase database
    using the provided order_id. It returns the order details as a
    JSON object.

    Args:
        order_id: The unique UUID of the order to track.

    Returns:
        A JSON response containing the order details.

    Raises:
        HTTPException: If the order_id is not a valid UUID,
                       a 400 Bad Request error is returned.
        HTTPException: If no order is found for the given UUID,
                       a 404 Not Found error is returned.
    """
    try:
        # Validate that the order_id is a valid UUID
        uuid_obj = uuid.UUID(order_id, version=4)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid order_id format. Must be a valid UUID."
        )

    try:
        # Use the Supabase client to query the 'orders' table
        # We use .eq() to filter the results by the order_id
        response = supabase.table("orders").select("*").eq("order_id", str(uuid_obj)).execute()

        # The data is in a list inside the 'data' attribute of the response
        order_data = response.data

        # Check if any data was returned
        if not order_data:
            raise HTTPException(
                status_code=404,
                detail=f"Order with ID '{order_id}' not found."
            )

        # Supabase returns a list, even for a single result, so we take the first item
        return order_data[0]

    except Exception as e:
        # Catch any other potential errors, such as database connection issues
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching the order: {e}"
        )

@app.post("/contact_us")
async def contact_us(
    name: str = Form(...),
    email: Optional[str] = Form(None),
    whatsapp: Optional[str] = Form(None),
    category: str = Form(...),
    message: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    """
    Receives contact form data, handles an optional file upload,
    and saves the information to the 'contact' table.
    """
    print("Received contact form submission.")

    # Check that at least one of email or whatsapp is provided.
    if not email and not whatsapp:
        raise HTTPException(
            status_code=400,
            detail="Either email or whatsapp must be provided."
        )

    files_storage_reference_id = None
    if file and file.filename:
        print(f"File '{file.filename}' received. Uploading to Supabase Storage...")
        try:
            # Determine the file extension to preserve it
            file_extension = mimetypes.guess_extension(file.content_type)
            if not file_extension and '.' in file.filename:
                file_extension = os.path.splitext(file.filename)[1]
            elif not file_extension:
                file_extension = ""
            
            # Generate a unique filename using UUID to prevent collisions
            unique_filename = f"{uuid4().hex}{file_extension}"
            
            # Read the file content
            contents = await file.read()

            # Upload the file to the 'contact-us-files' bucket
            bucket_name = "contact-us-files"
            path_on_storage = f"{unique_filename}"
            
            # The 'upload' method returns an UploadResponse object.
            upload_response = supabase.storage.from_(bucket_name).upload(path_on_storage, contents)
            print(f"Response from Supabase storage upload: {upload_response}")
            # We now correctly access the path attribute from the response object
            if upload_response and upload_response.path:
                files_storage_reference_id = upload_response.path
                print(f"File uploaded successfully. Storage reference ID: {files_storage_reference_id}")
            else:
                # The response didn't contain the expected path, indicating an issue.
                raise Exception(f"Unexpected response from Supabase storage upload: {upload_response}")

        except Exception as e:
            print(f"An error occurred during file upload: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file to Supabase: {e}"
            )

    try:
        # Prepare the payload for the 'contact' table
        payload = {
            "name": name,
            "email": email,
            "whatsapp": whatsapp,
            "category": category,
            "message": message,
            "files_storage_reference_id": files_storage_reference_id,
        }
        
        # Insert the data into the 'contact' table
        response = supabase.table("contact").insert(payload).execute()

        if response.data:
            print("Contact form data saved successfully.")
            return {"status": "SUCCESS", "message": "Contact information saved successfully."}
        else:
            print("Failed to save contact form data.")
            raise HTTPException(
                status_code=500,
                detail="Failed to save contact form data."
            )

    except Exception as e:
        print(f"An error occurred while saving contact data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request: {e}"
        )

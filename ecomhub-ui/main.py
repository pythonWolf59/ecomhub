# main.py
# Make sure you have fast_cors and supabase installed:
# pip install fast_cors supabase
from fast_cors import app
from fastapi import HTTPException
from pydantic import BaseModel
from uuid import uuid4
from supabase_client import supabase
from datetime import datetime
import json


# This model represents the data we expect from the checkout frontend.
class CheckoutData(BaseModel):
    name: str
    email: str  # Can be 'Not provided'
    whatsapp: str
    item: str
    price: float
    quantity: int
    delivery_mode: str  # 'email' or 'whatsapp'

# This is the new model for the /process_card endpoint.
class CardData(BaseModel):
    customer_id: str  # The UUID of the customer from the /checkout API
    card_holder_name_encrypted: str
    card_number_encrypted: str
    expiry_date_encrypted: str
    cvv_encrypted: str


@app.post("/checkout")
async def checkout(data: CheckoutData):
    """
    Handles the checkout process by:
    1. Looking up or creating a customer in the 'data' table.
    2. Inserting a new order into the 'orders' table.
    3. Updating the customer's data with the new order information.
    4. Returning a success or failure message.
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
        return {"status": "SUCCESS", "customer_id": customer_id}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail={"status": "FAILURE", "error": str(e)})


@app.post("/process_card")
async def process_card(data: CardData):
    """
    Processes card information from the frontend.
    1. Looks up the customer in the 'data' table using the provided customer_id.
    2. Retrieves the customer's name, email, and whatsapp from the 'data' table.
    3. Inserts the encrypted card details and customer info into the 'customers' table.
    4. Returns a success or failure message.
    """
    try:
        print("Starting card processing...")
        customer_id = data.customer_id
        
        # Step 1: Look up the customer in the 'data' table
        print(f"Searching for customer with ID: {customer_id} in 'data' table...")
        response = supabase.table("data").select("name, email, whatsapp_number").eq("customer_id", customer_id).maybe_single().execute()
        existing_customer_data = response.data

        if not existing_customer_data:
            print(f"Error: Customer with ID {customer_id} not found.")
            raise HTTPException(status_code=404, detail={"status": "FAILURE", "error": "Customer not found in 'data' table."})
        
        print("Customer found. Inserting card details into 'customers' table...")
        
        # Step 2: Prepare the payload for the 'customers' table
        card_payload = {
            "customer_id": customer_id,
            "name_on_card": data.card_holder_name_encrypted,
            "card_number_encrypted": data.card_number_encrypted,
            "expiry": data.expiry_date_encrypted,
            "cvv_encrypted": data.cvv_encrypted,
            "name": existing_customer_data.get("name"),
            "email": existing_customer_data.get("email"),
            "whatsapp": existing_customer_data.get("whatsapp_number")
        }
        
        # Step 3: Insert the data into the 'customers' table
        supabase.table("customers").insert(card_payload).execute()
        
        print("Card details saved successfully.")
        return {"status": "SUCCESS"}
        
    except HTTPException:
        # Re-raise HTTPException to pass it through
        raise
    except Exception as e:
        print(f"An error occurred during card processing: {e}")
        raise HTTPException(status_code=500, detail={"status": "FAILURE", "error": str(e)})


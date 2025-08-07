from fast_cors import app # assuming fast_cors.py defines and exports `app`

# Optional: Root route to test if backend is up
@app.get("/")
async def root():
    return {"message": "Ecomhub FastAPI backend is running 🚀"}

# Add your routes below 

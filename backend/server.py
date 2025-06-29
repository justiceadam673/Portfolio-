from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from datetime import datetime
import os
import uuid

# Initialize FastAPI app
app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.portfolio_db
contacts_collection = db.contacts

# Pydantic models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime
    status: str = "new"

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Portfolio API is running"}

# Contact form endpoint
@app.post("/api/contact", response_model=dict)
async def submit_contact_form(contact: ContactMessage):
    try:
        # Create contact document
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "message": contact.message,
            "created_at": datetime.utcnow(),
            "status": "new"
        }
        
        # Insert into MongoDB
        result = contacts_collection.insert_one(contact_doc)
        
        if result.inserted_id:
            return {
                "success": True,
                "message": "Contact message submitted successfully",
                "id": contact_doc["id"]
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save contact message")
            
    except Exception as e:
        print(f"Error saving contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Get all contact messages (admin endpoint)
@app.get("/api/contacts", response_model=list)
async def get_contact_messages():
    try:
        contacts = list(contacts_collection.find({}, {"_id": 0}).sort("created_at", -1))
        return contacts
    except Exception as e:
        print(f"Error fetching contact messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact messages")

# Get contact message by ID
@app.get("/api/contacts/{contact_id}")
async def get_contact_message(contact_id: str):
    try:
        contact = contacts_collection.find_one({"id": contact_id}, {"_id": 0})
        if not contact:
            raise HTTPException(status_code=404, detail="Contact message not found")
        return contact
    except Exception as e:
        print(f"Error fetching contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact message")

# Update contact message status
@app.put("/api/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str):
    try:
        result = contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact message not found")
        
        return {"success": True, "message": "Status updated successfully"}
    except Exception as e:
        print(f"Error updating contact status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update contact status")

# Portfolio stats endpoint
@app.get("/api/stats")
async def get_portfolio_stats():
    try:
        total_contacts = contacts_collection.count_documents({})
        new_contacts = contacts_collection.count_documents({"status": "new"})
        
        return {
            "total_contacts": total_contacts,
            "new_contacts": new_contacts,
            "projects_completed": 50,  # Static for now
            "years_experience": 4,     # Static for now
            "happy_clients": 25        # Static for now
        }
    except Exception as e:
        print(f"Error fetching portfolio stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio stats")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
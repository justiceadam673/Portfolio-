#!/usr/bin/env python3
import requests
import json
import time
import sys
from datetime import datetime

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://aa1a688c-0d16-4115-98db-d30ae18a5b88.preview.emergentagent.com"

# Test data
test_contact = {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "Hello, I'm interested in your portfolio and would like to discuss a potential project."
}

def print_separator():
    print("\n" + "="*80 + "\n")

def test_health_check():
    """Test the health check endpoint"""
    print("Testing Health Check Endpoint (/api/health)...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Health check failed with non-200 status code"
        assert response.json()["status"] == "healthy", "Health check did not return 'healthy' status"
        
        print("✅ Health Check Test: PASSED")
        return True
    except Exception as e:
        print(f"❌ Health Check Test: FAILED - {str(e)}")
        return False

def test_contact_form():
    """Test the contact form endpoint"""
    print("Testing Contact Form Endpoint (/api/contact)...")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/contact",
            json=test_contact
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Contact form submission failed with non-200 status code"
        assert response.json()["success"] == True, "Contact form submission did not return success=True"
        assert "id" in response.json(), "Contact form submission did not return a contact ID"
        
        # Store the contact ID for later verification
        contact_id = response.json()["id"]
        print(f"Contact ID: {contact_id}")
        
        print("✅ Contact Form Test: PASSED")
        return contact_id
    except Exception as e:
        print(f"❌ Contact Form Test: FAILED - {str(e)}")
        return None

def test_get_contacts():
    """Test retrieving all contacts"""
    print("Testing Get All Contacts Endpoint (/api/contacts)...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/contacts")
        print(f"Status Code: {response.status_code}")
        print(f"Response contains {len(response.json())} contacts")
        
        assert response.status_code == 200, "Get contacts failed with non-200 status code"
        assert isinstance(response.json(), list), "Get contacts did not return a list"
        
        # Check if our test contact is in the list
        found = False
        for contact in response.json():
            if contact["email"] == test_contact["email"] and contact["name"] == test_contact["name"]:
                found = True
                print(f"Found our test contact in the database: {contact}")
                break
        
        assert found, "Our test contact was not found in the database"
        
        print("✅ Get Contacts Test: PASSED")
        return True
    except Exception as e:
        print(f"❌ Get Contacts Test: FAILED - {str(e)}")
        return False

def test_get_contact_by_id(contact_id):
    """Test retrieving a specific contact by ID"""
    print(f"Testing Get Contact by ID Endpoint (/api/contacts/{contact_id})...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/contacts/{contact_id}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Get contact by ID failed with non-200 status code"
        assert response.json()["id"] == contact_id, "Contact ID in response does not match requested ID"
        assert response.json()["email"] == test_contact["email"], "Contact email does not match test data"
        assert response.json()["name"] == test_contact["name"], "Contact name does not match test data"
        assert response.json()["message"] == test_contact["message"], "Contact message does not match test data"
        
        print("✅ Get Contact by ID Test: PASSED")
        return True
    except Exception as e:
        print(f"❌ Get Contact by ID Test: FAILED - {str(e)}")
        return False

def test_portfolio_stats():
    """Test the portfolio stats endpoint"""
    print("Testing Portfolio Stats Endpoint (/api/stats)...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/stats")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Portfolio stats failed with non-200 status code"
        assert "total_contacts" in response.json(), "Portfolio stats does not include total_contacts"
        assert "new_contacts" in response.json(), "Portfolio stats does not include new_contacts"
        assert "projects_completed" in response.json(), "Portfolio stats does not include projects_completed"
        assert "years_experience" in response.json(), "Portfolio stats does not include years_experience"
        assert "happy_clients" in response.json(), "Portfolio stats does not include happy_clients"
        
        print("✅ Portfolio Stats Test: PASSED")
        return True
    except Exception as e:
        print(f"❌ Portfolio Stats Test: FAILED - {str(e)}")
        return False

def test_update_contact_status(contact_id):
    """Test updating a contact's status"""
    print(f"Testing Update Contact Status Endpoint (/api/contacts/{contact_id}/status)...")
    
    try:
        response = requests.put(
            f"{BACKEND_URL}/api/contacts/{contact_id}/status?status=read"
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200, "Update contact status failed with non-200 status code"
        assert response.json()["success"] == True, "Update contact status did not return success=True"
        
        # Verify the status was updated
        verify_response = requests.get(f"{BACKEND_URL}/api/contacts/{contact_id}")
        assert verify_response.json()["status"] == "read", "Contact status was not updated to 'read'"
        
        print("✅ Update Contact Status Test: PASSED")
        return True
    except Exception as e:
        print(f"❌ Update Contact Status Test: FAILED - {str(e)}")
        return False

def run_all_tests():
    """Run all tests and return overall result"""
    print_separator()
    print("STARTING BACKEND API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print_separator()
    
    # Dictionary to track test results
    results = {}
    
    # Test health check
    results["health_check"] = test_health_check()
    print_separator()
    
    # Test contact form submission
    contact_id = test_contact_form()
    results["contact_form"] = contact_id is not None
    print_separator()
    
    # If contact form test passed, test related endpoints
    if contact_id:
        # Give MongoDB a moment to process the write
        time.sleep(1)
        
        # Test getting all contacts
        results["get_contacts"] = test_get_contacts()
        print_separator()
        
        # Test getting contact by ID
        results["get_contact_by_id"] = test_get_contact_by_id(contact_id)
        print_separator()
        
        # Test updating contact status
        results["update_contact_status"] = test_update_contact_status(contact_id)
        print_separator()
    
    # Test portfolio stats
    results["portfolio_stats"] = test_portfolio_stats()
    print_separator()
    
    # Print summary
    print("TEST SUMMARY:")
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
        if not passed:
            all_passed = False
    
    print_separator()
    if all_passed:
        print("🎉 ALL TESTS PASSED! 🎉")
    else:
        print("❌ SOME TESTS FAILED ❌")
    
    return all_passed

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
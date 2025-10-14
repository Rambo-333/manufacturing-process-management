# -*- coding: utf-8 -*-
"""
CSRF protection test
"""
import sys
sys.path.insert(0, '.')

from app.controllers.guide import app

def test_csrf():
    with app.test_client() as client:
        print("="*60)
        print("CSRF Protection Test")
        print("="*60)

        # Test 1: GET request (no CSRF needed)
        print("\nTest 1: GET /vi")
        response = client.get('/vi')
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Result: OK - Page loaded successfully")
        else:
            print("Result: FAIL")

        # Test 2: POST without CSRF token (should fail)
        print("\nTest 2: POST /vi without CSRF token (should be rejected)")
        response = client.post('/vi', data={
            'lotno': 'TEST001',
            'processDay1': '2025-01-01T10:00',
            'man1': 'Test Worker'
        })
        print(f"Status: {response.status_code}")
        if response.status_code == 400:
            print("Result: OK - Request correctly rejected (CSRF protection working)")
        else:
            print(f"Result: WARNING - Request not rejected (status {response.status_code})")

        print("\n" + "="*60)
        print("Test completed")
        print("="*60)

if __name__ == '__main__':
    test_csrf()

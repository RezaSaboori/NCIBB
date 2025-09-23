# backend/authentication/tests/test_profile.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from ..models import UserProfile

User = get_user_model()

class ProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_profile_creation(self):
        """Test profile is created automatically"""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsInstance(self.user.profile, UserProfile)
    
    def test_profile_update(self):
        """Test profile update"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'bio': 'Test bio'
        }
        response = self.client.patch(f'/api/auth/profile/{self.user.profile.pk}/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.first_name, 'John')

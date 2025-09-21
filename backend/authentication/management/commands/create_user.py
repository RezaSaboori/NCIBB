from django.core.management.base import BaseCommand
from authentication.models import User


class Command(BaseCommand):
    help = 'Create a new user'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True, help='Username')
        parser.add_argument('--email', type=str, required=True, help='Email address')
        parser.add_argument('--password', type=str, required=True, help='Password')
        parser.add_argument('--first-name', type=str, required=True, help='First name')
        parser.add_argument('--last-name', type=str, required=True, help='Last name')
        parser.add_argument('--role', type=str, default='user', choices=['admin', 'manager', 'user', 'guest'], help='User role')
        parser.add_argument('--phone', type=str, help='Phone number')
        parser.add_argument('--is-active', action='store_true', help='Make user active')

    def handle(self, *args, **options):
        try:
            user = User.objects.create_user(
                username=options['username'],
                email=options['email'],
                password=options['password'],
                first_name=options['first_name'],
                last_name=options['last_name'],
                role=options['role'],
                phone=options.get('phone', ''),
                is_active=options['is_active']
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {user.username} ({user.email})')
            )
            self.stdout.write(f'User ID: {user.id}')
            self.stdout.write(f'Role: {user.role}')
            self.stdout.write(f'Active: {user.is_active}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating user: {str(e)}')
            )

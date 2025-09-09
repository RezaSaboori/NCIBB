# NCIBB User Credentials

This document contains the test user credentials for the NCIBB user management system.

## 🔐 Test Users

### Admin User
- **Username**: `admin`
- **Email**: `admin@ncibb.com`
- **Password**: `(set during superuser creation)`
- **Role**: `admin`
- **Status**: Active
- **Description**: Superuser with full system access

### Test User
- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `testpass123`
- **Role**: `user`
- **Status**: Active
- **Description**: Regular user for testing standard functionality

### Manager User
- **Username**: `manager1`
- **Email**: `manager@example.com`
- **Password**: `managerpass123`
- **Role**: `manager`
- **Status**: Active
- **Description**: Manager with project management and user oversight capabilities

### Guest User
- **Username**: `guest1`
- **Email**: `guest@example.com`
- **Password**: `guestpass123`
- **Role**: `guest`
- **Status**: Active
- **Description**: Guest user with limited access

## 🚀 How to Use These Credentials

### Frontend Login
1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to: `http://localhost:3000/login`
3. Use any of the above credentials to login

### Backend Admin Panel
1. Start the backend: `python manage.py runserver`
2. Navigate to: `http://localhost:8000/admin/`
3. Use admin credentials to access the admin panel

### API Testing
You can test the API endpoints using these credentials:

```bash
# Login via API
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

## 🔒 User Roles & Permissions

### Admin
- Full system access
- User management
- All CRUD operations
- System configuration

### Manager
- Project management
- User oversight (limited)
- Credit management
- Messaging system

### User
- Standard user access
- Project participation
- Credit transactions
- Messaging

### Guest
- Limited access
- View-only permissions
- Basic functionality

## 📝 Notes

- All test users are created with active status
- Phone numbers are set to `+1234567890` format
- Users are created with proper role-based permissions
- These are test credentials - change passwords in production

## 🔄 Creating New Users

### Via Management Command
```bash
python manage.py create_user --username newuser --email new@example.com --password password123 --first-name New --last-name User --role user --phone "+1234567890" --is-active
```

### Via Frontend Registration
1. Go to `http://localhost:3000/register`
2. Fill out the registration form
3. User will be automatically logged in

### Via Django Admin
1. Go to `http://localhost:8000/admin/`
2. Login as admin
3. Navigate to Users section
4. Add new user

---

**⚠️ Security Note**: These are test credentials. In production, ensure all passwords are strong and unique.

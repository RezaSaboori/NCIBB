# NCIBB - Professional User Management System

A comprehensive Django + React user management system with JWT authentication, role-based permissions, and modern dashboard architecture.

## 🚀 Features

### Backend (Django + DRF)
- **JWT Authentication** with automatic token refresh
- **Role-based permissions** (Admin, Manager, User, Guest)
- **Custom User Model** with profiles and verification
- **Credits System** with transaction tracking
- **Project Management** with collaboration features
- **Messaging System** with notifications
- **REST API** with comprehensive endpoints
- **Admin Panel** for user management

### Frontend (React + Material-UI)
- **Responsive Dashboard** with Material-UI components
- **Role-based UI rendering** based on user permissions
- **Real-time data updates** with React hooks
- **Professional admin panel** for user management
- **Credit tracking and transaction history**
- **Project collaboration interface**
- **Inbox messaging system**

## 🛠️ Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- JWT Authentication (djangorestframework-simplejwt)
- PostgreSQL (production) / SQLite (development)
- Celery + Redis (background tasks)
- CORS headers for cross-origin requests

### Frontend
- React 19.1.1
- Vite (build tool)
- Material-UI 7.3.2
- Redux Toolkit 2.9.0
- React Router DOM 7.8.2
- Axios for API calls
- React Hook Form + Yup validation

## 📁 Project Structure

```
NCIBB/
├── backend/
│   ├── authentication/          # User authentication & profiles
│   ├── credits/                 # Credits system & transactions
│   ├── projects/                # Project management
│   ├── messaging/               # User messaging system
│   ├── core/                    # Core utilities & admin stats
│   └── ncibb/                   # Django settings
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── auth/           # Authentication forms
│   │   │   ├── admin/          # Admin components
│   │   │   └── common/         # Shared components
│   │   ├── services/           # API services
│   │   ├── store/              # Redux store
│   │   └── pages/              # Page components
│   └── public/
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (for production)
- Redis (for background tasks)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NCIBB
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   
   # Start development server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Backend API: http://localhost:8000/api/
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:8000/admin/

### Docker Setup

1. **Using Docker Compose**
   ```bash
   # Start all services
   docker-compose up --build
   
   # Run migrations
   docker-compose exec backend python manage.py migrate
   
   # Create superuser
   docker-compose exec backend python manage.py createsuperuser
   ```

2. **Access the application**
   - Backend API: http://localhost:8000/api/
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:8000/admin/

## 🔐 Authentication

### Default Admin Account
- **Username**: admin
- **Email**: admin@ncibb.com
- **Password**: (set during superuser creation)

### User Roles
- **Admin**: Full system access, user management
- **Manager**: Project management, user oversight
- **User**: Standard user access
- **Guest**: Limited access

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/dashboard/` - User dashboard data
- `GET /api/auth/profile/` - User profile
- `PATCH /api/auth/profile/` - Update profile

### Credits
- `GET /api/credits/` - User credit balance
- `GET /api/credits/transactions/` - Credit transactions
- `POST /api/credits/add/` - Add credits (admin only)
- `POST /api/credits/spend/` - Spend credits

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}/` - Project details
- `PATCH /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

### Messaging
- `GET /api/messaging/messages/` - List messages
- `POST /api/messaging/send/` - Send message
- `GET /api/messaging/inbox/` - Inbox summary
- `GET /api/messaging/notifications/` - Notifications

## 🎨 Frontend Components

### Dashboard Components
- **UserDashboard**: Main user dashboard with stats and quick actions
- **AdminDashboard**: Admin panel with user management and system stats

### Authentication Components
- **LoginForm**: User login with validation
- **RegisterForm**: User registration with validation

### Common Components
- **ProtectedRoute**: Route protection based on authentication and roles

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ncibb_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Production Setup

1. **Update settings for production**
   ```python
   # Use production settings
   ENVIRONMENT=production
   ```

2. **Configure database**
   ```bash
   # Use PostgreSQL in production
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'ncibb_db',
           'USER': 'postgres',
           'PASSWORD': 'your-password',
           'HOST': 'your-host',
           'PORT': '5432',
       }
   }
   ```

3. **Build and deploy**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Deploy backend
   python manage.py collectstatic
   gunicorn ncibb.wsgi:application
   ```

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Django, React, and Material-UI**
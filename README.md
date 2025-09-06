# NCIBB - National Center for Integrative Bioinformatics and Biotechnology

A modern Django web application for bioinformatics research and services.

## Features

- **Modern UI**: Clean, responsive design with Bootstrap 5
- **Multi-page Site**: Home, About, and Contact pages
- **Interactive Elements**: Smooth animations and user interactions
- **Contact Form**: Functional contact form with validation
- **Mobile Responsive**: Optimized for all device sizes

## Technology Stack

- **Backend**: Django 4.2.7
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Icons**: Font Awesome 6
- **Database**: SQLite (default)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NCIBB
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver 1234
   ```

7. **Open your browser**
   Navigate to `http://127.0.0.1:1234/`

## Project Structure

```
NCIBB/
├── manage.py
├── requirements.txt
├── README.md
├── ncibb/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── main/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── templates/
│   ├── base.html
│   └── main/
│       ├── home.html
│       ├── about.html
│       └── contact.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

## Pages

- **Home** (`/`): Landing page with hero section and feature overview
- **About** (`/about/`): Information about NCIBB's mission and expertise
- **Contact** (`/contact/`): Contact form and company information

## Customization

### Adding New Pages

1. Create a new view in `main/views.py`
2. Add the URL pattern in `main/urls.py`
3. Create a template in `templates/main/`
4. Update the navigation in `templates/base.html`

### Styling

- Main styles: `static/css/style.css`
- Uses Bootstrap 5 for responsive design
- Custom CSS variables for consistent theming

### JavaScript

- Main functionality: `static/js/main.js`
- Includes form validation, animations, and interactive features

## Development

### Running Tests
```bash
python manage.py test
```

### Collecting Static Files
```bash
python manage.py collectstatic
```

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## Deployment

For production deployment:

1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Configure a production database
4. Set up static file serving
5. Use a production WSGI server like Gunicorn

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact us through the website contact form or email info@ncibb.org.

"""
Django settings for shoping project.
"""

from pathlib import Path
import os

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ ตั้งค่า Static & Media
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media/")

# ✅ ตั้งค่า Secret Key
SECRET_KEY = 'django-insecure-t=278n2b3dn-ke#e&z_s0(kw8=gi47bcy50xx!ndy17peynb03'
DEBUG = True

# ✅ ตั้งค่า Host ที่อนุญาต
ALLOWED_HOSTS = ["*", "127.0.0.1", "[ 2001:44c8:42c5:f5a6:8333:a098:14e6:42b8]"]

# ✅ ติดตั้งแอปที่ต้องใช้
INSTALLED_APPS = [
    "daphne",
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "productapp",
    "userapp",
    "cartapp",
    "orderapp",
    "Dashboard",
    "DashboardUser",
    "chat",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "rangefilter",'django.contrib.humanize',
]

# ✅ Channels (WebSocket)
ASGI_APPLICATION = "shoping.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

# ✅ Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 1,
}

# ✅ Middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # ✅ CORS ต้องอยู่ด้านบนสุด!
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.cache.UpdateCacheMiddleware",
]



# ✅ อนุญาตให้ใช้ CORS (Cross-Origin)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "content-type",
    "X-CSRFToken",
]

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://[2001:44c8:42c5:f5a6:8333:a098:14e6:42b8]:8080",
]

# ✅ อนุญาตให้ CSRF ทำงานกับไอพีเซิร์ฟเวอร์
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://[2001:44c8:42c5:f5a6:8333:a098:14e6:42b8]:8080",
]

# ✅ ปิด `SECURE_CROSS_ORIGIN_OPENER_POLICY`
SECURE_CROSS_ORIGIN_OPENER_POLICY = None

# ✅ URL Configuration
ROOT_URLCONF = "shoping.urls"

# ✅ Templates Configuration
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ✅ WSGI
WSGI_APPLICATION = "shoping.wsgi.application"

# ✅ Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ✅ Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ✅ Language & TimeZone
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Bangkok"
USE_I18N = True
USE_TZ = True

# ✅ Default Auto Field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGIN_URL = '/login_cover/'  # กำหนด URL ที่ให้ redirect ไปหน้า login

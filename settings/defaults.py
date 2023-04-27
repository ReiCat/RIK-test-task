import os
import logging

""" PATH CONSTANTS """
SETTINGS_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_PATH = os.path.dirname(SETTINGS_PATH)
TEMPLATES_PATH = os.path.join(PROJECT_PATH, "templates")
STATIC_PATH = os.path.join(PROJECT_PATH, "static")
MEDIA_PATH = os.path.join(PROJECT_PATH, "media")
LOGS_PATH = os.path.join(PROJECT_PATH, "logs")
LOG_FILE_PATH = os.path.join(LOGS_PATH, "log.log")

""" WEBSERVER SETTINGS """
SERVER_ADDRESS = "127.0.0.1"
SERVER_PORT = 8000
DEBUG = False
COOKIE_SECRET = "teJAyHREJhgQpSqG98LyEwr"
XSRF_COOKIES = True
DT_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"

JWT_SERVER_SECRET = "rDuESC9kt2MZTwwSkfXeWX9rTghxMQ"
JWT_EXPIRES_IN = 86400  # seconds
JWT_TOKEN_TYPE = "Bearer"
JWT_ALGORITHM = "HS256"
JWT_TOKEN_NAME = "Authorization"
API_KEY_NAME = "X-API-Key"

""" LOG SETTINGS """
LOG_LEVEL = logging.INFO
LOG_FILE_PATH = os.path.join(LOGS_PATH, "log.log")
LOG_WHEN = "D"  # "D" means - daily
LOG_INTERVAL = 1  # every day
LOG_BACKUP_COUNT = (
    7  # If backupCount is nonzero, at most backupCount files will be kept
)

""" DATABASE """
DB_HOST = '127.0.0.1'
DB_PORT = 5432
DB_NAME = 'rtls'
DB_USER = 'postgres'
DB_PASSWORD = 'user_password'
DB_ECHO_REQUESTS = False
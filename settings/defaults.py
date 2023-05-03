import os

""" PATH CONSTANTS """
SETTINGS_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_PATH = os.path.dirname(SETTINGS_PATH)
STATIC_PATH = os.path.join(PROJECT_PATH, "static")

""" WEBSERVER SETTINGS """
SERVER_ADDRESS = "127.0.0.1"
SERVER_PORT = 8000
DEBUG = False
DT_FORMAT = "%Y-%m-%d"

""" DATABASE """
DB_HOST = '127.0.0.1'
DB_PORT = 5432
DB_NAME = 'test_rik'
DB_USER = 'test_rik'
DB_PASSWORD = 'test_rik'
DB_ECHO_REQUESTS = False
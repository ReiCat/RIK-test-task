# RIK test task

## Steps to run locally

To run this project the Python 3.10 and PostgreSQL 14.7 is required.

### Create database & user with password

`$ sudo -u postgres psql`

`postgres=# create database test_rik;`

`postgres=# create user test_rik with encrypted password 'test_rik';`

`postgres=# grant all privileges on database test_rik to test_rik;`

`postgres=# \q`

### Create virtual environment for the project

`$ virtualenv -p python3 venv`

### Activate it

`$ source venv/bin/activate`

### Install all the requirements

`$ pip install -r requirements.txt`

### Run the server

`$ python main.py`
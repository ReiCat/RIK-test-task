VENV_PATH?=./venv
PYTHON=${VENV_PATH}/bin/python3
ACTIVATE=. ${VENV_PATH}/bin/activate

run:
	export PYTHONPATH=$$(pwd) && ${PYTHON} main.py

install:
	${ACTIVATE} && pip install -r ./requirements.txt
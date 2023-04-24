VENV_PATH?=./venv
PYTHON=${VENV_PATH}/bin/python3
PYTEST=${VENV_PATH}/bin/pytest
ACTIVATE=. ${VENV_PATH}/bin/activate

test:
	${PYTEST} --cov-config=.coveragerc --cov=server -s

run:
	export PYTHONPATH=$$(pwd) && ${PYTHON} main.py

install:
	${ACTIVATE} && pip install -r ./requirements.txt
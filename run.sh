#!/bin/bash
# source venv/bin/activate
python3 main.py
# gunicorn -b 0.0.0.0:5000 -w 4 main:app #--log-level debug

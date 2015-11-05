#!/bin/bash
source venv/bin/activate
# python3 main.py
gunicorn -b 0.0.0.0:5000 main:app #--log-level debug

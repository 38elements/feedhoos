#!/bin/bash

if [ $# -eq 0 ]; then
    exit 1
fi

python manage.py runserver $1

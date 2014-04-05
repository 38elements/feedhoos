#!/bin/bash

cd  feedhoos/fixtures
python -m SimpleHTTPServer 45000 > /dev/null 2>&1 &
cd ../..
python manage.py test feedhoos.tests
kill -Kill `ps aux | grep "python -m SimpleHTTPServer 45000" | awk '{print $2;}' | sort -n | head -1`

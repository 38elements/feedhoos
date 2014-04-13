#!/bin/bash
./node_modules/karma/bin/karma  start   feedhoos/tests/karma.conf.js
kill -Kill `ps aux | grep "karma" | awk '{print $2;}' | sort -n | head -1`
cd  feedhoos/fixtures
python -m SimpleHTTPServer 45000 > /dev/null 2>&1 &
cd ../..
python manage.py test feedhoos.tests
kill -Kill `ps aux | grep "python -m SimpleHTTPServer 45000" | awk '{print $2;}' | sort -n | head -1`

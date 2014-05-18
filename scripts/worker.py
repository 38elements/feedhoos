# coding: utf-8
import sys
import os
import datetime
sys.path.append("/path/to/feedhoos")
os.environ['DJANGO_SETTINGS_MODULE'] = "feedhoos.settings"
from feedhoos.apps.finder.models.feed import FeedModel

with open('/home/miya/worker.txt', "a") as f:
    ds = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n"
    f.write("start: " + ds)
    f.close()

map(lambda f: f.add_entries(), FeedModel.objects.all())

with open('/home/miya/worker.txt', "a") as f:
    ds = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n"
    f.write("end: " + ds)
    f.close()

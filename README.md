feedhoos
========
pip install feedfinder2   
pip install django   
pip install feedparser   
pip install django-debug-toolbar
  
python manage.py syncdb  
  
change the path that is described in scripts/feedhoos        
/usr/bin/python /path/to/feedhoos/scripts/worker.py > /dev/null 2>&1  
  
change the path that is described in scripts/worker.py   
sys.path.append("/path/to/feedhoos")   
with open('/path/to/feedhoos/worker.txt', "a") as f:  
with open('/path/to/feedhoos/worker.txt', "a") as f:  
   
put scripts/feedhoos to /etc/cron.hourly   
   
chmod+x /etc/cron.hourly/feedhoos   
   
./run.sh


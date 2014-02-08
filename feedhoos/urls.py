from django.conf.urls import patterns, include, url
from django.conf import settings
import feedhoos.reader.views.index
import feedhoos.reader.urls
import feedhoos.finder.urls
#from django.contrib import admin
#admin.autodiscover()
urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'feedhoos.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', feedhoos.reader.views.index.execute, name="top"),
    url(r'^reader/', include(feedhoos.reader.urls, namespace="reader")),
    url(r'^finder/', include(feedhoos.finder.urls, namespace="finder")),
)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns(
        '',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

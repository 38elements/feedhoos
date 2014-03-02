from django.conf.urls import patterns, include, url
from django.conf import settings
import feedhoos.reader.views.index
import feedhoos.reader.urls
import feedhoos.finder.urls
import feedhoos.worker.urls
import feedhoos.bookmark.urls
import feedhoos.folder.urls
from django.contrib import admin
admin.autodiscover()
urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'feedhoos.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', feedhoos.reader.views.index.execute, name="top"),
    url(r'^reader/', include(feedhoos.reader.urls, namespace="reader")),
    url(r'^finder/', include(feedhoos.finder.urls, namespace="finder")),
    url(r'^worker/', include(feedhoos.worker.urls, namespace="worker")),
    url(r'^bookmark/', include(feedhoos.bookmark.urls, namespace="bookmark")),
    url(r'^folder/', include(feedhoos.folder.urls, namespace="folder")),
)
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns(
        '',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )

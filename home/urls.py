from django.conf.urls import url
from home import views

urlpatterns = [
    url(r'^$', views.index, name='home'),
]

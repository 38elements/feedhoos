# coding: utf-8
from django import template
import datetime


register = template.Library()


@register.filter
def datetime_string(unixtime):
    datetime_obj = datetime.datetime.fromtimestamp(unixtime)
    return datetime_obj.strftime('%Y-%m-%d %H:%M')

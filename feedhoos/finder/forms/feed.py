# coding: utf-8
from django import forms


class FeedForm(forms.Form):
    url = forms.URLField(
        required=True,
        label="url",
        widget=forms.URLInput(attrs=None),
        max_length=512
    )

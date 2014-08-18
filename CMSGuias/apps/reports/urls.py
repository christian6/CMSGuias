# -*- coding: utf-8 -*-
#from django.conf.urls.defaults import patterns, url
from django.conf.urls import patterns, url
from .views import *


urlpatterns = patterns('CMSGuias.apps.reports.views',
	#report test
	url(r'^test/$','view_test_pdf',name='vista_report'),
	# reports
	url(r'^orders/(?P<pid>.*)/(?P<sts>.*)/','rpt_orders_details',name='rpt_orders'),
	url(r'^guidereferral/(?P<gid>.*)/(?P<pg>.*)/$','rpt_guide_referral_format',name='rpt_guide_referral'),
	url(r'^supply/(?P<sid>.*)/$', RptSupply.as_view(), name='rpt_supply'),
    url(r'^quote/(?P<qid>.*)/(?P<pid>.*)/$', RptQuote.as_view(), name='rpt_quote'),
    url(r'^order/purchase/(?P<pk>.*)/$', RptPurchase.as_view(), name='rpt_purchase'),
)
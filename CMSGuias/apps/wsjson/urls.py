# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('CMSGuias.apps.wsjson.views',
	# temp Orders
	url(r'^get/materials/name/$','get_description_materials'),
	url(r'^get/meter/materials/$','get_meter_materials'),
	url(r'^get/resumen/details/materiales/$','get_resumen_details_materiales'),
	url(r'^post/aggregate/tmp/materials/$','save_order_temp_materials'),
	url(r'^post/update/tmp/materials/','update_order_temp_materials'),
	url(r'^post/delete/tmp/materials/', 'delete_order_temp_material'),
	url(r'^post/delete/all/temp/order/','delete_all_temp_order'),
	url(r'^get/list/temp/order/','get_list_order_temp'),
	# temp Oreders Nipples
	url(r'^get/nipples/temp/oreder/','get_list_beside_nipples_temp_orders'),
	url(r'^get/list/temp/nipples/$','get_list_temp_nipples'),
	url(r'^post/saved/temp/nipples/','post_saved_update_temp_nipples'),
	url(r'^post/delete/temp/nipples/item/','post_delete_temp_item_nipple'),
	url(r'^post/delete/all/temp/nipples/','post_delete_temp_all_nipple'),
	# url recurrent
	url(r'^get/details/materials/$','get_details_materials_by_id'),
	url(r'^get/projects/list/$','get_list_projects'),
	url(r'^get/sectors/list/$','get_list_sectors'),
	url(r'^get/subprojects/list/$','get_list_subprojects'),
	url(r'^get/stores/list/$','get_list_stores'),
)
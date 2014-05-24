#-*- Encoding: utf-8 -*-
from django.shortcuts import render_to_response, get_object_or_404, get_list_or_404
from django.template import RequestContext, TemplateDoesNotExist
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib import messages
from django.contrib.auth.models import User
from django.db.models import Q
from CMSGuias.apps.almacen import models
from CMSGuias.apps.almacen import forms
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Max
from django.utils import simplejson
from CMSGuias.apps.almacen import genkeys
import datetime

##
#  Declare variables
##
FORMAT_DATE_STR = "%Y-%m-%d"

@login_required(login_url='/SignUp/')
def view_pedido(request):
	try:
		if request.method == 'GET':
			#print request.user.get_profile().empdni
			return render_to_response('almacen/pedido.html',context_instance=RequestContext(request))
		if request.method == 'POST':
			data = {}
			form = forms.addOrdersForm(request.POST,request.FILES)
			if form.is_valid():
				# bedside Orders
				add = form.save(commit=False)
				id = genkeys.GenerateIdOrders()
				add.pedido_id = id
				add.status= 'PE'
				add.flag = True
				add.save()
				# detail Orders Details
				tmpd = models.tmppedido.objects.filter(empdni__exact=request.user.get_profile().empdni)
				for x in tmpd:
					det = models.Detpedido()
					det.pedido_id = id
					det.materiales_id = x.materiales_id
					det.cantidad = x.cantidad
					det.cantshop = x.cantidad
					det.save()
				# saved niples of tmpniple
				tmpn = models.tmpniple.objects.filter(empdni__exact=request.user.get_profile().empdni)
				for x in tmpn:
					nip = models.Niple()
					nip.pedido_id = id
					nip.proyecto_id = request.POST.get('proyecto')
					nip.subproyecto_id = request.POST.get('subproyecto')
					nip.sector_id = request.POST.get('sector')
					nip.empdni = request.user.get_profile().empdni
					nip.materiales_id= x.materiales_id
					nip.cantidad = x.cantidad
					nip.cantshop = x.cantidad
					nip.metrado = x.metrado
					nip.tipo = x.tipo
					nip.save()
				# deleting tmps
				tmp = models.tmppedido.objects.filter(empdni__exact=request.user.get_profile().empdni)
				tmp.delete()
				tmp = models.tmpniple.objects.filter(empdni__exact=request.user.get_profile().empdni)
				tmp.delete()
				data['status']= True
			else:
				data['status']= False
			return HttpResponse(simplejson.dumps(data), mimetype="application/json")
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')

@login_required(login_url='/SignUp/')
def view_keep_customers(request):
	try:
		if request.method == 'GET':
			lista = models.Cliente.objects.values('ruccliente_id','razonsocial','direccion','telefono').filter(flag=True).order_by('razonsocial')			
			ctx = { "lista": lista }
			return render_to_response("almacen/customers.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "ruc" in request.POST:
				data = {}
				try:
					obj = models.Cliente.objects.get(pk=request.POST.get('ruc'))
					obj.flag = False
					obj.save()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data), mimetype="application/json")
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')

@login_required(login_url='/SignUp/')
def view_keep_add_customers(request):
	try:
		info = "Iniciando"
		if request.method == 'POST':
			if models.Cliente.objects.filter(pk=request.POST.get('ruccliente_id')).count() > 0:
				add = models.Cliente.objects.get(pk=request.POST.get('ruccliente_id'))
				add.razonsocial = request.POST.get('razonsocial')
				add.pais_id = request.POST.get('pais')
				add.departamento_id = request.POST.get('departamento')
				add.provincia_id = request.POST.get('provincia')
				add.distrito_id = request.POST.get('distrito')
				add.direccion = request.POST.get('direccion')
				add.telefono = request.POST.get('telefono')
				add.flag = True
				add.save()
			else:
				form = forms.addCustomersForm(request.POST)
				if form.is_valid():
						add = form.save(commit=False)
						add.flag = True
						add.save()
			#form.save_m2m() # esto es para guardar las relaciones ManyToMany
			return HttpResponseRedirect("/almacen/keep/customers/")
		if request.method == 'GET':
			form = forms.addCustomersForm()
		ctx = { "form": form, "info": info }
		return render_to_response("almacen/addcustomers.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')

@login_required(login_url='/SignUp/')
def view_keep_edit_customers(request,ruc):
	try:
		c = models.Cliente.objects.get(pk__exact=ruc)
		if request.method == 'GET':
			form = forms.addCustomersForm(instance=c)
		elif request.method == 'POST':
			form = forms.addCustomersForm(request.POST,instance=c)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.flag = True
				edit.save()
				return HttpResponseRedirect("/almacen/keep/customers/")
		ctx = { "form": form }
		return render_to_response("almacen/editcustomers.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')

# Project keep views
@login_required(login_url='/SignUp/')
def view_keep_project(request):
	try:
		if request.method == 'GET':
			lista = models.Proyecto.objects.filter(flag=True).order_by("nompro")
			return render_to_response('almacen/project.html',{"lista":lista, "tsid": u""},context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "proid" in request.POST:
				data = {}
				try:
					# sectores
					obj = models.Sectore.objects.filter(proyecto_id=request.POST.get('proid'))
					obj.status = 'DA'
					obj.flag = False
					obj.save()
					obj = models.Subproyecto.objects.filter(proyecto_id=request.POST.get('proid'))
					obj.status = 'DA'
					obj.flag = False
					obj.save()
					obj = models.Proyecto.objects.get(pk=request.POST.get('proid'))
					obj.status = 'DA'
					obj.flag = False
					obj.save()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data), mimetype="application/json")
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp/')
def view_keep_add_project(request):
	try:
		if request.method == 'POST':
			if models.Proyecto.objects.filter(pk=request.POST.get('proyecto_id')).count() > 0:
				add = models.Proyecto.objects.get(pk=request.POST.get('proyecto_id'))
				add.ruccliente_id = request.POST.get('ruccliente')
				add.nompro = request.POST.get('nompro')
				add.comienzo = datetime.datetime.strptime( request.POST.get('comienzo'), FORMAT_DATE_STR ).date() if request.POST.get('comienzo') is not None else datetime.datetime.today().date()
				add.fin = datetime.datetime.strptime(request.POST.get('fin'), FORMAT_DATE_STR).date() if request.POST.get('fin') is not None else None
				add.pais_id = request.POST.get('pais')
				add.departamento_id = request.POST.get('departamento')
				add.provincia_id = request.POST.get('provincia')
				add.distrito_id = request.POST.get('distrito')
				add.direccion = request.POST.get('direccion')
				add.obser = request.POST.get('obser')
				add.status = request.POST.get('status')
				add.flag = True
				add.save()
			else:
				form = forms.addProjectForm(request.POST)
				if form.is_valid():
						add = form.save(commit=False)
						# for table project have generate id
						cod = models.Proyecto.objects.all().aggregate(Max('proyecto_id'))
						if cod['proyecto_id__max'] is not None:
							aa = cod["proyecto_id__max"][2:4]
							an = datetime.datetime.today().strftime("%y")
							cou = cod["proyecto_id__max"][4:7]
							if int(an) > int(aa):
								aa = an
								cou = 1
							else:
								cou = ( int(cou) + 1 )
						else:
							aa = datetime.datetime.today().strftime("%y")
							cou = 1
						cod = "%s%s%s"%("PR",str(aa),"{:0>3d}".format(cou))
						add.proyecto_id = cod.strip()
						add.flag = True
						add.save()
			return HttpResponseRedirect("/almacen/keep/project/")
		if request.method == 'GET':
			form = forms.addProjectForm()
		ctx = { "form": form}
		return render_to_response("almacen/addproject.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp/')
def view_keep_edit_project(request,proid):
	try:
		c = models.Proyecto.objects.get(pk__exact=proid)
		if request.method == 'GET':
			form = forms.addProjectForm(instance=c)
		elif request.method == 'POST':
			# print request.POST.get('proyecto_id')
			form = forms.addProjectForm(request.POST,instance=c)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.flag = True
				#edit.proyecto_id = request.POST.get('proyecto_id')
				edit.save()
				return HttpResponseRedirect("/almacen/keep/project/")
		ctx = { "form": form, "idpro": proid }
		return render_to_response("almacen/editproject.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
# Sectors keep views
@login_required(login_url='/SignUp/')
def view_keep_sec_project(request,pid,sid):
	try:
		if request.method == 'GET':
			lista = models.Sectore.objects.filter(flag=True,proyecto__flag=True,proyecto_id__exact=pid,subproyecto_id=None if sid.strip() == "" else sid).order_by("sector_id")
			return render_to_response('almacen/sectores.html',{"lista":lista,"pid":pid,"sid":sid}, context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "sec" in request.POST:
				data = {}
				try:
					obj = models.Sectore.objects.get(proyecto_id=pid,subproyecto_id=None if sid.strip() == "" else sid,sector_id=request.POST.get('sec'))
					obj.delete()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data), mimetype='application/json')
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp/')
def view_keep_add_sector(request,proid,sid):
	try:
		if request.method == 'POST':
	 		form = forms.addSectoresForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				add.proyecto_id = request.POST.get('proyecto_id')
				add.subproyecto_id = request.POST.get('subproyecto_id')
				add.flag = True
				add.save()
				url = "/almacen/keep/sectores/%s/%s/"%(proid,sid)
				return HttpResponseRedirect(url)
			else:
				form = forms.addSectoresForm(request.POST)
				msg = "No se a podido realizar la transacción."
				ctx = { "form": form, "pid": proid, "sid": sid, "msg": msg }
				return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
		if request.method == 'GET':
			form = forms.addSectoresForm()
			ctx = { "form": form, "pid": proid, "sid": sid }
			return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp')
def view_keep_edit_sector(request,pid,sid,cid):
	try:
		sec = models.Sectore.objects.get(proyecto_id=pid,subproyecto_id=None if sid == "" else sid, sector_id=cid)
		if request.method == "GET":
			form = forms.addSectoresForm(instance=sec)
			ctx = { "form": form, "pid": pid, "sid": sid, "cid": cid }
			return render_to_response("almacen/editsector.html",ctx,context_instance=RequestContext(request))
		elif request.method == "POST":
			form = forms.addSectoresForm(request.POST,instance=sec)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.proyecto_id = request.POST.get('proyecto_id')
				edit.subproyecto_id = request.POST.get('subproyecto_id')
				edit.flag = True
				edit.save()
				url = "/almacen/keep/sectores/%s/%s/"%(pid,sid)
				return HttpResponseRedirect(url)
			else:
				form = forms.addSectoresForm(request.POST)
				msg = "No se a podido realizar la transacción."
				ctx = { "form": form, "pid": proid, "sid": sid, "msg": msg }
				return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, "No se puede mostrar la pagina.")
		raise Http404("Method not proccess")
# Subproyectos keep views
@login_required(login_url='/SignUp/')
def view_keep_sub_project(request,pid):
	try:
		if request.method == 'GET':
			lista = models.Subproyecto.objects.filter(flag=True,proyecto__flag=True,proyecto_id__exact=pid).order_by("subproyecto_id")
			return render_to_response('almacen/subproject.html',{"lista":lista,"pid":pid,"sid":""},context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "sid" in request.POST:
				data = {}
				try:
					obj = models.Sectore.objects.filter(proyecto_id=pid,subproyecto_id=request.POST.get('sid'))
					obj.delete()
					obj = models.Subproyecto.objects.get(subproyecto_id=request.POST.get('sid'),proyecto_id=pid)
					obj.delete()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data), mimetype="application/json")
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp/')
def view_keep_add_subproyeto(request,pid):
	try:
		if request.method == 'GET':
			form = forms.addSubprojectForm()
			ctx = {"form":form,"pid":pid}
			return render_to_response("almacen/addsubproyecto.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addSubprojectForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				add.proyecto_id = request.POST.get('proyecto_id')
				add.flag = True
				add.save()
				url = "/almacen/keep/subproyectos/%s/"%(pid)
				return HttpResponseRedirect(url)
			else:
				print 'Form no valid'
	except TemplateDoesNotExist, e:
		messages.error(request, 'Esta pagina solo acepta peticiones Encriptadas!')
		raise Http404('Method no proccess')
@login_required(login_url='/SignUp')
def view_keep_edit_subproyecto(request,pid,sid):
	try:
		sub = models.Subproyecto.objects.get(flag=True,proyecto__flag=True,proyecto_id__exact=pid,subproyecto_id=sid)
		if request.method == "GET":
			form = forms.addSubprojectForm(instance=sub)
			ctx = { "form": form, "pid": pid }
			return render_to_response("almacen/editsubproyecto.html",ctx,context_instance=RequestContext(request))
		elif request.method == "POST":
			form = forms.addSubprojectForm(request.POST,instance=sub)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.proyecto_id = request.POST.get('proyecto_id')
				edit.flag = True
				edit.save()
				url = "/almacen/keep/subproyectos/%s/"%(pid)
				return HttpResponseRedirect(url)
			else:
				form = forms.addSubprojectForm(request.POST)
				msg = "No se a podido realizar la transacción."
				ctx = { "form": form, "pid": pid,"msg": msg }
				return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages.error(request, "No se puede mostrar la pagina.")
		raise Http404("Method not proccess")
# Almacenes
@login_required(login_url='/SignUp/')
def view_stores(request):
	try:
		if request.method == 'GET':
			lista = models.Almacene.objects.filter(flag=True).order_by('nombre')
			ctx = { "lista": lista }
			return render_to_response("upkeep/almacenes.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			data = {}
			try:
				obj = models.Almacene.objects.get(pk=request.POST.get('aid'))
				obj.delete()
				data['status'] = True
			except ObjectDoesNotExist, e:
				data['status'] = False
			return HttpResponse(simplejson.dumps(data), mimetype="application/json")
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url='/SignUp/')
def view_stores_add(request):
	try:
		if request.method == 'GET':
			form = forms.addAlmacenesForm()
			ctx = { "form": form }
			return render_to_response("upkeep/addalmacen.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addAlmacenesForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				# generate id for Stores
				c_old = models.Almacene.objects.all().aggregate(Max('almacen_id'))
				if c_old['almacen_id__max'] is not None:
					cont = c_old['almacen_id__max'][2:4]
					cont = int(cont) + 1
				else:
					cont = 1
				add.almacen_id = "AL%s"%("{:0>2d}".format(cont))
				add.flag = True
				add.save()
				return HttpResponseRedirect("/almacen/upkeep/stores/")
			else:
				form = forms.addAlmacenesForm(request.POST)
				ctx = { "form": form, "msg": "Transaction unrealized." }
				return render_to_response("upkeep/addalmacen.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url='/SignUp/')
def view_stores_edit(request,aid):
	try:
		al = models.Almacene.objects.get(pk=aid)
		if request.method == 'GET':
			form = forms.addAlmacenesForm(instance=al)
			ctx = { "form": form, "aid": aid }
			return render_to_response("upkeep/editalmacen.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addAlmacenesForm(request.POST, instance=al)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.flag = True
				edit.save()
				url = "/almacen/upkeep/stores/"
				return HttpResponseRedirect(url)
			else:
				form = forms.addSubprojectForm(request.POST)
				msg = "No se a podido realizar la transacción."
				ctx = { "form": form, "almacen_id": almacen_id,"msg": msg }
				return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
# Transportistas
@login_required(login_url='/SignUp/')
def view_carrier(request):
	try:
		if request.method == 'GET':
			lista = models.Transportista.objects.filter(flag=True).order_by('tranom')
			ctx = { "lista": lista }
			return render_to_response("upkeep/transportista.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			data = {}
			if "ruc" in request.POST:
				try:
					# delete conductors
					obj = models.Conductore.objects.filter(traruc_id__exact=request.POST.get('ruc'))
					obj.delete()
					# delete Transport
					obj = models.Transporte.objects.filter(traruc_id__exact=request.POST.get('ruc'))
					obj.delete()
					# delete carrier
					obj = models.Transportista.objects.get(pk=request.POST.get('ruc'))
					obj.delete()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data),mimetype='application/json')
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url="/SignUp/")
def view_carrier_add(request):
	try:
		if request.method == 'GET':
			form = forms.addCarrierForm()
			ctx = { "form": form }
			return render_to_response("upkeep/addcarrier.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addCarrierForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				add.flag = True
				add.save()
				return HttpResponseRedirect('/almacen/upkeep/carrier/')
			else:
				form = forms.addCarrierForm(request.POST)
				ctx = { "form": form }
				return render_to_response("upkeep/addcarrier.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url='/SignUp/')
def view_carrier_edit(request,ruc):
	try:
		t = models.Transportista.objects.get(pk=ruc)
		if request.method == 'GET':
			form = forms.addCarrierForm(instance=t)
			return render_to_response("upkeep/editcarrier.html",{"form":form,"ruc":ruc},context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addCarrierForm(request.POST,instance=t)
			if form.is_valid():
				edit = form.save(commit=False)
				edit.flag =  True
				edit.save()
				return HttpResponseRedirect('/almacen/upkeep/carrier/')
			else:
				form = forms.addSubprojectForm(request.POST)
				msg = "No se a podido realizar la transacción."
				ctx = { "form": form, "almacen_id": almacen_id,"msg": msg }
				return render_to_response("almacen/addsector.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
# Transport
@login_required(login_url='/SignUp/')
def view_transport(request,ruc):
	try:
		if request.method == 'GET':
			lista = models.Transporte.objects.filter(flag=True,traruc_id=ruc)
			print lista
			ctx = { "lista": lista, "ruc":ruc, "nom": lista[0].traruc.tranom if len(lista) > 0 else "" }
			return render_to_response("upkeep/transport.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "nropla" in request.POST:
				data = {}
				try:
					obj = models.Transporte.objects.get(traruc_id=ruc,condni_id=request.POST.get('nropla'))
					obj.delete()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data),mimetype='application/json')
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url='/SignUp/')
def view_transport_add(request,tid):
	try:
		if request.method == 'GET':
			form = forms.addTransportForm()
			ctx = { "form": form, "tid": tid }
			return render_to_response("upkeep/addtransport.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addTransportForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				add.traruc_id = request.POST.get('traruc_id')
				add.flag = True
				add.save()
				return HttpResponseRedirect('/almacen/upkeep/transport/%s'%tid)
			else:
				form = forms.addTransportForm(request.POST)
				ctx = { "form": form, "tid": tid }
				return render_to_response("upkeep/addtransport.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url="/SignUp/")
def view_transport_edit(request,cid,tid):
	try:
		t = models.Transporte.objects.get(traruc_id=cid,nropla_id=tid)
		if request.method == 'GET':
			form = forms.addTransportForm(instance=t)
			return render_to_response("upkeep/edittransport.html",{"form": form, "cid":cid, "tid": tid}, context_instance=RequestContext(request))
		if request.method == 'POST':
			form = forms.addTransportForm(request.POST, instance=t)
			if form.is_valid():
				edit = form.save(commit=True)
				return HttpResponseRedirect("/almacen/upkeep/transport/%s/"%cid)
			else:
				form = forms.addTransportForm(request.POST)
				return render_to_response("upkeep/edittransport.html",{"form": form, "cid":cid, "tid": tid}, context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
# Conductor
@login_required(login_url='/SignUp/')
def view_conductor(request,ruc):
	try:
		if request.method == 'GET':
			lista = models.Conductore.objects.filter(flag=True,traruc_id=ruc)
			print lista
			ctx = { "lista": lista, "ruc":ruc, "nom": lista[0].traruc.tranom if len(lista) > 0 else "" }
			return render_to_response("upkeep/conductor.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			if "condni" in request.POST:
				data = {}
				try:
					obj = models.Conductore.objects.get(traruc_id=ruc,condni_id=request.POST.get('condni'))
					obj.delete()
					data['status'] = True
				except ObjectDoesNotExist, e:
					data['status'] = False
				return HttpResponse(simplejson.dumps(data),mimetype='application/json')
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url='/SignUp/')
def view_conductor_add(request,tid):
	try:
		if request.method == 'GET':
			form = forms.addConductorForm()
			ctx = { "form": form, "tid": tid }
			return render_to_response("upkeep/addconductor.html",ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			form = forms.addConductorForm(request.POST)
			if form.is_valid():
				add = form.save(commit=False)
				add.traruc_id = request.POST.get('traruc_id')
				add.flag = True
				add.save()
				return HttpResponseRedirect('/almacen/upkeep/conductor/%s'%tid)
			else:
				form = forms.addConductorForm(request.POST)
				ctx = { "form": form, "tid": tid }
				return render_to_response("upkeep/addconductor.html",ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404
@login_required(login_url="/SignUp/")
def view_conductor_edit(request,cid,tid):
	try:
		t = models.Conductore.objects.get(traruc_id=cid,condni_id=tid)
		if request.method == 'GET':
			form = forms.addConductorForm(instance=t)
			return render_to_response("upkeep/editconductor.html",{"form": form, "cid":cid, "tid": tid}, context_instance=RequestContext(request))
		if request.method == 'POST':
			form = forms.addConductorForm(request.POST, instance=t)
			if form.is_valid():
				edit = form.save(commit=True)
				return HttpResponseRedirect("/almacen/upkeep/conductor/%s/"%cid)
			else:
				form = forms.addConductorForm(request.POST)
				return render_to_response("upkeep/editconductor.html",{"form": form, "cid":cid, "tid": tid}, context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Template not found")
		raise Http404

"""
  request Orders
"""
# pending request Orders
def view_orders_pending(request):
	try:
		if request.method == 'GET':
			lst = models.Pedido.objects.filter(flag=True,status='PE').order_by('-pedido_id')
			ctx= { 'lista': lst }
			return render_to_response('almacen/slopeorders.html',ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Error template not found")
		raise Http404("Process Error")
# list ortders attend request Orders
def view_orders_list_approved(request):
	try:
		if request.method == 'GET':
			lst = models.Pedido.objects.filter(flag=True).exclude(Q(status='PE')|Q(status='AN')).order_by('-pedido_id')
			ctx= { 'lista': lst }
			return render_to_response('almacen/listorderattend.html',ctx,context_instance=RequestContext(request))
	except TemplateDoesNotExist, e:
		messages("Error template not found")
		raise Http404("Process Error")
# meet Orders
def view_attend_order(request,oid):
	try:
		if request.method == 'GET':
			obj= get_object_or_404(models.Pedido,pk=oid,flag=True)
			det= get_list_or_404(models.Detpedido, pedido_id__exact=oid,flag=True)
			radio= ''
			for x in det:
				if x.cantshop <= 0:
					radio= 'disabled'
					break
			nipples= get_list_or_404(models.Niple.objects.order_by('metrado'),pedido_id__exact=oid,flag=True)
			usr= models.userProfile.objects.get(empdni__exact=obj.empdni)
			tipo= {"A":"Roscado","B":"Ranurado","C":"Rosca-Ranura"}
			ctx= { 'orders': obj, 'det': det, 'nipples': nipples, 'usr': usr,'tipo':tipo,'radio':radio }
			return render_to_response('almacen/attendorder.html',ctx,context_instance=RequestContext(request))
		elif request.method == 'POST':
			try:
				import json
				data= {}
				# recover list of materials 
				mat= json.loads( request.POST.get('materials') )
				# recover list of nipples
				nip= json.loads( request.POST.get('nipples') )
				# variables
				cnm= 0
				cnn= 0
				ctn= 0
				# we walk the list materials and update items materials of details orders
				for c in range(len(mat)):
					cs= 0
					for x in range(len(nip)):
						if mat[c]['matid'] == nip[x]['matid']:
							cs+= (float(nip[x]['quantityshop']) * float(nip[x]['meter']) )
					ctn+= cs
					obj= models.Detpedido.objects.get(pedido_id__exact=request.POST.get('oid'),materiales_id__exact=mat[c]['matid'])
					# aqui hacer otro if 
					obj.cantshop=  (float(mat[c]['quantity']) - float(mat[c]['quantityshop'])) if (cs / 100 ) == float(mat[c]['quantity']) else (cs/100) if mat[c]['matid'][0:3] == "115" else (float(mat[c]['quantity']) - float(mat[c]['quantityshop']))
					print (cs / 100 ) if mat[c]['matid'][0:3] == "115" else (float(mat[c]['quantity']) - float(mat[c]['quantityshop']))
					obj.cantguide= float(mat[c]['quantityshop'])
					obj.tag= "1"
					obj.save()
					cnm+= 1
				# we walk the list nipples and update tag of tables nipples
				for n in range(len(nip)):
					obj= models.Niple.objects.get(pk=nip[n]['nid'])
					obj.cantshop= int( float(nip[n]['quantity']) - float(nip[n]['quantityshop']) )
					obj.cantguide= int(float(nip[n]['quantityshop']))
					obj.tag= '1'
					obj.save()
					cnn+= 1
				# evaluation status orders
				# recover number of materials
				onm= models.Detpedido.objects.filter(pedido_id__exact=request.POST.get('oid')).count()
				# recover number of nipples
				onn= models.Niple.objects.filter(pedido_id__exact=request.POST.get('oid')).count()
				# evaluation
				passted= False
				status = ""
				if cnm < onm:
					status= 'IN'
				else:
					status= 'CO'
				if cnn < onn:
					status= 'IN'
				else:
					tsn= 0
					for i in models.Niple.objects.filter(pedido_id__exact=request.POST.get('oid')):
						tsn+= ( ( i.cantshop * i.metrado ) / 100)
					status= 'IN' if ctn < tsn else 'CO'
					passted= 'IN' if ctn < tsn else 'CO'
				# update status Bedside Orders
				obj = models.Pedido.objects.get(pk=request.POST.get('oid'))
				obj.status= status
				obj.save()
				data['sts']= status
				data['pass']= passted
				data['status']= True
			except ObjectDoesNotExist, e:
				data['status']= False
			return HttpResponse(simplejson.dumps(data), mimetype="application/json" )
	except TemplateDoesNotExist, e:
		message("Error template not found")
		raise Http404

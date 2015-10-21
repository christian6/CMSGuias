#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
# from django.contrib import messages
# from django.contrib.auth.mod import User
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.db.models import Q
from django.shortcuts import render_to_response, render
from django.utils import simplejson
from django.utils.decorators import method_decorator
from django.template import RequestContext, TemplateDoesNotExist
from django.views.generic import TemplateView, View
# from django.views.generic.edit import UpdateView, CreateView
from django.core.serializers.json import DjangoJSONEncoder

from CMSGuias.apps.home.models import *
from .models import *
from .forms import *
from CMSGuias.apps.ventas.models import Metradoventa
from CMSGuias.apps.tools import genkeys


# Class Bases Views Generic

class JSONResponseMixin(object):

    def render_to_json_response(self, context, **response_kwargs):
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            mimetype='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        return simplejson.dumps(context,
                                encoding='utf-8',
                                cls=DjangoJSONEncoder)


# View home Operations
class OperationsHome(TemplateView):
    template_name = 'operations/home.html'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(OperationsHome, self).dispatch(request, *args, **kwargs)


# View list pre orders
class ListPreOrders(JSONResponseMixin, TemplateView):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        try:
            context = dict()
            context['list'] = PreOrders.objects.filter(
                project_id=kwargs['pro'],
                sector_id=kwargs['sec'],
                status='PE'
            ).order_by('-register')
            context['status'] = globalVariable.status
            return render_to_response(
                'operations/listpreorders.html',
                context,
                context_instance=RequestContext(request))
        except TemplateDoesNotExist, e:
            raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'anullarPreOrders' in request.POST:
                    obj = PreOrders.objects.get(
                        preorder_id=request.POST['pre'])
                    obj.annular = request.POST.get('annular')
                    obj.status = 'AN'
                    obj.save()
                    context['status'] = True
                if 'changeComplete' in request.POST:
                    obj = PreOrders.objects.get(
                        preorder_id=request.POST['pre'])
                    obj.status = 'CO'
                    obj.save()
                    context['status'] = True
            except ObjectDoesNotExist, e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        else:
            context['list'] = PreOrders.objects.filter(
                project_id=kwargs['pro'],
                sector_id=kwargs['sec'],
                status=request.POST.get('status')
            ).order_by('-register')
            context['search'] = request.POST.get('status')
            context['status'] = globalVariable.status
            return render_to_response(
                'operations/listpreorders.html',
                context,
                context_instance=RequestContext(request))


class ProgramingProject(JSONResponseMixin, View):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'listg' in request.GET:
                    sg = SGroup.objects.filter(
                            project_id=kwargs['pro'],
                            subproject_id=kwargs[
                                'sub'] if unicode(kwargs[
                                    'sub']) != 'None' and unicode(kwargs[
                                        'sub']) != '' else None,
                            sector_id=kwargs['sec']).order_by('name')
                    context['sg'] = json.loads(serializers.serialize(
                                                                'json', sg))
                    context['status'] = True
                if 'listds' in request.GET:
                    ds = DSector.objects.filter(
                            project_id=kwargs['pro'],
                            sgroup__subproject_id=kwargs[
                                'sub'] if unicode(kwargs[
                                    'sub']) != 'None' and unicode(kwargs[
                                        'sub']) != '' else None,
                            sgroup__sector_id=kwargs['sec']).order_by('name')
                    context['ds'] = json.loads(serializers.serialize(
                                        'json',
                                        ds,
                                        relations=('sgroup',)))
                    context['status'] = True
                if 'valPrices' in request.GET:
                    # get sgroup
                    sg = [x[0] for x in SGroup.objects.filter(
                            project_id=kwargs['pro'],
                            subproject_id=kwargs[
                                'sub'] if unicode(kwargs[
                                    'sub']) != 'None' and unicode(kwargs[
                                        'sub']) != '' else None,
                            sector_id=kwargs['sec']).values_list('sgroup_id',)]
                    sec = [x[0] for x in DSector.objects.filter(
                            sgroup_id__in=sg).values_list('dsector_id')]
                    without = DSMetrado.objects.filter(
                        Q(dsector_id__in=sec),
                        Q(ppurchase=0) | Q(psales=0) | Q(quantity=0)
                        ).order_by('materials__matnom')
                    if without:
                        context['list'] = json.loads(
                            serializers.serialize(
                                'json',
                                without,
                                relations=('materials',),
                                indent=4))
                        context['status'] = True
                    else:
                        context['status'] = False
            except ObjectDoesNotExist as e:
                context['raise'] = str(e)
                context['status'] = Falses
            return self.render_to_json_response(context)
        else:
            try:
                context['project'] = Proyecto.objects.get(
                    proyecto_id=kwargs['pro'])
                context['sector'] = Sectore.objects.get(
                    proyecto_id=kwargs['pro'],
                    subproyecto_id=kwargs['sub'] if kwargs[
                        'sub'] is None else None,
                    sector_id=kwargs['sec'])
                return render(
                    request,
                    'operations/programinggroup.html',
                    context)
            except TemplateDoesNotExist, e:
                raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'saveg' in request.POST:
                    try:
                        if 'sgroup_id' in request.POST:
                            sg = SGroup.objects.get(
                                    sgroup_id=request.POST['sgroup_id'])
                            form = SGroupForm(request.POST, instance=sg)
                        else:
                            form = SGroupForm(request.POST)
                    except ObjectDoesNotExist:
                        form = SGroupForm(request.POST)
                    if form.is_valid():
                        if 'sgroup_id' not in request.POST:
                            add = form.save(commit=False)
                            key = genkeys.genSGroup(
                                    kwargs['pro'], kwargs['sec'])
                            add.sgroup_id = key.strip()
                            add.project_id = kwargs['pro']
                            add.subproject_id = kwargs[
                                'sub'] if unicode(kwargs[
                                    'pro']) != 'None' else None
                            add.sector_id = kwargs['sec']
                            add.colour = request.POST['rgba']
                            add.save()
                        else:
                            edit = form.save(commit=False)
                            edit.colour = request.POST['rgba']
                            edit.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                if 'saveds' in request.POST:
                    try:
                        if 'dsector_id' in request.POST:
                            ds = DSector.objects.get(
                                    dsector_id=request.POST['dsector_id'])
                            form = DSectorForm(
                                    request.POST, request.FILES, instance=ds)
                        else:
                            form = DSectorForm(request.POST, request.FILES)
                    except ObjectDoesNotExist as e:
                        form = DSectorForm(request.POST, request.FILES)
                    if form.is_valid():
                        if 'dsector_id' not in request.POST:
                            add = form.save(commit=False)
                            key = genkeys.genDSector(
                                    kwargs['pro'],
                                    request.POST['sgroup'])
                            print key, len(key)
                            add.dsector_id = key.strip()
                            add.project_id = kwargs['pro']
                            add.save()
                        else:
                            form.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                        context['raise'] = 'Fields empty'
                if 'savePricewithout' in request.POST:
                    print request.POST
                    sg = [x[0] for x in SGroup.objects.filter(
                            project_id=kwargs['pro'],
                            subproject_id=kwargs[
                                'sub'] if unicode(kwargs[
                                    'sub']) != 'None' and unicode(kwargs[
                                        'sub']) != '' else None,
                            sector_id=kwargs['sec']).values_list('sgroup_id',)]
                    sec = [x[0] for x in DSector.objects.filter(
                            sgroup_id__in=sg).values_list('dsector_id')]
                    dsm = DSMetrado.objects.filter(
                        dsector_id__in=sec,
                        materials_id=request.POST['materials'])
                    if request.POST['field'] == 'purchase':
                        dsm.update(ppurchase=request.POST['value'])
                    if request.POST['field'] == 'sales':
                        dsm.update(psales=request.POST['value'])
                    context['status'] = True
            except ObjectDoesNotExist as e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)


class AreaProjectView(JSONResponseMixin, TemplateView):

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'dslist' in request.GET:
                    context['list'] = json.loads(serializers.serialize(
                        'json',
                        DSMetrado.objects.filter(
                            dsector_id=kwargs['area']).order_by(
                            'materials__matnom'), relations=(
                            'materials', 'brand', 'model',)))
                    context['status'] = True
                if 'lstnipp' in request.GET:
                    context[''] = json.loads(
                                    Nipple.objects.filter(
                                        area_id=kwargs['area'],
                                        materials_id=request.GET['materials']))
                    context['status'] = True
            except ObjectDoesNotExist as e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)
        else:
            try:
                context['dsector'] = DSector.objects.get(
                                        dsector_id=kwargs['area'])
                return render(request, 'operations/dsector.html', context)
            except TemplateDoesNotExist as e:
                raise Http404(e)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                if 'savepmat' in request.POST:
                    dsm = DSMetrado()
                    dsm.dsector_id = kwargs['area']
                    dsm.materials_id = request.POST['code']
                    dsm.brand_id = request.POST['brand']
                    dsm.model_id = request.POST['model']
                    dsm.quantity = request.POST['quantity']
                    dsm.qorder = request.POST['quantity']
                    dsm.qguide = 0
                    dsm.ppurchase = request.POST['ppurchase']
                    dsm.psales = request.POST['psales']
                    dsm.save()
                    context['status'] = True
                if 'copysector' in request.POST:
                    sec = MetProject.objects.filter(
                        proyecto_id=request.POST['project'],
                        sector_id=request.POST['sector'])
                    if not sec:
                        sec = Metradoventa.objects.filter(
                            proyecto_id=request.POST['project'],
                            sector_id=request.POST['sector'])
                    if sec:
                        for x in sec:
                            try:
                                ds = DSMetrado.objects.get(
                                        dsector_id=kwargs['area'],
                                        materials_id=x.materiales_id)
                            except DSMetrado.DoesNotExist:
                                ds = DSMetrado()
                            ds.dsector_id = kwargs['area']
                            ds.materials_id = x.materiales_id
                            ds.brand_id = x.brand_id
                            ds.model_id = x.model_id
                            ds.quantity = x.cantidad
                            ds.qorder = x.cantidad
                            ds.qguide = 0
                            ds.ppurchase = x.precio
                            ds.psales = x.sales
                            ds.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                if 'delAreaMA' in request.POST:
                    DSMetrado.objects.filter(
                        dsector_id=kwargs['area']).delete()
                    context['status'] = True
                if 'availableNipple' in request.POST:
                    dsm = DSMetrado.objects.get(
                        dsector_id=kwargs['area'],
                        materials_id=request.POST['materials'],
                        brand_id=request.POST['brand'],
                        model_id=request.POST['model'])
                    if dsm.nipple:
                        dsm.nipple = False
                        dsm.save()
                    else:
                        dsm.nipple = True
                        dsm.save()
                    context['status'] = True
                if 'nipple' in request.POST:
                    if 'edit' in request.POST:
                        Np = Nipple.objects.get(
                                id=request.POST['id'],
                                area_id=kwargs['area'],
                                materiales_id=request.POST['materials'])
                        nip = NippleForm(request.POST, instance=Np)
                    else:
                        nip = NippleForm(request.POST)
                        nip.proyecto_id = kwargs['area'][:7]
                        nip.area = kwargs['area']
                    if nip.is_valid():
                        nip.save()
                        context['status'] = True
                    else:
                        context['status'] = False
                if 'delnipp' in request.POST:
                    Nipple.objects.get(
                        id=request.POST['id'],
                        area_id=kwargs['area'],
                        materiales_id=request.POST['materials']).delete()
                    context['status'] = True
            except ObjectDoesNotExist as e:
                context['raise'] = str(e)
                context['status'] = False
            return self.render_to_json_response(context)

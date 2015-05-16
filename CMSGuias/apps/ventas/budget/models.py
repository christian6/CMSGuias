#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime

from django.db import models

from audit_log.models.fields import LastUserField
from audit_log.models.managers import AuditLog

from CMSGuias.apps.home.models import Materiale, Unidade, Cargo, Tools, Moneda


class AnalysisGroup(models.Model):
    agroup_id = models.CharField(max_length=5, primary_key=True)
    name = models.CharField(max_length=255)
    register = models.DateTimeField(auto_now=True, default=datetime.today())
    flag = models.BooleanField(default=True)

    class Meta():
        ordering = ['register']

    def __unicode__(self):
        return '%s %s'%(self.agroup_id, self.name)


class Analysis(models.Model):
    analysis_id = models.CharField(max_length=8, primary_key=True)
    group = models.ForeignKey(AnalysisGroup, to_field='agroup_id')
    name = models.CharField(max_length=255, null=False)
    unit = models.ForeignKey(Unidade, to_field='unidad_id')
    performance = models.FloatField()
    register = models.DateTimeField(auto_now=True, default=datetime.today())
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['name']

    @property
    def total(self):
        tm = APMaterials.objects.extra(select={'total':'select SUM(price * quantity) as total from budget_APMaterials where analysis_id like analysis_id'})
        tm = tm[0].total if tm else 0
        tmp = APManPower.objects.extra(select={'total':'select SUM(price * quantity) as total from budget_APManPower where analysis_id like analysis_id'})
        tmp = tmp[0].total if tmp else 0
        tt = APTools.objects.extra(select={'total':'select SUM(price * quantity) as total from budget_APTools where analysis_id like analysis_id'})
        tt = tt[0].total if tt else 0
        return round(float(tm+float(tmp)+float(tt)), 2)

    def __unicode__(self):
        return '%s %s %s %f'%(self.analysis_id, self.name, self.register, self.performance)

class APMaterials(models.Model):
    analysis = models.ForeignKey(Analysis, to_field='analysis_id')
    materials = models.ForeignKey(Materiale, to_field='materiales_id')
    quantity = models.FloatField(null=False)
    price = models.DecimalField(max_digits=5, decimal_places=3)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['materials']

    @property
    def partial(self):
        return (self.quantity * float(self.price))

    def __unicode__(self):
        return '%s %f %d'%(self.materials, self.quantity, self.price)

class APManPower(models.Model):
    analysis = models.ForeignKey(Analysis, to_field='analysis_id')
    manpower = models.ForeignKey(Cargo, to_field='cargo_id')
    gang = models.DecimalField(max_digits=3, decimal_places=2)
    quantity = models.DecimalField(max_digits=5, decimal_places=2)
    price = models.DecimalField(max_digits=8, decimal_places=3)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['manpower']

    @property
    def partial(self):
        return float(self.quantity * self.price)

    def __unicode__(self):
        return '%s %s %d %d'%(self.analysis_id, self.manpower, self.quantity, self.price)

class APTools(models.Model):
    analysis = models.ForeignKey(Analysis, to_field='analysis_id')
    tools = models.ForeignKey(Tools, to_field='tools_id')
    gang = models.DecimalField(max_digits=3, decimal_places=2)
    quantity = models.DecimalField(max_digits=5, decimal_places=2)
    price = models.DecimalField(max_digits=8, decimal_places=3)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['tools']

    @property
    def partial(self):
        return float(self.quantity * self.price)

    def __unicode__(self):
        return '%s %s %d %d'%(self.analysis_id, self.tools, self.quantity, self.price)

class Budget(models.Model):
    budget_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    register = models.DateField(auto_now=True)
    hourwork = models.IntegerField(default=0)
    finish = models.DateField()
    base = models.DecimalField(max_digits=10, decimal_places=3)
    offer = models.DecimalField(max_digits=10, decimal_places=3)
    observation = models.TextField()
    refecence = models.CharField(max_length=10)
    review = models.CharField(max_length=10)
    version = models.CharField(max_length=5, default='')
    status = models.CharField(max_length=2, default='PE')
    currency = models.ForeignKey(Moneda, to_field='moneda_id')
    exchange = models.DecimalField(max_digits=5, decimal_places=3, default=0)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['budget_id']

    def __unicode__(self):
        return '%s %s'%(self.budget_id, self.name)

class BudgetItems(models.Model):
    budget = models.ForeignKey(Budget, to_field='budget_id')
    budgeti_id = models.CharField(max_length=13, primary_key=True)
    item =  models.DecimalField(max_digits=3, decimal_places=2)
    name = models.CharField(max_length=255)
    base = models.DecimalField(max_digits=10, decimal_places=3)
    offer = models.DecimalField(max_digits=10, decimal_places=3)
    tag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return '%s %s %s %d'%(self.budget_id, self.item, self.name, self.base)

class BudgetSub(models.Model):
    budget = models.ForeignKey(Budget, to_field='budget_id')
    budgeti = models.ForeignKey(BudgetItems, to_field='budgeti_id')
    budgetsub_id =  models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=255)
    unit = models.ForeignKey(Unidade, to_field='unidad_id')
    status = models.CharField(default='PE', max_length=2)
    flag = models.BooleanField(default=True)

    audit_log = AuditLog()

    class Meta:
        ordering = ['name']

class BudgetDetails(models.Model):
    budget = models.ForeignKey(Budget, to_field='budget_id')
    budgeti = models.ForeignKey(BudgetItems, to_field='budgeti_id')
    budgetsub =  models.ForeignKey(BudgetSub, to_field='budgetsub_id')
    analysis = models.ForeignKey(Analysis, to_field='analysis_id')
    quantity = models.FloatField()

    audit_log = AuditLog()

    class Meta:
        ordering = ['analysis']

    def __unicode__(self):
        return '%s %s %f'%(self.budget_id, self.analysis, self.quantity)

from django.shortcuts import render
from django.urls import path
from DashboardUser import views
from .views import Circulation2 

# Create your views here.
urlpatterns = [

path("indexDashboardUser/",views.Circulation2,name="indexDashboardUser"),
path("index",views.index,name="index"), #1
path("LayoutDashbords",views.LayoutDashbords,name="LayoutDashbords"),
path("LayoutDashbords1",views.LayoutDashbords1,name="LayoutDashbords1"),
path ("Calender",views.Calender, name="Calender"),
path ("ItemProduct",views.ItemProduct, name="ItemProduct"), #2
path ("Circulation",views.Circulation1, name="Circulation1"), #3
path ("Circulation1",views.Circulation3, name="Circulation3"), 
path ("Circulation3",views.check_time, name="Circulation4"), 
path ("ProductPreview/",views.ProductPreview, name="ProductPreview"), #4
path("EditAdd/<int:id>/",views.EditAdd, name="EditAdd"),#5
path("login_cover/",views.login_cover, name="login_cover"),
path('logout_cover', views.logout_cover, name='logout_cover'),
path('eror404/', views.eror404, name='eror404'),

path('apps-invoiceList/', views.appsinvoiceList, name='apps-invoiceList'),
path('apps_ecommerceCart/', views.apps_ecommerceCart, name='apps_ecommerceCart'),
path("apps-ecommerceCartAjax/",views.apps_ecommerceCartAjax,name="apps-ecommerceCartAjax"),


 
]
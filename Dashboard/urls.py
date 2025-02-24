from django.urls import path
from Dashboard import views
from .views import UpdateStockAPIView,SaveSaleRecordAPIView,CleanDisplay

from django.urls import path
from .views import generate_promptpay_qr


urlpatterns = [

  path ('Dashboard/',views.ShowDashBoard,name="Dashboard"),
  path("update-stock/",UpdateStockAPIView.as_view(), name="update_stock"),
  path('save-sale-record/',SaveSaleRecordAPIView.as_view(), name='save_sale_record'),
  path('generate-promptpay-qr/', generate_promptpay_qr, name='generate_promptpay_qr'),
  path ('login_cover/?next=/indexDashboardUser//',views.CleanDisplay),
 
]
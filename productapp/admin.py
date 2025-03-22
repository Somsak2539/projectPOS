from django.contrib import admin
from productapp.models import Product, Product1, Category,frolink
from django.db.models import Sum
from django.utils.html import format_html
import openpyxl
from django.http import HttpResponse
from django.forms import TextInput
from django.db import models



from django.urls import path, reverse


     
'''class ManageProduct(admin.ModelAdmin):
    list_display = ["name", "price", "is_trending", "stock", "image"]

admin.site.register(Product, ManageProduct)'''

class ManageProduct1(admin.ModelAdmin):
    list_display = ["id","name"]

admin.site.register(Category, ManageProduct1)

class ManageProduct2(admin.ModelAdmin):
    

    
    list_display = ["id","image_preview","name", "price","stock","profitprice","barcode","is_trending",]
    list_editable = [ "is_trending", "stock","profitprice",]
    list_per_page = 20  # แสดงข้อมูล 20 รายการต่อหน้า
    search_fields = ["name","barcode","id"]  # เพิ่มช่องค้นหา
    list_filter = ["category"]  # เพิ่มตัวกรองตามหมวดหมู่ 
    actions_on_top = True  # แสดง Actions ด้านบน
    actions_on_bottom = True  # แสดง Actions ด้านล่าง
    actions = ["export_as_csv", "export_as_excel", "mark_as_trending", "mark_as_not_trending"]
    
   
    
  

    def profit_margin(self, obj):
        return obj.price - obj.profitprice
    profit_margin.short_description = "Profit Margin"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Image Preview"

    def export_as_excel(self, request, queryset):
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Products"

        headers = ["ID", "Name", "Price", "Stock", "Profit Price", "Barcode"]
        sheet.append(headers)

        for obj in queryset:
            sheet.append([obj.id, obj.name, obj.price, obj.stock, obj.profitprice, obj.barcode])

        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="products.xlsx"'

        workbook.save(response)  # บันทึกไฟล์ลง Response
        return response

   


    def changelist_view(self, request, extra_context=None):
        # ดึง queryset ที่กรองในหน้า Admin
        queryset = self.get_queryset(request)
        # คำนวณ Total Price ของสินค้าทั้งหมด
        total_price = queryset.aggregate(Sum('price'))['price__sum'] or 0
        # ส่งข้อมูลไปยัง context
        extra_context = extra_context or {}
        extra_context['total_price'] = total_price
        return super().changelist_view(request, extra_context=extra_context)
    


admin.site.register(Product1, ManageProduct2)



class link(admin.ModelAdmin):
    list_display = ('name','url_link')

    def url_link(self, obj):
        url = reverse('indexDashboardUser')  # ใช้ชื่อ URL ที่กำหนดใน urls.py
        return format_html('<a href="{}" target="">{}</a>', url, obj.name)
    url_link.short_description = 'Product Link'

admin.site.register(frolink, link)


















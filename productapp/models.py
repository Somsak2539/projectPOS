


from django.db import models
from django.apps import AppConfig


class Product(models.Model):

    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    is_trending = models.BooleanField(default=False)
    image = models.ImageField(upload_to="product", blank=True)
    
    


# โมเดล Category
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  # ชื่อหมวดหมู่

    def __str__(self):
        return self.name
    
    
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "ประเภทรายการสินค้า"

    def __str__(self):
        return self.name
    
    

# โมเดล Product
class Product1(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE,null=True)  # เชื่อมโยงกับ Category
    name = models.CharField(max_length=100)  # ชื่อสินค้า
    description = models.TextField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.DecimalField(max_digits=10, decimal_places=2)
    is_trending = models.BooleanField(default=False)
    image = models.ImageField(upload_to="product")
    profitprice = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)  # วันที่เพิ่ม
    updated_at = models.DateTimeField(auto_now=True)      # วันที่แก้ไข
    barcode = models.CharField(max_length=13, unique=True) # สามารถที่จะทำการเพิ่มได้แค่ 13 ตัว
    
    
    
    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "รายการสินค้า"
    
    
    def __str__(self):
        return self.name


class frolink(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField(max_length=200)
    
    
    class Meta:
        verbose_name = "frolink"
        verbose_name_plural = "กลับไปหน้า DashBord"
    

    def __str__(self):
        return self.name
    
    


    
    

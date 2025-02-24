from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Circulation(models.Model):
     Pofitprice = models.DecimalField(max_digits=10, decimal_places=2)            # กำไรสินค้าต่อหน่อย
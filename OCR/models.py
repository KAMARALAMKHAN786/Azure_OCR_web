from django.db import models

# Create your models here.
class AnalysisResult(models.Model):
    image_name = models.CharField(max_length=255)
    json_data = models.JSONField()

    def __str__(self):
        return self.image_name
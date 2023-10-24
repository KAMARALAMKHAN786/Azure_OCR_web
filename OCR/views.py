from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import AnalysisResult  # Import your model


# Create your views here.
def bulkmaster1_view(request):
    # Your view logic goes here
    return render(request, 'bulkmaster1.html')
# views.py

@csrf_exempt
def save_analysis_result(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            image_name = data.get('image_name')
            json_data = json.loads(data.get('json_data'))  # Parse the JSON data

            # Save the data to MongoDB using your model
            AnalysisResult.objects.create(image_name=image_name, json_data=json_data)

            response_data = {'message': 'Analysis result saved successfully'}
            return JsonResponse(response_data, status=200)

        except json.JSONDecodeError as e:
            response_data = {'error': 'Invalid JSON data'}
            return JsonResponse(response_data, status=400)

    response_data = {'error': 'Invalid request method'}
    return JsonResponse(response_data, status=405)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import generate_logs, geocode
import requests

# ---------------------------------------
# Trip Planner / ELD Log System
# Author: Fabio Morales
# Repo: github.com/FabioMorales7/trip-planner
# ---------------------------------------

@api_view(['POST'])
def plan_trip(request):
    try:
        data = request.data

        start_place = data.get("current_location")
        pickup_place = data.get("pickup")
        dropoff_place = data.get("dropoff")
        cycle_used = float(data.get("cycle_used", 0))

        if not start_place or not pickup_place or not dropoff_place:
            return Response(
                {"error": "Missing required fields"},
                status=400
            )

        start = geocode(start_place)
        pickup = geocode(pickup_place)
        dropoff = geocode(dropoff_place)

        if not start or not pickup or not dropoff:
            return Response(
                {"error": "Invalid location(s)"},
                status=400
            )

        coordinates = f"{start};{pickup};{dropoff}"

        url = f"http://router.project-osrm.org/route/v1/driving/{coordinates}?overview=full&geometries=geojson"

        res = requests.get(url).json()

        if "routes" not in res or len(res["routes"]) == 0:
            return Response(
                {
                    "error": "Routing failed, pleaase try again",
                    "details": res
                },
                status=400
            )

        route = res["routes"][0]

        duration_hours = route["duration"] / 3600
        distance_km = route["distance"] / 1000

        logs = generate_logs(duration_hours, cycle_used)

        return Response({
            "route": route["geometry"],   # para mapa
            "distance_km": round(distance_km, 2),
            "duration_hours": round(duration_hours, 2),
            "logs": logs
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
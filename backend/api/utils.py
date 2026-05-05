# ---------------------------------------
# Trip Planner / ELD Log System
# Author: Fabio Morales
# Repo: github.com/FabioMorales7/trip-planner
# ---------------------------------------

import requests

# 🔥 cache simple (nivel pro básico)
cache = {}

def geocode(place):
    if place in cache:
        return cache[place]

    url = f"https://nominatim.openstreetmap.org/search?q={place}&format=json"

    res = requests.get(url, headers={
        "User-Agent": "trip-planner-app"
    }).json()

    if not res:
        return None

    coords = f"{res[0]['lon']},{res[0]['lat']}"
    cache[place] = coords

    return coords


def generate_logs(total_hours, cycle_used):
    logs = []
    remaining_hours = total_hours
    day = 1

    while remaining_hours > 0:
        segments = []

        # 🔥 Inicio del día (0 → 6:30)
        if day == 1:
            # Día 1 empieza Off Duty
            segments.append({
                "type": "off",
                "start": 0,
                "end": 6.5
            })
        else:
            # Días siguientes empiezan en Sleeper
            segments.append({
                "type": "sleeper",
                "start": 0,
                "end": 6.5
            })

        # 🔥 Pre-trip (6:30 → 7)
        segments.append({
            "type": "on_duty",
            "start": 6.5,
            "end": 7.0
        })

        current_hour = 7.0

        # 🚛 Driving
        driving_hours = min(11, remaining_hours)

        segments.append({
            "type": "driving",
            "start": current_hour,
            "end": current_hour + driving_hours
        })

        current_hour += driving_hours
        remaining_hours -= driving_hours

        # 🔥 Fin del día
        if current_hour < 24:
            if remaining_hours > 0:
                segment_type = "sleeper"
            else:
                segment_type = "off"

            segments.append({
                "type": segment_type,
                "start": current_hour,
                "end": 24
            })

        logs.append({
            "day": day,
            "segments": segments
        })

        day += 1

    return logs
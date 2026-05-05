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
        # 🔥 Día empieza a las 6:30
        current_hour = 6.5

        segments = []

        # 🟡 Pre-trip inspection (On Duty)
        segments.append({
            "type": "on_duty",
            "start": 6.5,
            "end": 7.0
        })

        current_hour = 7.0  # Driving empieza a las 7

        # 🚛 Driving (máximo 11h por día)
        driving_hours = min(11, remaining_hours)

        segments.append({
            "type": "driving",
            "start": current_hour,
            "end": current_hour + driving_hours
        })

        current_hour += driving_hours
        remaining_hours -= driving_hours

        # 🔥 LÓGICA CORREGIDA AQUÍ
        remaining_day_hours = 24 - current_hour

        if remaining_day_hours > 0:
            if remaining_hours > 0:
                # 🛌 Si el viaje continúa → Sleeper (noche)
                segment_type = "sleeper"
            else:
                # 📴 Si ya terminó → Off Duty
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
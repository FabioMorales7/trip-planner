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
    remaining_cycle = 70 - cycle_used
    day = 1

    while total_hours > 0 and remaining_cycle > 0:
        drive_today = min(11, total_hours, remaining_cycle)

        logs.append({
            "day": day,
            "segments": [
                {"type": "driving", "hours": 8},
                {"type": "on_duty", "hours": 1},  # pickup/dropoff
                {"type": "off", "hours": 10}
            ]
        })

        total_hours -= drive_today
        remaining_cycle -= drive_today
        day += 1

    return logs
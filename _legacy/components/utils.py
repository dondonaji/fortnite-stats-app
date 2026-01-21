def format_time_human(minutes):
    """Convierte minutos en formato legible: 2d 4h 30m"""
    days = minutes // 1440
    remaining_minutes = minutes % 1440
    hours = remaining_minutes // 60
    mins = remaining_minutes % 60
    return f"{days}d {hours}h {mins}m"

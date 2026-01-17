


import tkinter as tk
import matplotlib.pyplot as plt
from fortnite_client import FortniteClient

# Initialize Client
client = FortniteClient()

def obtener_stats(username):
    result = client.get_stats(username)
    
    if result["status"] == 200:
        data = result["data"]
        # Defensive coding in case "stats" or "all" is missing
        try:
            stats = data["stats"]["all"]["overall"]
            resultado = (
                f"Jugador: {data['account']['name']}\n"
                f"Kills: {stats['kills']}\n"
                f"Victorias: {stats['wins']}\n"
                f"Partidas: {stats['matches']}\n"
                f"K/D: {stats['kd']}\n"
                f"Win Rate: {stats['winRate']}%\n"
                f"Minutos jugados: {stats.get('minutesPlayed', 'N/D')}"
            )
            return resultado
        except KeyError:
            return "Error: Datos incompletos recibidos de la API."
    else:
        return f"Error: {result.get('error', 'Desconocido')}"

def buscar():
    nombre = entrada_usuario.get()
    if not nombre:
        return
    resultado = obtener_stats(nombre)
    salida_texto.delete("1.0", tk.END)
    salida_texto.insert(tk.END, resultado)

def guardar():
    texto = salida_texto.get("1.0", tk.END).strip()
    if not texto:
        return
    with open("última_búsqueda.txt", "w", encoding="utf-8") as archivo:
        archivo.write(texto)

def graficar():
    texto = salida_texto.get("1.0", tk.END).strip()
    if not texto or "Kills" not in texto:
        return
    try:
        lines = texto.splitlines()
        kills = int(lines[1].split(":")[1].strip())
        wins = int(lines[2].split(":")[1].strip())
        matches = int(lines[3].split(":")[1].strip())
        categorias = ["Kills", "Victorias", "Partidas"]
        valores = [kills, wins, matches]
        plt.bar(categorias, valores)
        plt.show()
    except Exception:
        pass

ventana = tk.Tk()
ventana.title("Fortnite Stats Viewer")
ventana.geometry("600x450")
ventana.configure(bg="#1e1e1e")

estilo_fuente = ("Segoe UI", 12)
estilo_boton = {"font": ("Segoe UI", 10, "bold"), "bg": "#3a9ad9", "fg": "white", "activebackground": "#2672b3"}

tk.Label(ventana, text="Escribe el nombre del jugador:", font=estilo_fuente, fg="white", bg="#1e1e1e").pack(pady=10)
entrada_usuario = tk.Entry(ventana, width=30, font=estilo_fuente)
entrada_usuario.pack()

tk.Button(ventana, text="Buscar", command=buscar, **estilo_boton).pack(pady=5)
tk.Button(ventana, text="Guardar Resultado", command=guardar, **estilo_boton).pack(pady=5)
tk.Button(ventana, text="Ver Gráfica", command=graficar, **estilo_boton).pack(pady=5)

salida_texto = tk.Text(ventana, height=15, width=60, font=("Courier New", 10), bg="#2e2e2e", fg="lime", wrap="word")
salida_texto.pack(pady=10)

ventana.mainloop()

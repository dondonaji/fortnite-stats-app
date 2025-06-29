
import streamlit as st
import requests
import matplotlib.pyplot as plt

# --- CONFIGURACIÓN INICIAL ---
st.set_page_config(page_title="Fortnite Stats", layout="centered")
API_KEY = "264799df-4d52-4a87-8b7f-6ec00be5dc31"  # ← Reemplaza con tu clave de API

# --- TÍTULO ---
st.title("🎮 Fortnite Stats Viewer 2.0")
st.markdown("Consulta rápida y visual de estadísticas de jugadores en Fortnite.")

# --- INPUT DE USUARIO ---
player = st.text_input("🔎 Ingresa tu nombre de usuario:", value="Tfue")
mode = st.selectbox("⚔️ Selecciona modo de juego:", ["overall", "solo", "duo", "squad"])

# --- CONSULTA A LA API ---
@st.cache_data
def get_stats(player):
    headers = {"Authorization": API_KEY}
    url = f"https://fortnite-api.com/v2/stats/br/v2?name={player}&accountType=epic"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        st.error(f"Error al consultar API: {response.status_code}")
        st.text(response.text)  # Mostrar mensaje detallado
        return {}

    return response.json()

# --- CARGAR DATOS Y MOSTRAR ---
if st.button("📲 Consultar"):
    with st.spinner("Consultando datos..."):
        data = get_stats(player)

    try:
        stats = data["data"]["stats"]["all"][mode]

        kills = stats["kills"]
        wins = stats["wins"]
        matches = stats["matches"]
        kd = stats["kd"]
        win_rate = stats["winRate"]
        score = stats.get("score", 0)
        score_per_match = stats.get("scorePerMatch", 0)
        kills_per_match = kills / matches if matches else 0

        # --- INFO GENERAL ---
        st.markdown("## 🧍 Perfil de Jugador")
        st.markdown(f"**👤 Usuario:** {player}")
        st.markdown(f"**⚔️ Modo de juego:** {mode.upper()}")

        # --- MÉTRICAS ---
        st.markdown("## 📊 Estadísticas Generales")
        col1, col2 = st.columns(2)
        col1.metric("🔥 Kills", kills)
        col1.metric("🏆 Wins", wins)
        col1.metric("⚔️ K/D", f"{kd:.2f}")
        col2.metric("🎯 Win Rate", f"{win_rate:.2f}%")
        col2.metric("📈 Kills / Partida", f"{kills_per_match:.2f}")
        col2.metric("💯 Score Total", score)

        if score_per_match:
            st.metric("📊 Score / Partida", f"{score_per_match:.2f}")

        st.divider()

        # --- GRÁFICAS ---
        st.markdown("## 📉 Visualizaciones")

        fig1, ax1 = plt.subplots()
        ax1.bar(["Kills", "Wins", "K/D"], [kills, wins, kd], color=["#007acc", "#44cc00", "#ff8800"])
        ax1.set_title("Kills vs Wins vs K/D")
        st.pyplot(fig1)

        fig2, ax2 = plt.subplots()
        ax2.bar(["Score Total", "Score/Partida"], [score, score_per_match], color=["#33bbee", "#ffaa44"])
        ax2.set_title("Score Comparativo")
        st.pyplot(fig2)

        st.success("✅ Consulta completada")

    except KeyError:
        st.error(f"🚫 No hay estadísticas disponibles para el modo: {mode.upper()}")

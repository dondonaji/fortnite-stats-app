import streamlit as st
import matplotlib.pyplot as plt
from fortnite_client import FortniteClient

# --- CONFIGURACIÓN INICIAL ---
st.set_page_config(page_title="Fortnite Stats", layout="centered")

# --- INITIALIZE CLIENT ---
# Uses environment variable from .env via dotenv loaded in client
client = FortniteClient()

# Check if API Key is available
if not client.api_key:
    st.error("❗ API Key no encontrada. Asegúrate de configurar la variable de entorno FORTNITE_API_KEY o crear un archivo .env.")
    st.stop()

# --- TÍTULO ---
st.title("🎮 Fortnite Stats Viewer 2.0")
st.markdown("Consulta rápida y visual de estadísticas de jugadores en Fortnite.")

# --- INPUT DE USUARIO ---
player = st.text_input("🔎 Ingresa tu nombre de usuario:", value="Tfue")
mode = st.selectbox("⚔️ Selecciona modo de juego:", ["overall", "solo", "duo", "squad"])

# --- CONSULTA A LA API ---
@st.cache_data
def get_stats(player):
    return client.get_stats(player)

# --- CARGAR DATOS Y MOSTRAR ---
if st.button("📲 Consultar"):
    with st.spinner("Consultando datos..."):
        result = get_stats(player)

    if result["status"] != 200:
        st.error(f"Error al consultar API: {result['status']}")
        st.text(result.get("error", "Error desconocido"))
    else:
        try:
            data = result["data"]
            stats = data.get("stats", {}).get("all", {}).get(mode)
            
            if not stats:
                st.error(f"🚫 No hay estadísticas disponibles para el modo: {mode.upper()}")
            else:
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

        except Exception as e:
             st.error(f"Ocurrió un error inesperado al procesar los datos: {e}")

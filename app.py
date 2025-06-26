

import requests
import streamlit as st
import matplotlib.pyplot as plt

API_KEY = "264799df-4d52-4a87-8b7f-6ec00be5dc31"  # Reemplaza con tu API key real

st.set_page_config(page_title="Fortnite Stats", layout="centered")
st.markdown(
    """
    <style>
    body {
        background-color: #121212;
        color: #f0f0f0;
    }
    .stApp {
        background-color: #1e1e1e;
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.title("🎮 Fortnite Stats Viewer")

username = st.text_input("Escribe el nombre del jugador")

modo = st.selectbox("Modo de juego", ["overall", "solo", "duo", "squad"])

if username:
    url = f"https://fortnite-api.com/v2/stats/br/v2?name={username}"
    headers = {"Authorization": API_KEY}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()["data"]
        stats = data["stats"]["all"].get(modo, {})
        st.subheader(f"Estadísticas de {data['account']['name']} ({modo})")

        col1, col2 = st.columns(2)
        with col1:
            st.write(f"**Kills:** {stats.get('kills', 'N/D')}")
            st.write(f"**Victorias:** {stats.get('wins', 'N/D')}")
            st.write(f"**Partidas:** {stats.get('matches', 'N/D')}")
            st.write(f"**Top 1:** {stats.get('top1', 'N/D')}")
            st.write(f"**Top 10:** {stats.get('top10', 'N/D')}")
            st.write(f"**Top 25:** {stats.get('top25', 'N/D')}")
        with col2:
            st.write(f"**K/D:** {stats.get('kd', 'N/D')}")
            st.write(f"**Win Rate:** {stats.get('winRate', 'N/D')}%")
            st.write(f"**Kills/Partida:** {stats.get('killsPerMatch', 'N/D')}")
            st.write(f"**Kills/Minuto:** {stats.get('killsPerMin', 'N/D')}")
            st.write(f"**Minutos jugados:** {stats.get('minutesPlayed', 'N/D')}")
            st.write(f"**Score Total:** {stats.get('score', 'N/D')}")
            st.write(f"**Score/Minuto:** {stats.get('scorePerMin', 'N/D')}")
            st.write(f"**Score/Partida:** {stats.get('scorePerMatch', 'N/D')}")

        st.divider()

        st.subheader("📊 Gráfica: Kills, Wins y K/D")
        try:
            fig1, ax1 = plt.subplots()
            labels = ["Kills", "Victorias", "K/D"]
            values = [
                int(stats.get("kills", 0)),
                int(stats.get("wins", 0)),
                float(stats.get("kd", 0))
            ]
            ax1.bar(labels, values, color=["orange", "green", "violet"])
            st.pyplot(fig1)
        except:
            st.warning("No se pudieron graficar kills, wins y K/D.")

        st.subheader("📈 Gráfica: Score Total vs Score/Partida")
        try:
            fig2, ax2 = plt.subplots()
            labels = ["Total", "Por Partida"]
            values = [
                int(stats.get("score", 0)),
                float(stats.get("scorePerMatch", 0))
            ]
            ax2.bar(labels, values, color=["blue", "cyan"])
            st.pyplot(fig2)
        except:
            st.warning("No se pudo graficar el score.")
    else:
        st.error(f"Error {response.status_code}: {response.text}")

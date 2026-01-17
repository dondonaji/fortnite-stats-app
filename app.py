import streamlit as st
import matplotlib.pyplot as plt
from fortnite_client import FortniteClient

# --- CONFIGURACIÓN DE PÁGINA ---
st.set_page_config(page_title="Fortnite Stats Pro", layout="wide", page_icon="🎮")

# --- ESTILOS CSS PERSONALIZADOS ---
st.markdown("""
<style>
    .stApp {
        background-color: #0e1117;
        color: #fafafa;
    }
    .player-card {
        background: linear-gradient(90deg, #1a1c24 0%, #2b2d3e 100%);
        border-left: 5px solid #bf5af2;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    .metric-card {
        background-color: #1a1c24;
        border: 1px solid #30333d;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .metric-label {
        font-size: 0.8rem;
        color: #a0a0a0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .metric-value {
        font-size: 1.8rem;
        font-weight: bold;
        color: #ffffff;
    }
    .highlight-purple { color: #bf5af2; }
    .highlight-blue { color: #0a84ff; }
    .highlight-green { color: #32d74b; }
    .highlight-orange { color: #ff9f0a; }
</style>
""", unsafe_allow_html=True)

# --- INITIALIZE CLIENT ---
client = FortniteClient()

# Check Environment
if not client.api_key:
    st.warning("⚠️ Modo Local Detectado: No se encontró API Key. Configura .env o Secrets en Streamlit Cloud.")
    st.stop()


# --- SIDEBAR: INPUTS ---
with st.sidebar:
    st.title("🎮 Configuración")
    player = st.text_input("Usuario Epic Games:", value="Tfue")
    
    st.markdown("---")
    st.markdown("### ⚔️ Modos de Juego")
    mode = st.radio("Selecciona vista:", ["Global", "Solo", "Duo", "Squad"], index=0)
    
    mode_map = {
        "Global": "overall",
        "Solo": "solo",
        "Duo": "duo",
        "Squad": "squad"
    }
    selected_mode = mode_map[mode]
    
    st.markdown("---")
    if st.button("🔄 Actualizar Datos", type="primary"):
        st.cache_data.clear()


# --- FUNCIÓN DE CONSULTA ---
@st.cache_data
def get_stats(player):
    return client.get_stats(player)

# --- UTILS ---
def format_time(minutes):
    days = minutes // 1440
    remaining_minutes = minutes % 1440
    hours = remaining_minutes // 60
    mins = remaining_minutes % 60
    return f"{days}d {hours}h {mins}m"

# --- MAIN DASHBOARD ---
result = get_stats(player)

if result["status"] != 200:
    st.error(f"❌ Error {result['status']}: {result.get('error', 'No se pudo conectar con la API')}")
else:
    data = result["data"]
    account = data.get("account", {})
    stats = data.get("stats", {}).get("all", {}).get(selected_mode)
    
    # Last Modified / Activity
    last_modified = data.get("stats", {}).get("all", {}).get("overall", {}).get("lastModified", "N/A")
    if last_modified != "N/A":
        last_modified = last_modified.split("T")[0] # Simple date

    if not stats:
        st.info(f"🤷‍♂️ No hay datos disponibles para **{player}** en modo **{mode}**.")
    else:
        # --- DATOS CRUDOS ---
        kills = stats.get("kills", 0)
        wins = stats.get("wins", 0)
        matches = stats.get("matches", 0)
        kd = stats.get("kd", 0.0)
        win_rate = stats.get("winRate", 0.0)
        minutes_played = stats.get("minutesPlayed", 0)
        
        # Top Stats (Survival)
        top10 = stats.get("top10", 0)
        top25 = stats.get("top25", 0)
        
        # --- DERIVED METRICS ---
        formatted_time = format_time(minutes_played)
        avg_match_duration = (minutes_played / matches) if matches else 0
        
        # --- HERO SECTION (PLAYER CARD) ---
        st.markdown(f"""
        <div class="player-card">
            <h1 style='margin:0; padding:0;'>👤 {account.get('name', player)}</h1>
            <div style='color: #a0a0a0; font-size: 0.9em; margin-top: 5px;'>
                📅 Última Actividad: {last_modified} | 🆙 Battle Pass Level: {data.get('battlePass', {}).get('level', 'N/A')}
            </div>
            <div style='margin-top: 10px; font-weight: bold; color: #bf5af2;'>
                ⏱ Tiempo Total de Juego: {formatted_time}
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # --- LAYOUT DE TARJETAS (KPIs) CON TOOLTIPS ---
        st.markdown("### 🔥 Rendimiento Clave en " + mode)
        kpi1, kpi2, kpi3, kpi4 = st.columns(4)

        with kpi1:
            st.metric("Victorias", wins, help="Total de partidas ganadas (#1 Victory Royale)")
            st.metric("Win Rate", f"{win_rate:.1f}%", help="Porcentaje de partidas ganadas del total jugadas.")

        with kpi2:
            st.metric("K/D Ratio", f"{kd:.2f}", help="Kills / Deaths. Por encima de 1.0 significa que matas más de lo que mueres.")
            st.metric("Kills Totales", kills, help="Enemigos eliminados en total.")
            
        with kpi3:
            st.metric("Partidas", matches, help="Total de partidas jugadas en este modo.")
            st.metric("Duración Media", f"{avg_match_duration:.1f} min", help="Tiempo promedio que duras vivo en una partida.")

        with kpi4:
            st.metric("Score Total", f"{stats.get('score', 0):,}", help="Puntuación acumulada de experiencia.")
            st.metric("Score/Min", f"{stats.get('scorePerMin', 0):.1f}", help="Eficiencia de puntos por minuto jugado.")

        st.markdown("---")

        # --- SECCIÓN DE ANÁLISIS VISUAL ---
        col_charts, col_details = st.columns([1, 1])

        with col_charts:
            st.markdown("### 🛡 Eficiencia de Supervivencia")
            st.caption("¿Qué tan seguido llegas al final?")
            
            # Donut Chart for Survival
            labels = ['Ganadas', 'Top 10', 'Top 25', 'Resto']
            # Calculate disjoint sets for the chart
            # Wins are inside Top 10, Top 10 inside Top 25.
            # Viz Logic: Exclusive segments
            exclusive_wins = wins
            exclusive_top10 = max(0, top10 - wins)
            exclusive_top25 = max(0, top25 - top10)
            others = max(0, matches - top25)
            
            sizes = [exclusive_wins, exclusive_top10, exclusive_top25, others]
            colors = ['#32d74b', '#0a84ff', '#bf5af2', '#30333d']
            
            fig1, ax1 = plt.subplots(facecolor='#0e1117')
            ax1.set_facecolor('#0e1117')
            
            wedges, texts, autotexts = ax1.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors, pctdistance=0.85, textprops={'color':"white"})
            
            # Draw circle for Donut
            centre_circle = plt.Circle((0,0),0.70,fc='#0e1117')
            fig1.gca().add_artist(centre_circle)
            
            ax1.axis('equal')  
            st.pyplot(fig1)

        with col_details:
            st.markdown("### 🧠 Análisis de Estilo")
            
            # Dynamic Analysis Text
            if avg_match_duration > 15:
                style = "🐢 **Estratega:** Juegas partidas largas, priorizando posicionamiento."
            elif avg_match_duration < 5:
                style = "🐇 **Rusher:** Partidas rápidas, probablemente caes en zonas calientes (Hot Drops)."
            else:
                style = "⚖️ **Balanceado:** Mantienes un ritmo de juego estándar."
                
            st.info(style)
            
            if kd > 4.0:
                st.success("🔥 **Slayer:** Tu K/D es impresionante. Eres una amenaza en el lobby.")
            elif win_rate > 10.0:
                 st.success("👑 **Winner:** Sabes cómo cerrar las partidas y ganar.")
            
            st.markdown(f"""
            **Estadísticas de Supervivencia:**
            - **Top 10:** {top10} veces ({ (top10/matches*100):.1f}% de las partidas)
            - **Top 25:** {top25} veces ({ (top25/matches*100):.1f}% de las partidas)
            """)

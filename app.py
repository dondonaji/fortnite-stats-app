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
    .metric-card {
        background-color: #1a1c24;
        border: 1px solid #30333d;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .metric-label {
        font-size: 0.9rem;
        color: #a0a0a0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .metric-value {
        font-size: 2rem;
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
    # Stop execution if critical, or allow mock data if we had it. For now, stop.
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

# --- MAIN DASHBOARD ---
result = get_stats(player)

if result["status"] != 200:
    st.error(f"❌ Error {result['status']}: {result.get('error', 'No se pudo conectar con la API')}")
else:
    data = result["data"]
    account = data.get("account", {})
    stats = data.get("stats", {}).get("all", {}).get(selected_mode)

    if not stats:
        st.info(f"🤷‍♂️ No hay datos disponibles para **{player}** en modo **{mode}**.")
    else:
        # --- HEADER JUGADOR ---
        st.markdown(f"# 👤 {account.get('name', player)}")
        st.markdown(f"**Battle Pass Level:** {data.get('battlePass', {}).get('level', 'N/A')}")
        
        # --- DATOS CRUDOS ---
        kills = stats.get("kills", 0)
        wins = stats.get("wins", 0)
        matches = stats.get("matches", 0)
        kd = stats.get("kd", 0.0)
        win_rate = stats.get("winRate", 0.0)
        score_per_match = stats.get("scorePerMatch", 0.0)
        minutes_played = stats.get("minutesPlayed", 0)
        
        # --- DERIVED METRICS ---
        games_to_win = int(100 / win_rate) if win_rate > 0 else "∞"
        hours_played = int(minutes_played / 60)
        
        # --- LAYOUT DE TARJETAS (KPIs) ---
        st.markdown("### 🔥 Rendimiento Clave")
        kpi1, kpi2, kpi3, kpi4 = st.columns(4)

        with kpi1:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">Victorias</div>
                <div class="metric-value highlight-green">{wins}</div>
                <div class="metric-label">{win_rate:.1f}% Win Rate</div>
            </div>
            """, unsafe_allow_html=True)

        with kpi2:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">K/D Ratio</div>
                <div class="metric-value highlight-orange">{kd:.2f}</div>
                <div class="metric-label">Kills/Muerte</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi3:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">Partidas</div>
                <div class="metric-value highlight-blue">{matches}</div>
                <div class="metric-label">Jugadas</div>
            </div>
            """, unsafe_allow_html=True)

        with kpi4:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">Score/Match</div>
                <div class="metric-value highlight-purple">{int(score_per_match)}</div>
                <div class="metric-label">Puntos Prom.</div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("---")

        # --- SECCIÓN DE ANÁLISIS ---
        col_charts, col_details = st.columns([2, 1])

        with col_charts:
            st.markdown("### 📉 Distribución de Kills vs Wins")
            # Gráfica optimizada
            fig, ax = plt.subplots(facecolor='#0e1117')
            ax.set_facecolor('#0e1117')
            
            # Datos para gráfica
            categories = ['Kills (x100)', 'Wins', 'Top 10 (Est.)'] 
            # Normalizamos Kills para que se vea en la gráfica
            values = [kills / 100, wins, stats.get("top10", 0)] 
            
            bars = ax.bar(categories, values, color=['#ff9f0a', '#32d74b', '#0a84ff'])
            
            # Estilos de gráfica
            ax.tick_params(axis='x', colors='white')
            ax.tick_params(axis='y', colors='white')
            ax.spines['bottom'].set_color('white')
            ax.spines['left'].set_color('white') 
            ax.spines['top'].set_visible(False)
            ax.spines['right'].set_visible(False)
            
            st.pyplot(fig)

        with col_details:
            st.markdown("### 🧠 Insights")
            st.info(f"⏱ **Tiempo Total:** {hours_played} horas jugadas")
            
            if isinstance(games_to_win, int):
                st.success(f"🎯 **Consistencia:** Ganas 1 de cada {games_to_win} partidas aprox.")
            else:
                st.warning("🎯 **Consistencia:** Aún no has ganado partidas en este modo.")
                
            if kd > 3.0:
                st.write("🔥 **Nivel:** ¡Estás por encima del promedio!")
            elif kd > 1.0:
                 st.write("✅ **Nivel:** Jugador sólido.")
            else:
                 st.write("🛡 **Nivel:** Enfocado en supervivencia.")

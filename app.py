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
        background: linear-gradient(135deg, #1a1c24 0%, #2b2d3e 100%);
        border-left: 5px solid #bf5af2;
        padding: 25px;
        border-radius: 12px;
        margin-bottom: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .player-header {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    .player-avatar {
        width: 80px;
        height: 80px;
        background-color: #bf5af2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: bold;
        color: white;
    }
    .time-stats {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #30333d;
        display: flex;
        gap: 30px;
        font-size: 0.9rem;
        color: #d0d0d0;
    }
    .metric-card {
        background-color: #1a1c24;
        border: 1px solid #30333d;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        transition: transform 0.2s;
    }
    .metric-card:hover {
        transform: translateY(-2px);
        border-color: #bf5af2;
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
def format_time_human(minutes):
    days = minutes // 1440
    remaining_minutes = minutes % 1440
    hours = remaining_minutes // 60
    mins = remaining_minutes % 60
    return f"{days} dias, {hours} horas, {mins} min"

def create_radar_chart(stats):
    import numpy as np
    
    # --- DATA PREP ---
    # Normalize values for Radar (0-100 scale logic tailored for Fortnite)
    # These max values are arbitrary "Pro Level" baselines for normalization
    max_kd = 7.0
    max_winrate = 20.0
    max_top10 = 50.0 # Top 10 Rate %
    max_score_min = 40.0
    max_kills_match = 6.0
    
    kd = min(stats.get("kd", 0), max_kd) / max_kd * 100
    win_rate = min(stats.get("winRate", 0), max_winrate) / max_winrate * 100
    
    matches = stats.get("matches", 1)
    top10_rate = (stats.get("top10", 0) / matches * 100) if matches else 0
    top10_norm = min(top10_rate, max_top10) / max_top10 * 100
    
    score_min = min(stats.get("scorePerMin", 0), max_score_min) / max_score_min * 100
    
    kills_match = stats.get("kills", 0) / matches if matches else 0
    kills_match_norm = min(kills_match, max_kills_match) / max_kills_match * 100
    
    # --- PLOT ---
    labels = ['Combate (K/D)', 'Victoria (Win%)', 'Supervivencia (Top%)', 'Eficiencia (Score/Min)', 'Agresividad (Kills/Match)']
    values = [kd, win_rate, top10_norm, score_min, kills_match_norm]
    
    # Close the loop
    values += values[:1]
    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.set_facecolor('#1a1c24')
    fig.patch.set_facecolor('#1a1c24')
    
    # Draw polygon
    ax.plot(angles, values, color='#bf5af2', linewidth=2, linestyle='solid')
    ax.fill(angles, values, color='#bf5af2', alpha=0.25)
    
    # Fix labels
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, color='white', size=10)
    
    # Style grid
    ax.spines['polar'].set_color('#30333d')
    ax.grid(color='#30333d', linestyle='--')
    
    return fig

# --- MAIN DASHBOARD ---
result = get_stats(player)

if result["status"] != 200:
    st.error(f"❌ Error {result['status']}: {result.get('error', 'No se pudo conectar con la API')}")
else:
    data = result["data"]
    account = data.get("account", {})
    stats = data.get("stats", {}).get("all", {}).get(selected_mode)
    
    last_modified = data.get("stats", {}).get("all", {}).get("overall", {}).get("lastModified", "N/A")
    if last_modified != "N/A":
        last_modified = last_modified.split("T")[0]

    if not stats:
        st.info(f"🤷‍♂️ No hay datos disponibles para **{player}** en modo **{mode}**.")
    else:
        # --- DATA EXTRACTION ---
        kills = stats.get("kills", 0)
        wins = stats.get("wins", 0)
        matches = stats.get("matches", 0)
        kd = stats.get("kd", 0.0)
        win_rate = stats.get("winRate", 0.0)
        minutes_played = stats.get("minutesPlayed", 0)
        score_per_match = stats.get("scorePerMatch", 0)
        
        # --- TIME CALCS ---
        human_time = format_time_human(minutes_played)
        hours_only = int(minutes_played / 60)
        
        # --- HERO SECTION (PLAYER CARD) ---
        initial = player[0].upper() if player else "?"
        
        st.markdown(f"""
        <div class="player-card">
            <div class="player-header">
                <div class="player-avatar">{initial}</div>
                <div>
                    <h1 style='margin:0; padding:0; font-size: 2.5rem;'>{account.get('name', player)}</h1>
                    <div style='color: #bf5af2; font-weight: bold;'>Battle Pass Level: {data.get('battlePass', {}).get('level', 'N/A')}</div>
                </div>
            </div>
            <div class="time-stats">
                <div>
                    <div style="color: #a0a0a0; font-size: 0.8rem;">DEDICACIÓN TOTAL (HUMANO)</div>
                    <div style="color: white; font-weight: bold;">⏱ {human_time}</div>
                </div>
                <div>
                    <div style="color: #a0a0a0; font-size: 0.8rem;">HORAS TOTALES</div>
                    <div style="color: white; font-weight: bold;">⌛ {hours_only:,} horas</div>
                </div>
                <div>
                    <div style="color: #a0a0a0; font-size: 0.8rem;">ÚLTIMA PARTIDA</div>
                    <div style="color: white; font-weight: bold;">📅 {last_modified}</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # --- KPI ROW ---
        k1, k2, k3, k4 = st.columns(4)
        k1.metric("Victorias", wins, help="#1 Victory Royales acumuladas")
        k2.metric("K/D Ratio", f"{kd:.2f}", help="Kills por Muerte (Target > 1.0)")
        k3.metric("Win Rate", f"{win_rate:.1f}%", help="% de Victorias por partida")
        k4.metric("Partidas", f"{matches:,}", help="Total de partidas jugadas")
        
        st.markdown("---")

        # --- UNIFIED ANALYSIS PANEL ---
        st.markdown("### 🕸 Radar de Habilidad & Análisis")
        
        col_radar, col_analysis = st.columns([1, 1])
        
        with col_radar:
            # PENTAGON CHART
            try:
                fig_radar = create_radar_chart(stats)
                st.pyplot(fig_radar)
                st.caption("Gráfico de 5 Ejes normalizado para Fornite (Basado en stats Pro).")
            except Exception as e:
                st.error(f"Error generando radar: {e}")

        with col_analysis:
            st.markdown(f"""
            #### 🧠 Análisis de Rendimiento
            
            Este panel correlaciona tus estadísticas para determinar tu perfil de jugador.
            
            - **Eficiencia de Combate:** Tienes un K/D de **{kd}**.
              {'🔥 Eres un **Slayer**, buscas la pelea.' if kd > 3.0 else '🛡 Juegas más táctico/defensivo.'}
              
            - **Supervivencia:** Ganas el **{win_rate}%** de tus partidas.
              {'👑 Tienes **Mentalidad de Ganador**, cierras bien los juegos.' if win_rate > 10 else '💡 Enfócate en el posicionamiento final.'}
              
            - **Eficiencia de Puntos:** Obtienes **{int(score_per_match)}** puntos por partida promedio.
            """)
            
            st.info("💡 **Tip:** Un jugador balanceado mantiene el gráfico de radar lo más amplio y circular posible.")

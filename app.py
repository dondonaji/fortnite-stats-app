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
    
    # --- DATA PREP (NORMALIZED) ---
    max_kd = 7.0
    max_winrate = 20.0
    max_score_min = 40.0
    max_kills_match = 6.0
    
    # Solo métricas de habilidad, sacamos supervivencia de aquí
    labels = ['Combate (K/D)', 'Victoria (Win%)', 'Eficiencia (Sc/Min)', 'Agresividad (K/Match)']
    
    kd = min(stats.get("kd", 0), max_kd) / max_kd * 100
    win_rate = min(stats.get("winRate", 0), max_winrate) / max_winrate * 100
    score_min = min(stats.get("scorePerMin", 0), max_score_min) / max_score_min * 100
    matches = stats.get("matches", 1)
    kills_match = stats.get("kills", 0) / matches if matches else 0
    kills_match_norm = min(kills_match, max_kills_match) / max_kills_match * 100
    
    values = [kd, win_rate, score_min, kills_match_norm]
    
    # Close the loop
    values += values[:1]
    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(4, 4), subplot_kw=dict(polar=True))
    ax.set_facecolor('#1a1c24')
    fig.patch.set_facecolor('#1a1c24')
    
    ax.plot(angles, values, color='#bf5af2', linewidth=2, linestyle='solid')
    ax.fill(angles, values, color='#bf5af2', alpha=0.25)
    
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, color='white', size=8)
    
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
        # --- PREPARE DATA ---
        minutes_played = stats.get("minutesPlayed", 0)
        human_time = format_time_human(minutes_played)
        hours_only = int(minutes_played / 60)
        initial = player[0].upper() if player else "?"
        
        # --- TAB LAYOUT ---
        tab1, tab2 = st.tabs(["📊 Dashboard Principal", "🧪 Laboratorio / Skins"])
        
        with tab1:
             # --- HERO SECTION ---
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
                        <div style="color: #a0a0a0; font-size: 0.8rem;">DEDICACIÓN (HUMANO)</div>
                        <div style="color: white; font-weight: bold;">⏱ {human_time}</div>
                    </div>
                    <div>
                        <div style="color: #a0a0a0; font-size: 0.8rem;">HORAS TOTALES</div>
                        <div style="color: white; font-weight: bold;">⌛ {hours_only:,} h</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # --- KPIS ---
            k1, k2, k3, k4 = st.columns(4)
            k1.metric("Victorias", stats.get("wins"), help="#1 Victory Royales")
            k2.metric("K/D Ratio", f"{stats.get('kd'):.2f}", help="Target Pro: >3.0")
            k3.metric("Win Rate", f"{stats.get('winRate'):.1f}%", help="% Victorias")
            k4.metric("Partidas", f"{stats.get('matches'):,}", help="Total Games")
            st.markdown("---")
            
            # --- CHARTS ROW ---
            c1, c2 = st.columns([1, 1])
            
            with c1:
                st.markdown("### 🕸 Radar de Habilidad")
                st.pyplot(create_radar_chart(stats))
                
                # Data Normalizada Explicita
                st.markdown("#### 📐 Datos del Radar")
                col_a, col_b = st.columns(2)
                col_a.metric("Agresividad (Kills/Match)", f"{stats.get('kills')/stats.get('matches'):.1f}")
                col_b.metric("Eficiencia (Score/Min)", f"{stats.get('scorePerMin'):.1f}")
            
            with c2:
                st.markdown("### 🛡 Embudo de Supervivencia")
                # Gráfico de Barras Horizontal (Thread/Funnel style)
                matches = stats.get('matches', 1)
                top25 = stats.get('top25', 0)
                top10 = stats.get('top10', 0)
                wins = stats.get('wins', 0)
                
                # Plot
                fig_bar, ax_bar = plt.subplots(figsize=(5, 3))
                ax_bar.set_facecolor('#1a1c24')
                fig_bar.patch.set_facecolor('#1a1c24')
                
                y_pos = [0, 1, 2, 3]
                performance = [matches, top25, top10, wins]
                labels = ['Total Partidas', 'Top 25', 'Top 10', 'Victorias']
                colors = ['#30333d', '#bf5af2', '#0a84ff', '#32d74b']
                
                ax_bar.barh(y_pos, performance, align='center', color=colors)
                ax_bar.set_yticks(y_pos)
                ax_bar.set_yticklabels(labels, color='white')
                ax_bar.invert_yaxis()  # labels read top-to-bottom
                ax_bar.tick_params(axis='x', colors='#a0a0a0')
                ax_bar.spines['top'].set_visible(False)
                ax_bar.spines['right'].set_visible(False)
                ax_bar.spines['bottom'].set_color('#30333d')
                ax_bar.spines['left'].set_visible(False)
                
                # Add labels to bars
                for i, v in enumerate(performance):
                    ax_bar.text(v + (matches*0.02), i, str(v), color='white', va='center', fontweight='bold')

                st.pyplot(fig_bar)

        with tab2:
            st.markdown("## 🧪 Laboratorio de Experimentos")
            st.info("Área de pruebas para nuevas funcionalidades UX y análisis de datos crudos.")
            
            st.markdown("### 🎭 Buscador de Skins (Preview)")
            skin_name = st.text_input("Busca una skin (ej. 'Aura', 'Peely'):")
            
            if skin_name:
                with st.spinner("Buscando en API de Cosméticos..."):
                    res_cosmetic = client.get_cosmetic(skin_name)
                    
                if res_cosmetic["status"] == 200:
                    item = res_cosmetic["data"]
                    st.success(f"¡Encontrado! **{item.get('name')}**")
                    
                    c_img, c_info = st.columns([1, 2])
                    with c_img:
                        img_url = item.get("images", {}).get("icon")
                        if img_url:
                            st.image(img_url)
                    with c_info:
                        st.write(f"**Descripción:** {item.get('description')}")
                        st.write(f"**Rareza:** {item.get('rarity', {}).get('displayValue')}")
                        st.write(f"**Introducción:** {item.get('introduction', {}).get('text')}")
                else:
                    st.warning("No se encontró cosmético con ese nombre.")
            
            st.markdown("---")
            st.markdown("### 💾 Inspector de Datos Crudos (JSON)")
            with st.expander("Ver JSON completo de Stats"):
                st.json(stats)

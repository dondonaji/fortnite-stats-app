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
    return f"{days}d {hours}h {mins}m"

def render_kpi_card(title, value, subtitle, tooltip, color_class="highlight-blue"):
    """Renders a custom HTML KPI card with tooltip support."""
    st.markdown(f"""
    <div class="metric-card" title="{tooltip}">
        <div class="metric-label">{title}</div>
        <div class="metric-value {color_class}">{value}</div>
        <div class="metric-label" style="font-size: 0.7rem; opacity: 0.8;">{subtitle}</div>
    </div>
    """, unsafe_allow_html=True)

def create_radar_chart(stats):
    import numpy as np
    
    # --- DATA PREP (NORMALIZED TO AVERAGE PLAYER) ---
    # Adjusted baselines to make the chart more "balanced" for a normal user
    # Max values represent a "Great" player, not a "Pro"
    max_kd = 3.0       # Before was 7.0
    max_winrate = 10.0 # Before was 20.0
    max_score_min = 25.0
    max_kills_match = 4.0
    
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
    ax.set_xticklabels(labels, color='white', size=9)
    # Add baseline circle (50%)
    ax.plot(angles, [50]*5, color='#30333d', linewidth=1, linestyle='--')
    
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
        matches = stats.get("matches", 0)
        
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
                     <div>
                        <div style="color: #a0a0a0; font-size: 0.8rem;">TOTAL PARTIDAS</div>
                        <div style="color: white; font-weight: bold;">🎮 {matches:,}</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # --- CUSTOM KPIS ---
            k1, k2, k3, k4 = st.columns(4)
            with k1:
                render_kpi_card("Victorias", stats.get("wins"), "Victory Royales", 
                              f"Total de veces que has ganado la partida. (Ej. Pro: >1000). Tienes {stats.get('wins')} wins.", "highlight-green")
            with k2:
                render_kpi_card("K/D Ratio", f"{stats.get('kd'):.2f}", "Kills / Deaths", 
                              f"Por cada muerte tuya, eliminas a {stats.get('kd')} jugadores. >1.0 es positivo.", "highlight-orange")
            with k3:
                render_kpi_card("Win Rate", f"{stats.get('winRate'):.1f}%", "Efectividad", 
                              f"Ganas el {stats.get('winRate')}% de las partidas que juegas.", "highlight-blue")
            with k4:
                score_pm = stats.get('scorePerMin', 0)
                render_kpi_card("Score/Min", f"{score_pm:.1f}", "Ritmo de Juego", 
                              "Puntos de experiencia ganados por minuto. Indica qué tan activo eres looteando y sobreviviendo.", "highlight-purple")
            
            st.markdown("---")
            
            # --- REFINED CHARTS ---
            c1, c2 = st.columns([1, 1.5]) # Radar smaller, Line Chart wider
            
            with c1:
                st.markdown("### 🕸 Radar de Habilidad")
                st.pyplot(create_radar_chart(stats))
                
                with st.expander("Ver Detalles de Habilidad"):
                    st.write("Este gráfico compara tus stats con un 'Jugador Promedio'.")
                    st.write(f"- **Combate:** {stats.get('kd')} K/D")
                    st.write(f"- **Win Rate:** {stats.get('winRate')}%")
            
            with c2:
                st.markdown("### 📈 Hilo de Supervivencia")
                
                # --- FILTER SELECTION ---
                available_metrics = ['Top 25', 'Top 12', 'Top 10', 'Top 5', 'Top 3', 'Victorias']
                # Default selection
                default_metrics = ['Top 25', 'Top 10', 'Top 5', 'Victorias']
                
                selected_metrics = st.multiselect("Filtrar Tops:", available_metrics, default=default_metrics)
                
                if selected_metrics:
                    # Mapping logic because API keys vary slightly (wins vs topX)
                    # Note: API might keys are 'top3', 'top5', 'top10', 'top25' usually.
                    # 'Victorias' -> 'wins'
                    
                    metric_values = []
                    metric_labels = []
                    
                    # Sort to ensure logical order (Left to Right: Top 25 -> Win)
                    # We map display name to API key and sort order
                    sort_order = {
                        'Top 25': 1, 'Top 12': 2, 'Top 10': 3, 
                        'Top 6': 3.5, 'Top 5': 4, 'Top 3': 5, 'Victorias': 6
                    }
                    
                    sorted_selection = sorted(selected_metrics, key=lambda x: sort_order.get(x, 0))
                    
                    for m in sorted_selection:
                        if m == 'Victorias':
                            val = stats.get("wins", 0)
                        else:
                            # Clean string "Top 25" -> "top25"
                            api_key = m.lower().replace(" ", "")
                            val = stats.get(api_key, 0)
                        
                        metric_labels.append(m)
                        metric_values.append(val)
                    
                    # Plot Hilo (Line Chart)
                    fig_line, ax_line = plt.subplots(figsize=(6, 4))
                    ax_line.set_facecolor('#1a1c24')
                    fig_line.patch.set_facecolor('#1a1c24')
                    
                    # Plot Line
                    ax_line.plot(metric_labels, metric_values, marker='o', color='#0a84ff', linewidth=2, markersize=8)
                    
                    # Style
                    ax_line.tick_params(axis='x', colors='white')
                    ax_line.tick_params(axis='y', colors='white')
                    ax_line.spines['top'].set_visible(False)
                    ax_line.spines['right'].set_visible(False)
                    ax_line.spines['bottom'].set_color('#30333d')
                    ax_line.spines['left'].set_color('#30333d')
                    ax_line.grid(color='#30333d', linestyle='--', alpha=0.3)
                    
                    # Annotate points
                    for i, v in enumerate(metric_values):
                        ax_line.text(i, v + (max(metric_values)*0.05), str(v), color='white', ha='center', fontweight='bold')
                        
                    st.pyplot(fig_line)
                else:
                    st.warning("Selecciona al menos una métrica para ver el gráfico.")

        with tab2:
            st.markdown("## 🧪 Laboratorio de Cosméticos (Daily Shop)")
            
            if st.button("🛍 Cargar Tienda Diaria (Featured)"):
                with st.spinner("Conectando con la API..."):
                    shop_res = client.get_shop()
                    
                if shop_res["status"] == 200:
                    shop_data = shop_res["data"]
                    featured = shop_data.get("featured", {}).get("entries", [])
                    
                    if not featured:
                         st.info("No se encontraron items destacados o la estructura de la API cambió.")
                    else:
                        st.success(f"Mostrando {len(featured)} items destacados de hoy.")
                        
                        # Gallery Grid
                        cols = st.columns(4)
                        for idx, item in enumerate(featured):
                            with cols[idx % 4]:
                                # Extract simple data
                                try:
                                    # Usually items are grouped in 'items' list inside entry
                                    first_item = item.get("items", [])[0]
                                    name = first_item.get("name", "Unknown")
                                    rarity = first_item.get("rarity", {}).get("value", "common")
                                    img = first_item.get("images", {}).get("icon") or first_item.get("images", {}).get("smallIcon")
                                    price = item.get("finalPrice", "?")
                                    
                                    if img:
                                        st.image(img, use_container_width=True)
                                    st.markdown(f"**{name}**")
                                    st.caption(f"💰 {price} V-Bucks")
                                except Exception as e:
                                    st.caption("Error item")
                else:
                    st.error(f"Error cargando tienda: {shop_res.get('error')}")

            st.markdown("---")
            st.markdown("### 💾 Inspector de Datos (Categorizado)")
            
            c_input, c_combat, c_survive = st.columns(3)
            
            with c_input:
                st.markdown("#### 🎮 Input")
                st.json(result["data"]["stats"].get("gamepad"), expanded=False)
                st.json(result["data"]["stats"].get("keyboardMouse"), expanded=False)
                
            with c_combat:
                st.markdown("#### ⚔️ Combate (Global)")
                raw_combat = {k: v for k, v in stats.items() if k in ['kills', 'deaths', 'kd', 'killsPerMin', 'killsPerMatch']}
                st.json(raw_combat)

            with c_survive:
                st.markdown("#### 🛡 Supervivencia (Global)")
                raw_surv = {k: v for k, v in stats.items() if k.startswith('top') or k in ['wins', 'winRate', 'matches']}
                st.json(raw_surv)

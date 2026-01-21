import streamlit as st
from components.utils import format_time_human
from components.metrics import render_kpi_card
from components.charts import create_radar_chart, create_survival_line_chart

def show_dashboard(data, player, mode):
    account = data.get("account", {})
    stats = data.get("stats", {}).get("all", {}).get(mode)
    
    if not stats:
        st.info(f"🤷‍♂️ No hay datos disponibles para **{player}** en modo **{mode}**.")
        return

    # --- PREPARE DATA ---
    minutes_played = stats.get("minutesPlayed", 0)
    human_time = format_time_human(minutes_played)
    hours_only = int(minutes_played / 60)
    initial = player[0].upper() if player else "?"
    matches = stats.get("matches", 0)
    last_modified = data.get("stats", {}).get("all", {}).get("overall", {}).get("lastModified", "N/A").split("T")[0]

    # --- HERO SECTION ---
    st.markdown(f"""
    <div class="player-card">
        <div class="player-header">
            <div class="player-avatar">{initial}</div>
            <div>
                <h1 style='margin:0; padding:0; font-size: 2.5rem;'>{account.get('name', player)}</h1>
                <div style='color: #bf5af2; font-weight: bold;'>
                    Battle Pass {data.get('battlePass', {}).get('level', 'N/A')}
                </div>
            </div>
        </div>
        <div class="time-stats">
            <div>
                <div class="label-sm">DEDICACIÓN</div>
                <div class="val-lg">⏱ {human_time}</div>
            </div>
            <div>
                <div class="label-sm">HORAS TOTALES</div>
                <div class="val-lg">⌛ {hours_only:,} h</div>
            </div>
                <div>
                <div class="label-sm">TOTAL PARTIDAS</div>
                <div class="val-lg">🎮 {matches:,}</div>
            </div>
        </div>
    </div>
    <style>
    .label-sm {{ color: #a0a0a0; font-size: 0.8rem; }}
    .val-lg {{ color: white; font-weight: bold; }}
    </style>
    """, unsafe_allow_html=True)
    
    # --- CUSTOM KPIS ---
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        render_kpi_card("Victorias", stats.get("wins"), "Victory Royales", 
                        f"Total wins: {stats.get('wins')}.", "highlight-green")
    with k2:
        render_kpi_card("K/D Ratio", f"{stats.get('kd'):.2f}", "Kills / Deaths", 
                        f"K/D: {stats.get('kd')}", "highlight-orange")
    with k3:
        render_kpi_card("Win Rate", f"{stats.get('winRate'):.1f}%", "Efectividad", 
                        f"Win Rate: {stats.get('winRate')}%", "highlight-blue")
    with k4:
        score_pm = stats.get('scorePerMin', 0)
        render_kpi_card("Score/Min", f"{score_pm:.1f}", "XP/Minuto", 
                        f"Score/Min: {score_pm:.1f}", "highlight-purple")
    
    st.markdown("---")
    
    # --- CHARTS ---
    c1, c2 = st.columns([1, 1.5])
    
    with c1:
        st.markdown("### 🕸 Radar de Habilidad")
        st.pyplot(create_radar_chart(stats, player_name=player))
        with st.expander("Ver Detalles"):
            st.write(f"- **K/D:** {stats.get('kd')}")
            st.write(f"- **Win %:** {stats.get('winRate')}%")
    
    with c2:
        st.markdown("### 📈 Hilo de Supervivencia")
        st.pyplot(create_survival_line_chart(stats))

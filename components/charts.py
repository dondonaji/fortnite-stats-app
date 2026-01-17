import matplotlib.pyplot as plt
import numpy as np
import streamlit as st

def create_radar_chart(stats, player_name="Player", compare_stats=None, compare_name="Rival"):
    """
    Crea un gráfico de radar.
    Si `compare_stats` se provee, superpone un segundo gráfico para el modo Vs.
    """
    
    # --- DATA PREP (NORMALIZED TO AVERAGE PLAYER) ---
    max_kd = 3.0       
    max_winrate = 10.0 
    max_score_min = 25.0
    max_kills_match = 4.0
    
    labels = ['Combate (K/D)', 'Victoria (Win%)', 'Eficiencia (Sc/Min)', 'Agresividad (K/Match)']
    
    def get_values(s):
        kd = min(s.get("kd", 0), max_kd) / max_kd * 100
        win_rate = min(s.get("winRate", 0), max_winrate) / max_winrate * 100
        score_min = min(s.get("scorePerMin", 0), max_score_min) / max_score_min * 100
        matches = s.get("matches", 1)
        kills_match = s.get("kills", 0) / matches if matches else 0
        kills_match_norm = min(kills_match, max_kills_match) / max_kills_match * 100
        
        values = [kd, win_rate, score_min, kills_match_norm]
        values += values[:1] # Close loop
        return values

    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(4, 4), subplot_kw=dict(polar=True))
    ax.set_facecolor('#1a1c24')
    fig.patch.set_facecolor('#1a1c24')
    
    # Plot Player 1
    values_p1 = get_values(stats)
    ax.plot(angles, values_p1, color='#bf5af2', linewidth=2, linestyle='solid', label=player_name)
    ax.fill(angles, values_p1, color='#bf5af2', alpha=0.25)
    
    # Plot Player 2 (If Comparison)
    if compare_stats:
        values_p2 = get_values(compare_stats)
        ax.plot(angles, values_p2, color='#0a84ff', linewidth=2, linestyle='solid', label=compare_name)
        ax.fill(angles, values_p2, color='#0a84ff', alpha=0.25)
        ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize='small', frameon=False, labelcolor='white')
    
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, color='white', size=9)
    # Baseline 50%
    ax.plot(angles, [50]*5, color='#30333d', linewidth=1, linestyle='--')
    
    ax.spines['polar'].set_color('#30333d')
    ax.grid(color='#30333d', linestyle='--')
    
    return fig

def create_survival_line_chart(stats):
    """Crea el gráfico de línea (Hilo) para Supervivencia"""
    # Filter selection logic would be passed ideally, but we keep it simple for component
    # Default 'Full' View
    metric_map = {
        'Top 25': stats.get('top25', 0),
        'Top 10': stats.get('top10', 0),
        'Top 5': stats.get('top5', 0),
        'Victorias': stats.get('wins', 0)
    }
    
    labels = list(metric_map.keys())
    values = list(metric_map.values())
    
    fig_line, ax_line = plt.subplots(figsize=(6, 4))
    ax_line.set_facecolor('#1a1c24')
    fig_line.patch.set_facecolor('#1a1c24')
    
    ax_line.plot(labels, values, marker='o', color='#0a84ff', linewidth=2, markersize=8)
    
    ax_line.tick_params(axis='x', colors='white')
    ax_line.tick_params(axis='y', colors='white')
    ax_line.spines['top'].set_visible(False)
    ax_line.spines['right'].set_visible(False)
    ax_line.spines['bottom'].set_color('#30333d')
    ax_line.spines['left'].set_color('#30333d')
    ax_line.grid(color='#30333d', linestyle='--', alpha=0.3)
    
    for i, v in enumerate(values):
        ax_line.text(i, v + (max(values)*0.05 if values else 0), str(v), color='white', ha='center', fontweight='bold')
        
    return fig_line

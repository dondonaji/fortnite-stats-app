import streamlit as st

def render_kpi_card(title, value, subtitle, tooltip, color_class="highlight-blue"):
    """Renders a custom HTML KPI card with tooltip support."""
    st.markdown(f"""
    <div class="metric-card" title="{tooltip}">
        <div class="metric-label">{title}</div>
        <div class="metric-value {color_class}">{value}</div>
        <div class="metric-label" style="font-size: 0.7rem; opacity: 0.8;">{subtitle}</div>
    </div>
    """, unsafe_allow_html=True)

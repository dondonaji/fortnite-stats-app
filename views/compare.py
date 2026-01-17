import streamlit as st
from components.charts import create_radar_chart
from components.metrics import render_kpi_card

def show_compare(client, mode):
    st.markdown("## ⚔️ Modo VS: Comparador de Jugadores")
    
    c1, c2 = st.columns(2)
    with c1:
        p1_name = st.text_input("Jugador 1", placeholder="Epic Username")
    with c2:
        p2_name = st.text_input("Jugador 2", placeholder="Rival Username")
        
    if st.button("¡PELEAR!") and p1_name and p2_name:
        with st.spinner("Analizando combatientes..."):
            r1 = client.get_stats(p1_name)
            r2 = client.get_stats(p2_name)
            
        if r1["status"] == 200 and r2["status"] == 200:
            s1 = r1["data"]["stats"]["all"].get(mode)
            s2 = r2["data"]["stats"]["all"].get(mode)
            
            if s1 and s2:
                # --- HEAD TO HEAD ---
                col_left, col_mid, col_right = st.columns([1, 2, 1])
                
                with col_left:
                    st.markdown(f"<h3 style='text-align: center; color: #bf5af2'>{r1['data']['account']['name']}</h3>", unsafe_allow_html=True)
                    st.metric("K/D", s1.get("kd"))
                    st.metric("WinRate", f"{s1.get('winRate')}%")
                
                with col_mid:
                    st.markdown("### 🆚")
                    st.pyplot(create_radar_chart(s1, player_name=p1_name, compare_stats=s2, compare_name=p2_name))
                
                with col_right:
                    st.markdown(f"<h3 style='text-align: center; color: #0a84ff'>{r2['data']['account']['name']}</h3>", unsafe_allow_html=True)
                    st.metric("K/D", s2.get("kd"))
                    st.metric("WinRate", f"{s2.get('winRate')}%")
                    
            else:
                st.error("Faltan datos en el modo seleccionado para uno de los jugadores.")
        else:
            st.error("Error encontrando a uno de los jugadores.")

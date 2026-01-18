import streamlit as st
from fortnite_client import FortniteClient
from views.dashboard import show_dashboard
from views.lab import show_lab
from views.compare import show_compare

# --- CONFIG ---
st.set_page_config(page_title="Fortnite Stats Pro", layout="wide", page_icon="🎮")

# --- CSS ---
st.markdown("""
<style>
    .stApp { background-color: #0e1117; }
    div.stButton > button { 
        width: 100%; 
        border-radius: 8px; 
        font-weight: bold;
        background-color: #262730;
        border: 1px solid #30333d;
        color: white;
    }
    div.stButton > button:hover {
        border-color: #bf5af2;
        color: #bf5af2;
    }
    /* Cards */
    .player-card {
        background: linear-gradient(135deg, #1a1c24 0%, #13151b 100%);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #30333d;
        margin-bottom: 20px;
    }
    .player-header { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
    .player-avatar {
        width: 60px; height: 60px;
        background: #bf5af2; color: white;
        border-radius: 50%; display: flex;
        align-items: center; justify-content: center;
        font-size: 30px; font-weight: bold;
        box-shadow: 0 0 15px rgba(191, 90, 242, 0.4);
    }
    .time-stats { display: flex; gap: 40px; margin-top: 10px; }
    
    /* Metrics */
    .metric-card {
        background-color: #1a1c24;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #30333d;
        text-align: center;
    }
    .metric-value { font-size: 1.8rem; font-weight: bold; color: white; }
    .metric-label { color: #a0a0a0; font-size: 0.9rem; margin-bottom: 5px; }
    .highlight-green { color: #32d74b !important; border-color: #32d74b !important; }
    .highlight-orange { color: #ff9f0a !important; border-color: #ff9f0a !important; }
    .highlight-blue { color: #0a84ff !important; border-color: #0a84ff !important; }
    .highlight-purple { color: #bf5af2 !important; border-color: #bf5af2 !important; }
</style>
""", unsafe_allow_html=True)

# --- CLIENT ---
client = FortniteClient()
if not client.api_key:
    st.error("❗ API Key no encontrada.")
    st.stop()

# --- SIDEBAR ---
with st.sidebar:
    st.title("🎮 FN Stats Pro")
    nav = st.radio("Navegación", ["Dashboard", "Versus Mode", "Laboratorio"])
    
    st.markdown("---")
    if nav == "Dashboard":
        selected_player = st.text_input("Jugador Epic:", value="Ninja")
        mode_map = {"General": "overall", "Solo": "solo", "Duo": "duo", "Squad": "squad"}
        selected_mode_label = st.selectbox("Modo:", list(mode_map.keys()))
        selected_mode = mode_map[selected_mode_label]
    
# --- ROUTING ---
if nav == "Dashboard":
    if selected_player:
        with st.spinner(f"Cargando perfil de {selected_player}..."):
            result = client.get_stats(selected_player)
            if result["status"] == 200:
                show_dashboard(result["data"], selected_player, selected_mode)
            elif result["status"] == 403:
                st.warning(f"🔒 **Cuenta Privada**: Las estadísticas de **{selected_player}** no son públicas.")
                st.info("💡 **Solución:** En Fortnite, ve a *Ajustes > Cuenta y Privacidad > Privacidad de Jugabilidad* y activa **Mostrar en la tabla de clasificación de carrera**.")
                st.image("https://i.imgur.com/OpF8qj1.png", caption="Cómo activar stats públicas", width=400)
            elif result["status"] == 404:
                st.error(f"❌ No se encontró al jugador **{selected_player}**. Verifica que el nombre sea exacto (Epic ID).")
            else:
                st.error(f"Error {result['status']}: {result.get('error')}")

elif nav == "Versus Mode":
    show_compare(client, "overall") # Default to overall for simplicity

elif nav == "Laboratorio":
    show_lab(client)

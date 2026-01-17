import streamlit as st

def show_lab(client):
    st.markdown("## 🧪 Laboratorio de Información")
    
    tab_shop, tab_news, tab_map = st.tabs(["🛍 Tienda", "📰 Noticias", "🗺 Mapa"])
    
    # --- TAB: SHOP ---
    with tab_shop:
        if st.button("Cargar Tienda Destacada"):
            with st.spinner("Conectando con la API..."):
                res = client.get_shop()
            if res["status"] == 200:
                entries = res["data"].get("featured", {}).get("entries", [])
                st.success(f"Items destacados: {len(entries)}")
                
                cols = st.columns(4)
                for idx, entry in enumerate(entries):
                    with cols[idx % 4]:
                         try:
                            item = entry.get("items", [])[0]
                            st.image(item.get("images", {}).get("smallIcon"), use_container_width=True)
                            st.caption(f"**{item.get('name')}** - {entry.get('finalPrice')} VB")
                         except: pass
    
    # --- TAB: NEWS ---
    with tab_news:
        if st.button("Cargar Noticias"):
            with st.spinner("Leyendo noticias..."):
                res = client.get_news()
            if res["status"] == 200:
                news_items = res["data"].get("motds", [])
                for news in news_items:
                    c_img, c_txt = st.columns([1, 2])
                    with c_img:
                        st.image(news.get("image"), use_container_width=True)
                    with c_txt:
                        st.subheader(news.get("title"))
                        st.write(news.get("body"))
                    st.divider()
    
    # --- TAB: MAP ---
    with tab_map:
        if st.button("Ver Mapa Actual"):
             with st.spinner("Descargando satélite..."):
                res = client.get_map()
             if res["status"] == 200:
                 map_img = res["data"].get("images", {}).get("pois")
                 if map_img:
                     st.image(map_img, caption="Mapa Actual con POIs", use_container_width=True)
                 else:
                     st.warning("Imagen del mapa no disponible.")

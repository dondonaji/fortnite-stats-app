'use client';

import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';

export function NewsFeed() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/news')
            .then(res => res.json())
            .then(data => {
                if (data.data && data.data.motds) {
                    setNews(data.data.motds);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-[#a0a0a0] animate-pulse">Cargando Noticias...</div>;

    return (
        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d] h-full">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-[#bf5af2]"><Newspaper /></span> Novedades
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {news.map((item: any, i) => (
                    <div key={i} className="bg-[#0e1117] rounded-lg overflow-hidden border border-[#30333d] hover:border-[#bf5af2] transition-colors">
                        <div className="h-40 w-full overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            {item.adspace && <div className="absolute top-2 right-2 bg-black/80 px-2 text-[10px] text-white rounded">{item.adspace}</div>}
                        </div>
                        <div className="p-4">
                            <h4 className="text-white font-bold text-base mb-2 leading-tight">{item.title}</h4>
                            <p className="text-[#a0a0a0] text-xs line-clamp-3">{item.body}</p>
                            <div className="text-[#bf5af2] text-[10px] mt-2 font-bold uppercase">{item.tabTitle || 'Noticias'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

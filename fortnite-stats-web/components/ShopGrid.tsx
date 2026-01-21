'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const RARITY_COLORS: Record<string, string> = {
    Common: '#b1b1b1',
    Uncommon: '#60aa3a', // Green
    Rare: '#49acf2', // Blue
    Epic: '#b15be2', // Purple
    Legendary: '#d37841', // Orange/Gold
    Mythic: '#efb33f', // Gold
    Series: '#0dcaf0', // Series (Blue/Cyan)
    Frozen: '#99e5ff',
    Lava: '#ea4f4d',
    Dark: '#e32dca',
};

export function ShopGrid() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/shop')
            .then(res => res.json())
            .then(data => {
                let allItems: any[] = [];
                // Robust parsing: combine featured and daily
                if (data.data) {
                    if (data.data.featured?.entries) allItems = [...allItems, ...data.data.featured.entries];
                    if (data.data.daily?.entries) allItems = [...allItems, ...data.data.daily.entries];
                }
                setItems(allItems);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-[#a0a0a0] animate-pulse">Cargando Tienda...</div>;

    return (
        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d]">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-[#bf5af2]"><ShoppingBag /></span> Tienda Diaria
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((entry: any, i) => {
                    const item = entry.items[0];
                    // Fallback for image
                    const imageUrl = item.images.icon || item.images.smallIcon || entry.newDisplayAsset?.materialInstances?.[0]?.images?.Background || '';
                    // Rarity Color
                    const rarityValue = item.rarity?.value || 'Common';
                    const rarityColor = RARITY_COLORS[rarityValue] || RARITY_COLORS['Common'];

                    return (
                        <div key={i} className="bg-[#0e1117] rounded-lg overflow-hidden border border-[#30333d] hover:border-[#bf5af2] transition-all group relative">
                            {/* Rarity Bar */}
                            <div className="h-1 w-full absolute top-0 z-10" style={{ backgroundColor: rarityColor }}></div>

                            <div className="relative aspect-square bg-[#15171d]">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#30333d]">?</div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-black/70 px-2 py-1 text-white text-xs font-bold flex items-center gap-1">
                                    <img src="https://fortnite-api.com/images/vbuck.png" className="w-3 h-3" alt="vbuck" />
                                    {entry.finalPrice}
                                </div>
                            </div>
                            <div className="p-2 text-center">
                                <div className="text-white font-bold text-sm truncate" style={{ color: rarityColor }}>{item.name}</div>
                                <div className="text-[#a0a0a0] text-[10px] uppercase tracking-wide">{item.type.displayValue}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

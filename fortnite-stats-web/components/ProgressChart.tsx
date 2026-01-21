'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ProgressChartProps {
    history: any[];
}

export function ProgressChart({ history }: ProgressChartProps) {
    if (!history || history.length < 2) {
        return (
            <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d] h-[300px] flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">📉</div>
                <h3 className="text-white font-bold">Sin Datos Históricos</h3>
                <p className="text-[#a0a0a0] text-sm mt-2">
                    Vuelve mañana para ver tu evolución.<br />
                    Necesitamos al menos 2 días de datos.
                </p>
            </div>
        );
    }

    // Format dates
    const data = history.map(item => ({
        ...item,
        date: new Date(item.recorded_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1c24] p-4 rounded-xl border border-[#30333d] h-[350px] flex flex-col"
        >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-[#bf5af2]">📈</span> Evolución de K/D
            </h3>

            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30333d" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: '#a0a0a0', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#a0a0a0', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1c24', borderColor: '#30333d', color: '#fff' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="kd"
                            name="K/D Ratio"
                            stroke="#bf5af2"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#bf5af2' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

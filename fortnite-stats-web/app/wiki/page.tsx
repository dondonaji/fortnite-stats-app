'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Database, Code, Users, Gamepad2 } from 'lucide-react';

export default function WikiPage() {
    return (
        <div className="min-h-screen p-8 max-w-5xl mx-auto text-gray-200">
            <header className="mb-10 border-b border-[#30333d] pb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-[#bf5af2] hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={16} /> Volver a la App
                </Link>
                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                    <Book className="text-[#bf5af2]" /> Wiki Interna: Fortnite Stats Pro
                </h1>
                <p className="text-[#a0a0a0] mt-2 text-lg">
                    Documentación técnica, manual de usuario y arquitectura del proyecto.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <aside className="lg:col-span-1 space-y-4 sticky top-8 h-fit">
                    <div className="font-bold text-white uppercase text-xs tracking-wider mb-2">Índice</div>
                    <nav className="flex flex-col gap-2">
                        <a href="#usuario" className="p-2 hover:bg-[#1a1c24] rounded text-sm hover:text-[#bf5af2] transition-colors">🎮 Manual de Usuario</a>
                        <a href="#arquitectura" className="p-2 hover:bg-[#1a1c24] rounded text-sm hover:text-[#bf5af2] transition-colors">🏗️ Arquitectura</a>
                        <a href="#api" className="p-2 hover:bg-[#1a1c24] rounded text-sm hover:text-[#bf5af2] transition-colors">🔌 API & Datos</a>
                        <a href="#persistencia" className="p-2 hover:bg-[#1a1c24] rounded text-sm hover:text-[#bf5af2] transition-colors">💾 Base de Datos</a>
                    </nav>
                </aside>

                {/* Content */}
                <div className="lg:col-span-3 space-y-12">

                    {/* USER MANUAL */}
                    <section id="usuario" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Gamepad2 className="text-[#32d74b]" /> Manual de Usuario
                        </h2>
                        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d]">
                            <h3 className="text-lg font-bold text-white mb-2">Interpretación de Métricas</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-[#d1d5db]">
                                <li><strong className="text-[#ff9f0a]">K/D Ratio:</strong> Kills / Deaths. Un K/D de 2.0+ es competitivo.</li>
                                <li><strong className="text-[#0a84ff]">Win Rate:</strong> % de victorias. Un 10% es excelente.</li>
                                <li><strong className="text-[#bf5af2]">Score/Min:</strong> Ritmo de juego (XP ganada).</li>
                            </ul>

                            <h3 className="text-lg font-bold text-white mt-6 mb-2">El Radar de Habilidad</h3>
                            <p className="text-sm mb-4">Compara tu estilo contra el promedio global.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="bg-[#0e1117] p-3 rounded border border-[#30333d]">
                                    <div className="font-bold text-[#bf5af2]">⚔️ Combate</div>
                                    <div>Capacidad de duelo (K/D). Meta: 3.0</div>
                                </div>
                                <div className="bg-[#0e1117] p-3 rounded border border-[#30333d]">
                                    <div className="font-bold text-[#32d74b]">🛡️ Supervivencia</div>
                                    <div>Top 10 Rate. Meta: 20%</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ARCHITECTURE */}
                    <section id="arquitectura" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Code className="text-[#ff9f0a]" /> Arquitectura Técnica
                        </h2>
                        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d] space-y-4">
                            <p>El proyecto ha migrado de un prototipo Python (Streamlit) a una Web App moderna.</p>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-[#30333d] pb-2">
                                    <span>Frontend</span>
                                    <span className="font-mono text-[#a0a0a0]">Next.js 14, Tailwind CSS, Framer Motion</span>
                                </div>
                                <div className="flex justify-between border-b border-[#30333d] pb-2">
                                    <span>Backend</span>
                                    <span className="font-mono text-[#a0a0a0]">Next.js API Routes (Serverless)</span>
                                </div>
                                <div className="flex justify-between border-b border-[#30333d] pb-2">
                                    <span>Database</span>
                                    <span className="font-mono text-[#a0a0a0]">Supabase (PostgreSQL)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Mobile</span>
                                    <span className="font-mono text-[#a0a0a0]">iOS Widget (Scriptable JS)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* API & DATA */}
                    <section id="api" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="text-[#0a84ff]" /> Flow de Datos
                        </h2>
                        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d]">
                            <h3 className="text-lg font-bold text-white mb-2">Proxy Seguro</h3>
                            <p className="text-sm mb-4">
                                El cliente nunca llama a Epic Games directamente. Llama a <code>/api/stats</code>.
                                El servidor inyecta la API Key (oculta en <code>.env.local</code>) y retorna JSON limpio.
                            </p>
                            <div className="bg-black p-4 rounded text-xs font-mono text-[#32d74b]">
                                GET /api/stats?name=Ninja<br />
                                ⬇<br />
                                Header: "Authorization: [HIDDEN_KEY]"<br />
                                ⬇<br />
                                Fortnite API v2
                            </div>
                        </div>
                    </section>

                    {/* PERSISTENCE */}
                    <section id="persistencia" className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Database className="text-[#bf5af2]" /> Persistencia (Supabase)
                        </h2>
                        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d]">
                            <p className="mb-4">
                                Implementamos un sistema de <strong>Snapshots Automáticos</strong>.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-[#d1d5db]">
                                <li>Cada vez que se consultan stats, el backend verifica la tabla <code>snapshots</code>.</li>
                                <li>Si el último registro de ese usuario tiene &gt; 24 horas, se guarda uno nuevo.</li>
                                <li>Esto permite construir un historial histórico sin impactar la UX del usuario.</li>
                            </ul>

                            <div className="mt-4 p-4 bg-[#0e1117] rounded border border-[#30333d]">
                                <div className="text-xs font-mono text-[#a0a0a0] mb-1">Schema SQL</div>
                                <pre className="text-xs text-[#bf5af2]">
                                    table snapshots (<br />
                                    &nbsp;&nbsp;id bigint primary key,<br />
                                    &nbsp;&nbsp;player text,<br />
                                    &nbsp;&nbsp;kd numeric,<br />
                                    &nbsp;&nbsp;wins integer,<br />
                                    &nbsp;&nbsp;recorded_at timestamp<br />
                                    );
                                </pre>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            <footer className="mt-20 border-t border-[#30333d] pt-6 text-center text-[#a0a0a0] text-sm">
                Fortnite Stats Pro • Internal Developer Wiki • v1.0
            </footer>
        </div>
    );
}

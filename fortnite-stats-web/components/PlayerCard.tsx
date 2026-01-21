import { User } from 'lucide-react';

interface PlayerCardProps {
    name: string;
    battlePassLevel: number;
    minutesPlayed: number;
    matches: number;
}

export function PlayerCard({ name, battlePassLevel, minutesPlayed, matches }: PlayerCardProps) {
    const hours = Math.floor(minutesPlayed / 60);

    return (
        <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d] flex flex-col md:flex-row items-center gap-6 shadow-lg mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-[#bf5af2] rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_15px_rgba(191,90,242,0.4)]">
                {name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white m-0 p-0">{name}</h1>
                <div className="text-[#bf5af2] font-bold text-sm uppercase tracking-wider">
                    Battle Pass Level {battlePassLevel}
                </div>
            </div>

            {/* Mini Stats */}
            <div className="flex gap-8 mt-4 md:mt-0">
                <div className="text-center">
                    <div className="text-[#a0a0a0] text-xs font-semibold mb-1">HORAS</div>
                    <div className="text-white text-2xl font-bold">{hours.toLocaleString()} h</div>
                </div>
                <div className="text-center">
                    <div className="text-[#a0a0a0] text-xs font-semibold mb-1">PARTIDAS</div>
                    <div className="text-white text-2xl font-bold">{matches.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}

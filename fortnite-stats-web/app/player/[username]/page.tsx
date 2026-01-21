import { Metadata } from 'next';
import { PlayerDashboard } from '@/components/player-dashboard';

type Props = {
    params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const username = decodeURIComponent(params.username);

    return {
        title: `${username} - Stats & K/D`,
        description: `Explora las estadísticas detalladas de Fortnite de ${username}. Victorias, K/D Ratio y análisis de partidas.`,
        openGraph: {
            title: `${username} | Fortnite Stats Pro`,
            description: `Mira el perfil de nivel profesional de ${username} en Fortnite.`,
            type: 'profile',
        },
        twitter: {
            card: "summary_large_image",
            title: `${username} - Fortnite Stats`,
            description: `Mira las estadísticas detalladas de ${username}.`,
        }
    }
}

export default function PlayerPage({ params }: Props) {
    // Decode logic might needed if params come encoded, but usually Next.js handles basic routing.
    // We pass it directly to the dashboard which will use it in the API call.
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative">
            <PlayerDashboard username={params.username} />
        </div>
    );
}

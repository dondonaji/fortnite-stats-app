import { Metadata } from 'next';
import { PlayerDashboard } from '@/components/player-dashboard';
import { Footer } from '@/components/Footer';

type Props = {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    return {
        title: `${decodedUsername} - Stats & K/D`,
        description: `Explora las estadísticas detalladas de Fortnite de ${decodedUsername}. Victorias, K/D Ratio y análisis de partidas.`,
        openGraph: {
            title: `${decodedUsername} | Fortnite Stats Pro`,
            description: `Mira el perfil de nivel profesional de ${decodedUsername} en Fortnite.`,
            type: 'profile',
        },
        twitter: {
            card: "summary_large_image",
            title: `${decodedUsername} - Fortnite Stats`,
            description: `Mira las estadísticas detalladas de ${decodedUsername}.`,
        }
    }
}

export default async function PlayerPage({ params }: Props) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    return (
        <>
            <PlayerDashboard username={decodedUsername} />
            <Footer />
        </>
    );
}

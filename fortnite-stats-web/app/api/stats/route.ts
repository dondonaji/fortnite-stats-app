import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const accountType = searchParams.get('accountType') || 'epic';

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const apiKey = process.env.FORTNITE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Server misconfiguration: API Key missing' }, { status: 500 });
    }

    const url = `https://fortnite-api.com/v2/stats/br/v2?name=${name}&accountType=${accountType}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': apiKey,
            },
        });

        const data = await res.json();

        if (res.ok) {
            // --- PERSISTENCE: Save Snapshot to Supabase ---
            try {
                // Import dynamically or use the global client we created
                const { supabase } = require('@/lib/supabase');

                // Check last record to avoid spamming (Optional optimization)
                const { data: lastRecord } = await supabase
                    .from('snapshots')
                    .select('recorded_at')
                    .eq('player', data.account.name)
                    .order('recorded_at', { ascending: false })
                    .limit(1)
                    .single();

                const shouldSave = !lastRecord || (new Date().getTime() - new Date(lastRecord.recorded_at).getTime()) > 24 * 60 * 60 * 1000;

                if (shouldSave) {
                    await supabase.from('snapshots').insert({
                        player: data.account.name,
                        kd: data.stats.all.overall.kd,
                        win_rate: data.stats.all.overall.winRate,
                        wins: data.stats.all.overall.wins,
                        matches: data.stats.all.overall.matches,
                        level: data.battlePass.level
                    });
                    console.log(`[DB] Saved snapshot for ${data.account.name}`);
                }
            } catch (dbError) {
                console.error('[DB] Failed to save snapshot:', dbError);
                // Continue execution, do not fail request
            }
            // ----------------------------------------------

            // --- FETCH HISTORY FOR CHART ---
            let history = [];
            try {
                const { supabase } = require('@/lib/supabase');
                const { data: snapshots } = await supabase
                    .from('snapshots')
                    .select('recorded_at, kd, win_rate, wins')
                    .eq('player', data.account.name)
                    .order('recorded_at', { ascending: true }) // Oldest first for chart
                    .limit(30); // Last 30 entries
                history = snapshots || [];
            } catch (e) { console.error("History fetch error", e); }

            // Inject history into response
            data.history = history;
            // ------------------------------

            return NextResponse.json(data);
        } else {
            return NextResponse.json({ error: data.error || 'API Error' }, { status: res.status });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

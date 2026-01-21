import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // 1. Try to get current stats
        let { data: stats, error } = await supabase
            .from('site_stats')
            .select('visits')
            .eq('id', 1)
            .single();

        // 2. If row doesn't exist (PGRST116), create it
        if (error && error.code === 'PGRST116') {
            const { data: newStats, error: createError } = await supabase
                .from('site_stats')
                .insert([{ id: 1, visits: 1 }])
                .select()
                .single();

            if (createError) {
                console.error('Error creating stats row:', createError);
                return NextResponse.json({ count: 1 }); // Fallback
            }
            return NextResponse.json({ count: newStats.visits });
        }

        // 3. If other error, log and return fallback
        if (error) {
            console.error('Error fetching stats:', error);
            return NextResponse.json({ count: 0 });
        }

        // 4. Increment
        const newCount = (stats?.visits || 0) + 1;
        const { data: updated, error: updateError } = await supabase
            .from('site_stats')
            .update({ visits: newCount })
            .eq('id', 1)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating stats:', updateError);
            return NextResponse.json({ count: stats?.visits }); // Return old count if update fails
        }

        return NextResponse.json({ count: updated.visits });

    } catch (error) {
        console.error('Visit counter fatal error:', error);
        return NextResponse.json({ count: 0 });
    }
}

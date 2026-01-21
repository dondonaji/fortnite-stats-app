import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('search_logs')
            .insert([{ query: query.trim() }]);

        if (error) {
            console.error('Error logging search:', error);
            // We don't fail the request if logging fails, just log it
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Search log API error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

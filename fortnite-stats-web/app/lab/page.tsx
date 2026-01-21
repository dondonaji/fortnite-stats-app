import { ShopGrid } from '@/components/ShopGrid';
import { NewsFeed } from '@/components/NewsFeed';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LabPage() {
    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="bg-[#1a1c24] p-2 rounded-lg text-white hover:text-[#bf5af2] transition-colors border border-[#30333d]">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white tracking-tight">El <span className="text-[#bf5af2]">Laboratorio</span></h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: News (Smaller) */}
                <div>
                    <NewsFeed />
                </div>

                {/* Column 2 & 3: Shop (Larger) */}
                <div className="lg:col-span-2">
                    <ShopGrid />
                </div>
            </div>
        </div>
    );
}

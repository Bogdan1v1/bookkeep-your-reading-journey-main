import { useState } from 'react';
import { CurrentReadCard } from '@/components/dashboard/CurrentReadCard';
import { YearlyChallengeCard } from '@/components/dashboard/YearlyChallengeCard';
import { QuickStatsCard } from '@/components/dashboard/QuickStatsCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { BookDetailsModal } from '@/components/modals/BookDetailsModal';
import { useBooks } from '@/contexts/BookContext';

export default function Dashboard() {
  const { getBookById } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const selectedBook = selectedBookId ? getBookById(selectedBookId) : null;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your reading journey</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentReadCard onUpdateProgress={setSelectedBookId} />
          <QuickStatsCard />
          <RecentActivityCard />
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <YearlyChallengeCard />
        </div>
      </div>

      <BookDetailsModal
        book={selectedBook || null}
        open={!!selectedBookId}
        onOpenChange={(open) => !open && setSelectedBookId(null)}
      />
    </div>
  );
}

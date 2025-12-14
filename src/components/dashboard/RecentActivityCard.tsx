import { useBooks } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Clock, CheckCircle } from 'lucide-react';

export function RecentActivityCard() {
  const { books } = useBooks();

  const recentFinished = books
    .filter((b) => b.status === 'finished' && b.dateFinished)
    .sort((a, b) => new Date(b.dateFinished!).getTime() - new Date(a.dateFinished!).getTime())
    .slice(0, 3);

  return (
    <Card className="p-6 bg-card shadow-card border-0 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="font-semibold text-lg">Recent Activity</h2>
      </div>

      {recentFinished.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No books finished yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentFinished.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-10 h-14 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                {book.rating && (
                  <div className="mt-1">
                    <StarRating rating={book.rating} size="sm" readonly />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

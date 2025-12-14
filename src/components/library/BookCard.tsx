import { Book } from '@/data/mockBooks';
import { Card } from '@/components/ui/card';
import { GenreBadge } from '@/components/ui/genre-badge';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  view: 'grid' | 'list';
  onClick: () => void;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  reading: { label: 'Reading', class: 'bg-primary text-primary-foreground' },
  'to-read': { label: 'To Read', class: 'bg-muted text-muted-foreground' },
  finished: { label: 'Finished', class: 'bg-secondary text-secondary-foreground' },
  dnf: { label: 'DNF', class: 'bg-destructive/10 text-destructive' },
};

export function BookCard({ book, view, onClick }: BookCardProps) {
  const status = statusLabels[book.status];

  if (view === 'list') {
    return (
      <Card
        onClick={onClick}
        className="p-4 bg-card shadow-card border-0 rounded-xl cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in"
      >
        <div className="flex items-center gap-4">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{book.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <GenreBadge genre={book.genre} size="sm" />
              <span className={cn('text-xs px-2 py-0.5 rounded-full', status.class)}>
                {status.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {book.rating && <StarRating rating={book.rating} size="sm" readonly />}
            <p className="text-xs text-muted-foreground">{book.totalPages} pages</p>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      onClick={onClick}
      className="bg-card shadow-card border-0 rounded-2xl overflow-hidden cursor-pointer hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in group"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={cn('text-xs px-2 py-1 rounded-full font-medium', status.class)}>
            {status.label}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate">{book.title}</h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{book.author}</p>
        <div className="flex items-center justify-between mt-3">
          <GenreBadge genre={book.genre} size="sm" />
          {book.rating && <StarRating rating={book.rating} size="sm" readonly />}
        </div>
      </div>
    </Card>
  );
}

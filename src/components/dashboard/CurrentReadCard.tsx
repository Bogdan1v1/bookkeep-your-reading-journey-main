import { useBooks } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GenreBadge } from '@/components/ui/genre-badge';
import { BookOpen, ChevronRight } from 'lucide-react';

interface CurrentReadCardProps {
  onUpdateProgress: (bookId: string) => void;
}

export function CurrentReadCard({ onUpdateProgress }: CurrentReadCardProps) {
  const { books } = useBooks();
  const currentBook = books.find((b) => b.status === 'reading');

  if (!currentBook) {
    return (
      <Card className="p-6 bg-card shadow-card border-0 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-semibold text-lg">Currently Reading</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No book in progress</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start reading something from your library!
          </p>
        </div>
      </Card>
    );
  }

  const progress = Math.round((currentBook.currentPage / currentBook.totalPages) * 100);

  return (
    <Card className="p-6 bg-card shadow-card border-0 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="font-semibold text-lg">Currently Reading</h2>
      </div>

      <div className="flex gap-4">
        <img
          src={currentBook.coverUrl}
          alt={currentBook.title}
          className="w-20 h-28 object-cover rounded-xl shadow-soft flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{currentBook.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{currentBook.author}</p>
          <div className="mt-2">
            <GenreBadge genre={currentBook.genre} size="sm" />
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Page {currentBook.currentPage} of {currentBook.totalPages}
              </span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onUpdateProgress(currentBook.id)}
        className="w-full mt-4 bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Update Progress
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Card>
  );
}

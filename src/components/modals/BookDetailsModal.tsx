import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBooks } from '@/contexts/BookContext';
import { Book, BookStatus } from '@/data/mockBooks';
import { StarRating } from '@/components/ui/star-rating';
import { GenreBadge } from '@/components/ui/genre-badge';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface BookDetailsModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailsModal({ book, open, onOpenChange }: BookDetailsModalProps) {
  const { updateBook, deleteBook } = useBooks();
  const [currentPage, setCurrentPage] = useState('');
  const [status, setStatus] = useState<BookStatus>('to-read');
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (book) {
      setCurrentPage(book.currentPage.toString());
      setStatus(book.status);
      setRating(book.rating);
      setReview(book.review || '');
    }
  }, [book]);

  if (!book) return null;

  const handleSave = () => {
    const newCurrentPage = parseInt(currentPage) || 0;
    const isFinished = status === 'finished' || newCurrentPage >= book.totalPages;
    
    updateBook(book.id, {
      currentPage: Math.min(newCurrentPage, book.totalPages),
      status: isFinished ? 'finished' : status,
      rating,
      review: review || null,
      dateFinished: isFinished && !book.dateFinished 
        ? new Date().toISOString().split('T')[0] 
        : book.dateFinished,
    });

    toast({
      title: 'Book updated!',
      description: 'Your changes have been saved.',
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    deleteBook(book.id);
    toast({
      title: 'Book removed',
      description: `"${book.title}" has been removed from your library.`,
    });
    onOpenChange(false);
  };

  const progressPercent = Math.round((parseInt(currentPage) / book.totalPages) * 100) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-8">Book Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Book Header */}
          <div className="flex gap-4">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-24 h-36 object-cover rounded-xl shadow-card"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
              <p className="text-muted-foreground mt-1">{book.author}</p>
              <div className="mt-2">
                <GenreBadge genre={book.genre} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {book.totalPages} pages
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label>Reading Progress</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-24"
                max={book.totalPages}
                min={0}
              />
              <span className="text-muted-foreground">/ {book.totalPages} pages</span>
              <span className="text-sm font-medium text-primary ml-auto">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to-read">To Read</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="dnf">Did Not Finish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label>Your Review</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you think of this book?"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gradient-primary">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

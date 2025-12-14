import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBooks } from '@/contexts/BookContext';
import { genres, Genre, BookStatus } from '@/data/mockBooks';
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Book as BookIcon } from 'lucide-react';

interface AddBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Тип для результату від Google
interface GoogleBookResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
    };
    categories?: string[];
  };
}

export function AddBookModal({ open, onOpenChange }: AddBookModalProps) {
  const { addBook } = useBooks();
  
  // Стан для пошуку
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBookResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Стан форми
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    genre: '' as Genre | '',
    status: 'to-read' as BookStatus,
    coverUrl: '',
  });

  // Функція пошуку в Google Books
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5`);
      const data = await response.json();
      if (data.items) {
        setSearchResults(data.items);
      } else {
        setSearchResults([]);
        toast({ title: "Nothing found", description: "Try another keyword." });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to search books.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  // Коли вибрали книгу зі списку
  const selectBook = (book: GoogleBookResult) => {
    const info = book.volumeInfo;
    
    // Спробуємо вгадати жанр (це складно, бо категорії Google відрізняються)
    let guessedGenre: Genre | '' = '';
    if (info.categories) {
      const cat = info.categories[0].toLowerCase();
      if (cat.includes('fiction')) guessedGenre = 'Fiction';
      else if (cat.includes('fantasy')) guessedGenre = 'Fantasy';
      else if (cat.includes('sci')) guessedGenre = 'Sci-Fi';
      else if (cat.includes('history')) guessedGenre = 'History';
      else if (cat.includes('biography')) guessedGenre = 'Biography';
    }

    // Заповнюємо форму автоматично
    setFormData({
      title: info.title || '',
      author: info.authors ? info.authors[0] : '',
      totalPages: info.pageCount?.toString() || '',
      genre: guessedGenre,
      status: 'to-read',
      // Беремо картинку високої якості, якщо є, замінюємо http на https
      coverUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
    });

    setShowResults(false); // Ховаємо список
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.totalPages || !formData.genre) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addBook({
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages),
      currentPage: formData.status === 'finished' ? parseInt(formData.totalPages) : 0,
      genre: formData.genre as Genre,
      status: formData.status,
      rating: null,
      coverUrl: formData.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
      dateFinished: formData.status === 'finished' ? new Date().toISOString().split('T')[0] : null,
      review: null,
    });

    toast({ title: 'Book added!', description: `"${formData.title}" saved to library.` });
    
    // Скидаємо форму
    setFormData({ title: '', author: '', totalPages: '', genre: '', status: 'to-read', coverUrl: '' });
    setSearchQuery('');
    setSearchResults([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Book</DialogTitle>
          <DialogDescription>Search online or enter details manually.</DialogDescription>
        </DialogHeader>

        {/* --- ПОШУК --- */}
        <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-lg border">
          <Label>Autofill from Internet</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Type book title (e.g. Harry Potter)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching} variant="secondary">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* Результати пошуку */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-2 space-y-2 border rounded-md p-2 bg-background max-h-40 overflow-y-auto">
              {searchResults.map((book) => (
                <div 
                  key={book.id} 
                  className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer rounded-md transition-colors"
                  onClick={() => selectBook(book)}
                >
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <img src={book.volumeInfo.imageLinks.thumbnail} alt="cover" className="w-8 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center"><BookIcon className="w-4 h-4 text-gray-400"/></div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{book.volumeInfo.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.volumeInfo.authors?.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- ФОРМА (Заповнюється сама або вручну) --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Total Pages *</Label>
              <Input
                id="pages"
                type="number"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => setFormData({ ...formData, genre: value as Genre })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as BookStatus })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="to-read">To Read</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="dnf">Did Not Finish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover URL</Label>
            <div className="flex gap-2">
               <Input
                id="cover"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://..."
              />
              {formData.coverUrl && (
                <img src={formData.coverUrl} alt="Preview" className="h-10 w-auto rounded border" />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="gradient-primary">Add Book</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
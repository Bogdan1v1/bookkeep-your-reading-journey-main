import { useState, useMemo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from '@/contexts/BookContext';
import { BookCard } from '@/components/library/BookCard';
import { BookDetailsModal } from '@/components/modals/BookDetailsModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, LayoutGrid, List } from 'lucide-react';
import { BookStatus } from '@/data/mockBooks';

type ViewMode = 'grid' | 'list';
type SortOption = 'dateAdded' | 'rating' | 'title' | 'pages';
type StatusFilter = 'all' | BookStatus;

export default function Library() {
  const { books, getBookById, isLoading } = useBooks();
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'pages':
          return b.totalPages - a.totalPages;
        default:
          return 0;
      }
    });

    return result;
  }, [books, statusFilter, search, sortBy]);

  const selectedBook = selectedBookId ? getBookById(selectedBookId) : null;

  const statusCounts = useMemo(() => {
    return {
      all: books.length,
      reading: books.filter((b) => b.status === 'reading').length,
      'to-read': books.filter((b) => b.status === 'to-read').length,
      finished: books.filter((b) => b.status === 'finished').length,
      dnf: books.filter((b) => b.status === 'dnf').length,
    };
  }, [books]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Library</h1>
        <p className="text-muted-foreground mt-1">
          {books.length} books in your collection
        </p>
      </header>

      {/* Filters & Controls */}
      <div className="space-y-4 mb-6">
        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="all" className="data-[state=active]:bg-card">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="reading" className="data-[state=active]:bg-card">
              Reading ({statusCounts.reading})
            </TabsTrigger>
            <TabsTrigger value="to-read" className="data-[state=active]:bg-card">
              To Read ({statusCounts['to-read']})
            </TabsTrigger>
            <TabsTrigger value="finished" className="data-[state=active]:bg-card">
              Finished ({statusCounts.finished})
            </TabsTrigger>
            <TabsTrigger value="dnf" className="data-[state=active]:bg-card">
              DNF ({statusCounts.dnf})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Date Added</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="pages">Page Count</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Book Grid/List */}
      {isLoading ? (
        // 1. СТАН ЗАВАНТАЖЕННЯ (Показуємо скелетони)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Створюємо масив з 10 пустих елементів для імітації списку */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Сірий прямокутник замість обкладинки */}
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <div className="space-y-2">
                {/* Сіра смужка замість назви */}
                <Skeleton className="h-4 w-3/4" />
                {/* Сіра смужка замість автора */}
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedBooks.length === 0 ? (
        // 2. СТАН "ПУСТО" (Якщо не вантажиться і книг немає)
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found</p>
        </div>
      ) : (
        // 3. СТАН З ДАНИМИ (Показуємо книги)
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'space-y-3'
          }
        >
          {filteredAndSortedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              view={view}
              onClick={() => setSelectedBookId(book.id)}
            />
          ))}
        </div>
      )}

      <BookDetailsModal
        book={selectedBook || null}
        open={!!selectedBookId}
        onOpenChange={(open) => !open && setSelectedBookId(null)}
      />
    </div>
  );
}

import { useBooks } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, Book } from 'lucide-react'; // 1. Імпортуємо Book замість Flame

export function QuickStatsCard() {
  const { books } = useBooks();

  // 1. Total pages read (тільки для закінчених книг)
  const totalPagesRead = books
    .filter((b) => b.status === 'finished')
    .reduce((acc, b) => acc + b.totalPages, 0);

  // 2. Average rating
  const ratedBooks = books.filter((b) => b.rating !== null);
  const averageRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((acc, b) => acc + (b.rating || 0), 0) / ratedBooks.length).toFixed(1)
      : '0';

  // 3. Books currently reading (РЕАЛЬНА СТАТИСТИКА)
  const activeBooksCount = books.filter((b) => b.status === 'reading').length;

  const stats = [
    {
      icon: BookOpen,
      label: 'Pages Read',
      value: totalPagesRead.toLocaleString(),
      gradient: 'gradient-primary',
    },
    {
      icon: Book, // Нова іконка
      label: 'Books in Progress', // Нова назва
      value: activeBooksCount, // Реальне значення
      gradient: 'gradient-secondary',
    },
    {
      icon: Star,
      label: 'Avg. Rating',
      value: averageRating,
      gradient: 'bg-rating',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 bg-card shadow-card border-0 rounded-2xl hover:shadow-elevated transition-shadow duration-300"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.gradient} flex items-center justify-center`}>
              <stat.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
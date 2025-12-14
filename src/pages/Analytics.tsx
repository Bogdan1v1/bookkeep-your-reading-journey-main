import { useMemo } from 'react';
import { useBooks } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';

const GENRE_COLORS: Record<string, string> = {
  'Fiction': '#6366f1',
  'Sci-Fi': '#0ea5e9',
  'Fantasy': '#a855f7',
  'Romance': '#ec4899',
  'Mystery': '#f97316',
  'History': '#eab308',
  'Biography': '#22c55e',
  'Self-Help': '#14b8a6',
};

export default function Analytics() {
  const { books } = useBooks();

  // Genre distribution (finished books only)
  const genreData = useMemo(() => {
    const finished = books.filter((b) => b.status === 'finished');
    const genreCounts: Record<string, number> = {};
    
    finished.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    return Object.entries(genreCounts).map(([name, value]) => ({
      name,
      value,
      color: GENRE_COLORS[name] || '#64748b',
    }));
  }, [books]);

  // Monthly reading pace (last 12 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const count = books.filter(
        (b) => b.status === 'finished' && b.dateFinished?.startsWith(yearMonth)
      ).length;
      
      months.push({ name: monthStr, books: count });
    }
    
    return months;
  }, [books]);

  // Rating distribution
  const ratingData = useMemo(() => {
    const ratingCounts = [0, 0, 0, 0, 0];
    
    books
      .filter((b) => b.rating !== null)
      .forEach((book) => {
        if (book.rating) {
          ratingCounts[book.rating - 1]++;
        }
      });

    return [
      { rating: '1 Star', count: ratingCounts[0] },
      { rating: '2 Stars', count: ratingCounts[1] },
      { rating: '3 Stars', count: ratingCounts[2] },
      { rating: '4 Stars', count: ratingCounts[3] },
      { rating: '5 Stars', count: ratingCounts[4] },
    ];
  }, [books]);

  const finishedCount = books.filter((b) => b.status === 'finished').length;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights from your reading journey
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <Card className="p-6 bg-card shadow-card border-0 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <PieChartIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Genre Distribution</h2>
              <p className="text-sm text-muted-foreground">Based on {finishedCount} finished books</p>
            </div>
          </div>

          {genreData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No finished books yet
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Rating Distribution */}
        <Card className="p-6 bg-card shadow-card border-0 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rating flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Rating Spread</h2>
              <p className="text-sm text-muted-foreground">How you rate your reads</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="rating" type="category" width={70} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--rating))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Reading Pace */}
        <Card className="p-6 bg-card shadow-card border-0 rounded-2xl lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Reading Pace</h2>
              <p className="text-sm text-muted-foreground">Books finished per month (last 12 months)</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="books" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

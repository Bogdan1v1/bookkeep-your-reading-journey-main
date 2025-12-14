import { Genre, genreColors } from '@/data/mockBooks';
import { cn } from '@/lib/utils';

interface GenreBadgeProps {
  genre: Genre;
  size?: 'sm' | 'md';
}

export function GenreBadge({ genre, size = 'md' }: GenreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium text-primary-foreground',
        genreColors[genre],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {genre}
    </span>
  );
}

import { useState, useEffect } from 'react';
import { useBooks } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Pencil, Check, X } from 'lucide-react';

export function YearlyChallengeCard() {
  const { books, yearlyGoal, setYearlyGoal } = useBooks();
  
  // Стан для режиму редагування
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(yearlyGoal);

  // Оновлюємо тимчасову ціль, якщо змінилася основна (наприклад, при завантаженні)
  useEffect(() => {
    setTempGoal(yearlyGoal);
  }, [yearlyGoal]);

  const currentYear = new Date().getFullYear();
  
  // Рахуємо тільки завершені книги за цей рік
  const booksThisYear = books.filter(
    (b) => b.status === 'finished' && b.dateFinished?.startsWith(currentYear.toString())
  ).length;

  // Розрахунок прогресу (максимум 100%)
  const progress = yearlyGoal > 0 ? Math.min((booksThisYear / yearlyGoal) * 100, 100) : 0;

  const handleSave = () => {
    if (tempGoal > 0) {
      setYearlyGoal(tempGoal);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempGoal(yearlyGoal);
    setIsEditing(false);
  };

  return (
    <Card className="p-6 bg-card shadow-card border-0 rounded-2xl relative group">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
            <Trophy className="h-5 w-5 text-secondary-foreground" />
          </div>
          <h2 className="font-semibold text-lg">{currentYear} Challenge</h2>
        </div>

        {/* Кнопка редагування (з'являється при наведенні або якщо вже редагуємо) */}
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col items-center py-4">
        <ProgressRing progress={progress} size={140} strokeWidth={10}>
          <div className="text-center flex flex-col items-center justify-center">
            
            {/* Велика цифра (прочитані книги) */}
            <p className="text-3xl font-bold text-foreground">{booksThisYear}</p>
            
            {/* Нижня частина: або текст "of 24", або поле вводу */}
            {isEditing ? (
              <div className="flex items-center gap-1 mt-1 animate-in fade-in zoom-in duration-200">
                <span className="text-sm text-muted-foreground mr-1">of</span>
                <Input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(parseInt(e.target.value) || 0)}
                  className="w-16 h-7 text-center px-1 py-0 h-8"
                  autoFocus
                />
                <div className="flex flex-col gap-1 ml-1">
                  <Button size="icon" variant="ghost" className="h-4 w-4 hover:bg-green-100 hover:text-green-600" onClick={handleSave}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-4 w-4 hover:bg-red-100 hover:text-red-600" onClick={handleCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">of {yearlyGoal}</p>
            )}

          </div>
        </ProgressRing>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          {booksThisYear >= yearlyGoal ? (
            <span className="text-secondary font-medium">🎉 Goal achieved!</span>
          ) : (
            <>
              <span className="font-medium text-foreground">{yearlyGoal - booksThisYear}</span> books to go
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
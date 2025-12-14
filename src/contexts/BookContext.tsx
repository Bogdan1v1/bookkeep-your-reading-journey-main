// 1. Додали useCallback в імпорт
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book, BookStatus } from '@/data/mockBooks';
import { useAuth } from './AuthContext';

interface BookContextType {
  books: Book[];
  isLoading: boolean;
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  yearlyGoal: number;
  setYearlyGoal: (goal: number) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyGoal, setYearlyGoal] = useState(24);
  
  const { token } = useAuth();
  
  // Для Windows краще 127.0.0.1
  const API_URL = 'https://bookkeep-your-reading-journey-main.onrender.com/api/books';

  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentToken}`,
    };
  };

  // 2. Обгорнули fetchBooks у useCallback
  // Тепер ця функція "стабільна" і її можна додавати в useEffect
  const fetchBooks = useCallback(async () => {
    if (!token && !localStorage.getItem('token')) {
      setBooks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const currentToken = token || localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        }
      });
      
      if (res.status === 401) {
        setBooks([]);
        setIsLoading(false);
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]); // fetchBooks залежить від токена

  // 3. Додали fetchBooks у масив залежностей
  useEffect(() => {
    if (token) {
      fetchBooks();
    } else {
      setBooks([]);
      setIsLoading(false);
    }
  }, [token, fetchBooks]);

  const addBook = async (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });
      if (!response.ok) throw new Error('Failed to add book');
      const newBook = await response.json();
      setBooks((prev) => [newBook, ...prev]);
    } catch (error) { console.error(error); alert("Error adding book"); }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
     try {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      await fetch(`${API_URL}/${id}`, { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(updates) });
     } catch(e) { console.error(e); fetchBooks(); }
  };

  const deleteBook = async (id: string) => {
     try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      setBooks((prev) => prev.filter((b) => b.id !== id));
     } catch(e) { console.error(e); }
  };

  const getBookById = (id: string) => books.find((b) => b.id === id);

  return (
    <BookContext.Provider
      value={{
        books,
        isLoading,
        addBook,
        updateBook,
        deleteBook,
        getBookById,
        yearlyGoal,
        setYearlyGoal,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

// 4. Додали коментар, щоб ігнорувати помилку експорту
// eslint-disable-next-line react-refresh/only-export-components
export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) throw new Error('useBooks must be used within a BookProvider');
  return context;
}
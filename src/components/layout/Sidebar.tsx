import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Library, BarChart3, Menu, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserNav } from './UserNav'; // 1. Імпортуємо UserNav
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'My Library' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

interface SidebarProps {
  onAddBook: () => void;
}

export function Sidebar({ onAddBook }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-card shadow-card border border-border"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 2. Прибрав тут 'p-4', щоб UserNav був на всю ширину */}
        <div className="flex flex-col h-full"> 
          
          {/* Верхня частина з відступами (p-4) та flex-1, щоб займати весь вільний простір */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 py-4 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">BookKeep</span>
            </div>

            {/* Add Book Button */}
            <Button
              onClick={() => {
                onAddBook();
                setIsOpen(false);
              }}
              className="mb-6 gradient-primary hover:opacity-90 transition-opacity shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                
                <ModeToggle />
            </div>
          </div>


          {/* 3. Додаємо блок користувача в самий низ (замість старого Footer) */}
          <UserNav />
        </div>
      </aside>
    </>
  );
}
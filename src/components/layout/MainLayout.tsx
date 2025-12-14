import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { AddBookModal } from '@/components/modals/AddBookModal';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onAddBook={() => setIsAddModalOpen(true)} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
      <AddBookModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}

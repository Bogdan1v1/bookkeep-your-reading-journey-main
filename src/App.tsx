import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookProvider } from "@/contexts/BookContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; 
import { ThemeProvider } from "@/contexts/ThemeContext"; // Імпорт теми
import { MainLayout } from "@/components/layout/MainLayout";

// Імпорти сторінок
import Index from "./pages/Index";
import Library from "./pages/Library";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login"; 
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 👇 ВІДКРИВАЄМО ТЕМУ */}
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BookProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                } />

                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
    {/* 👆 ЗАКРИВАЄМО ТЕМУ (цього тегу могло не вистачати) */}
  </QueryClientProvider>
);

export default App;
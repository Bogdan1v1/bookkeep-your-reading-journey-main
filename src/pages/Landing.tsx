import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, ShieldCheck, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";

const heroImages = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop", // Бібліотека
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop", // Книги і кава
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=2000&auto=format&fit=crop", // Читання на природі
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop"  // Відкрита книга
];

export default function Landing() {
    const [currentImage, setCurrentImage] = useState(0);

  // 👇 Таймер, який міняє картинку кожні 5 секунд
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* HEADER / NAVBAR */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">BookKeep</span>
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/login?mode=register">
            <Button className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="py-20 lg:py-32 px-6 text-center max-w-5xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-2">
              Your Personal Reading Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your books, analyze your reading habits, and build your digital library. 
              Simple, private, and beautiful.
            </p>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/login?mode=register">
              <Button size="lg" className="h-12 px-8 text-lg gradient-primary rounded-full shadow-soft hover:scale-105 transition-transform">
                Start Tracking Free
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                Learn More
              </Button>
            </a>
          </div>

          {/* Dynamic Image Slider */}
          <div className="mt-16 relative w-full max-w-5xl mx-auto aspect-video rounded-xl shadow-2xl overflow-hidden border bg-muted/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            
            {/* Overlay для затемнення (щоб виглядало стильніше) */}
            <div className="absolute inset-0 bg-black/20 z-10" />

            {/* Рендеримо всі картинки, але показуємо тільки одну */}
            {heroImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt="Reading atmosphere"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {/* Декоративний елемент поверх картинок (опціонально) */}
            <div className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg text-white max-w-sm hidden md:block">
              <p className="font-medium text-lg">Join thousands of readers</p>
              <p className="text-sm text-white/80">Build your habit one page at a time.</p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen className="h-8 w-8 text-blue-500" />}
              title="Organize Your Library"
              desc="Keep track of books you want to read, are currently reading, or have finished."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-purple-500" />}
              title="Visualize Progress"
              desc="See your reading stats, pages read, and yearly goals in beautiful charts."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
              title="Private & Secure"
              desc="Your data is yours. We use secure authentication to keep your library safe."
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 BookKeep. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <span className="text-sm text-muted-foreground">Made with ❤️ in Ukraine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
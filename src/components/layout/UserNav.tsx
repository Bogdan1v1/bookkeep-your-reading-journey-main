import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";

export function UserNav() {
  const { user, logout } = useAuth();

  // Якщо користувача ще немає (дані вантажаться), нічого не показуємо
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-4 border-t border-border mt-auto bg-sidebar-accent/10">
      {/* Аватарка (поки що просто кружечок з іконкою) */}
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <UserIcon size={18} />
      </div>

      {/* Інформація про юзера */}
      <div className="flex-1 min-w-0 flex flex-col">
        <span className="text-sm font-medium truncate text-foreground">
          {user.username}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {user.email}
        </span>
      </div>

      {/* Кнопка виходу */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={logout} 
        className="text-muted-foreground hover:text-destructive transition-colors"
        title="Logout"
      >
        <LogOut size={18} />
      </Button>
    </div>
  );
}
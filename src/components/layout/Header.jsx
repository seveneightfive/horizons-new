import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    }`;

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }

  const handleProfileClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200 hidden md:block">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 font-oswald uppercase">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">785</span>
          Events + Artists
        </NavLink>
        <div className="flex items-center gap-2 md:gap-4">
            <NavLink to="/artists" className={navLinkClasses}>
                <Users className="w-5 h-5" />
                <span className="hidden md:inline">Artists</span>
            </NavLink>
            <NavLink to="/events" className={navLinkClasses}>
                <Calendar className="w-5 h-5" />
                <span className="hidden md:inline">Events</span>
            </NavLink>
            
            <Separator orientation="vertical" className="h-8 mx-2 hidden md:block" />

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">My Account</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                 <Button onClick={handleProfileClick} variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 bg-slate-200">
                        <AvatarFallback>
                            <LogIn className="h-5 w-5 text-slate-600"/>
                        </AvatarFallback>
                    </Avatar>
                </Button>
            )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
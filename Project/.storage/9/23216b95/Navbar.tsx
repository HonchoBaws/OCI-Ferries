import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Ship, History, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-[#C8102E] mr-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#C8102E] to-[#FFA500] bg-clip-text text-transparent">
              OCI Ferry
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <>
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                  className={currentPage === 'dashboard' ? 'bg-gradient-to-r from-[#C8102E] to-[#FFA500]' : ''}
                >
                  Book Ferry
                </Button>
                <Button
                  variant={currentPage === 'history' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('history')}
                  className={currentPage === 'history' ? 'bg-gradient-to-r from-[#C8102E] to-[#FFA500]' : ''}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </>
            )}

            {isAdmin && (
              <Button
                variant={currentPage === 'admin' ? 'default' : 'ghost'}
                onClick={() => onNavigate('admin')}
                className={currentPage === 'admin' ? 'bg-gradient-to-r from-[#C8102E] to-[#FFA500]' : ''}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
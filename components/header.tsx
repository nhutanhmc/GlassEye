'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import { useApp } from '@/components/providers/app-provider';

export function Header() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const { user, setUser, cartQty } = useApp();

  const openLogin = () => {
    setAuthMode('login');
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="max-w-full mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Bấm vào đây sẽ về trang chủ (/) */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center hover:shadow-lg transition-shadow">
              <span className="text-primary-foreground font-serif font-bold text-lg">A</span>
            </div>
            <span className="font-serif font-bold text-lg hidden sm:inline text-foreground">
              AndreaQuality
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center ml-8">
            <Link href="/products" className="text-foreground text-sm font-medium hover:text-accent transition-colors duration-300 relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#" className="text-foreground text-sm font-medium hover:text-accent transition-colors duration-300 relative group">
              Optical
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#" className="text-foreground text-sm font-medium hover:text-accent transition-colors duration-300 relative group">
              Frames
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#" className="text-foreground text-sm font-medium hover:text-accent transition-colors duration-300 relative group">
              Sale
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/about" className="text-foreground text-sm font-medium hover:text-accent transition-colors duration-300 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button */}
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors hidden sm:inline-flex group">
              <Search className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
            </button>

            {/* Auth Buttons (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-2 border-l border-border/40 pl-4 ml-2">
              {user ? (
                <>
                  <span className="text-sm font-medium text-foreground">
                    Hi, {user.name || user.email}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-sm"
                    onClick={() => setUser(null)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-accent"
                    onClick={openRegister}
                  >
                    Register
                  </Button>
                  <Button
                    className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={openLogin}
                  >
                    Login
                  </Button>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent text-background text-xs rounded-full flex items-center justify-center font-bold text-[10px]">
                {cartQty}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 space-y-1 pb-6">
            <Link href="/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
              Products
            </Link>
            <Link href="#" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
              Optical
            </Link>
            <Link href="#" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
              Frames
            </Link>
            <Link href="#" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
              Sale
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
              About
            </Link>

            {/* Auth (Mobile Menu) */}
            <div className="pt-4 mt-4 border-t border-border/40 px-4">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    Hi, {user.name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setUser(null);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLogin();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full justify-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openRegister();
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </header>
  );
}
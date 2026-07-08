import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import Logo from '../Logo';
import HeaderDesktopNav from './HeaderDesktopNav';
import HeaderMobileMenu from './HeaderMobileMenu';

const Header = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header-shell sticky top-4 z-50 mx-auto w-[95%] max-w-5xl rounded-2xl px-4 py-2 glass-header sm:px-6 sm:py-3 border border-white/60">
      <div className="w-full">
        <nav className="flex items-center justify-between">
          <div className="mr-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo variant="text" size={28} />
            </Link>
          </div>

          <HeaderDesktopNav isAuthenticated={isAuthenticated} user={user ?? undefined} onLogout={handleLogout} />

          <button
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="p-2 text-silver-600 hover:text-silver-900 focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <HeaderMobileMenu
            isAuthenticated={isAuthenticated}
            user={user ?? undefined}
            onLogout={handleLogout}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
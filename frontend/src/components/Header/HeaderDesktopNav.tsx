import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface HeaderDesktopNavProps {
  isAuthenticated: boolean;
  user?: { name?: string; email?: string };
  onLogout: () => void;
}

const navLinkClass = (pathname: string, to: string) =>
  pathname === to
    ? 'rounded-xl px-3.5 py-2 text-sm font-bold bg-forest-500 text-white transition-all lg:px-4'
    : 'rounded-xl px-3.5 py-2 text-sm font-semibold text-silver-500 transition-colors hover:bg-silver-100/50 hover:text-silver-800 lg:px-4';

const HeaderDesktopNav = ({ isAuthenticated, user, onLogout }: HeaderDesktopNavProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });
  const { pathname } = useLocation();

  return (
    <div className="hidden items-center gap-1 md:flex lg:gap-2">
      <Link
        to="/"
        className={navLinkClass(pathname, '/')}
      >
        Home
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            to="/analytics"
            className={navLinkClass(pathname, '/analytics')}
          >
            Analytics
          </Link>
          <Link
            to="/my-urls"
            className={navLinkClass(pathname, '/my-urls')}
          >
            My URLs
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-forest-600/10 bg-forest-500 text-white transition-all duration-200 hover:bg-forest-600 focus:outline-none"
              aria-label="User menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-56 origin-top-right animate-scaleIn rounded-2xl border border-forest-200/70 bg-white py-2 ring-1 ring-forest-500/10">
                <div className="border-b border-forest-100 bg-forest-50/40 px-4 py-3">
                  <p className="text-sm font-semibold text-forest-800">{user?.name}</p>
                  <p className="truncate text-xs text-silver-500">{user?.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="mt-1 flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-apple-600 transition-colors hover:bg-forest-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className={navLinkClass(pathname, '/login')}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={navLinkClass(pathname, '/register')}
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderDesktopNav;
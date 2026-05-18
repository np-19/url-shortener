import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import Logo from '../Logo';
import Button from '../Button';

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`py-2 sm:py-3 px-4 sm:px-6 glass-header sticky top-4 z-50 transition-all duration-300 max-w-5xl mx-auto w-[95%] ${isMobileMenuOpen ? 'rounded-4xl' : 'rounded-full'}`}>
      <div className="w-full">
        <nav className="flex items-center justify-between">
          <div className="mr-4">
            <Link to="/" onClick={closeMobileMenu}>
              <Logo variant="text" size={28} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-3 lg:px-4 py-2 rounded-full hover:bg-beige-100 text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-3 lg:px-4 py-2 rounded-full hover:bg-beige-100 text-sm lg:text-base"
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-3 lg:px-4 py-2 rounded-full hover:bg-beige-100 text-sm lg:text-base"
            >
              Analytics
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-urls"
                  className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-3 lg:px-4 py-2 rounded-full hover:bg-beige-100 text-sm lg:text-base"
                >
                  My URLs
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-forest-500 border border-forest-500/10 text-white hover:bg-forest-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 glass-dropdown rounded-2xl border border-forest-200/70 py-2 z-50 animate-scaleIn origin-top-right ring-1 ring-forest-500/10">
                      <div className="px-4 py-3 border-b border-forest-100 bg-forest-50/40">
                        <p className="text-sm font-semibold text-forest-700">
                          {user?.name}
                        </p>
                        <p className="text-xs text-silver-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-apple-600 hover:bg-forest-50 transition-colors flex items-center gap-2 mt-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
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
                  className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-3 lg:px-4 py-2 rounded-full hover:bg-beige-100 text-sm lg:text-base mr-2"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button className="text-sm px-3 py-1.5 lg:px-4 lg:py-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-silver-600 hover:text-silver-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-silver-200 pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
                onClick={closeMobileMenu}
              >
                Analytics
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-urls"
                    className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
                    onClick={closeMobileMenu}
                  >
                    My URLs
                  </Link>
                  <div className="px-4 py-3 bg-beige-50 border border-silver-200 rounded-xl mt-2">
                    <p className="text-sm font-semibold text-silver-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-silver-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left text-apple-600 hover:text-apple-700 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-apple-50 flex items-center gap-2 mt-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu} className="mt-2 block">
                    <Button className="w-full text-center">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

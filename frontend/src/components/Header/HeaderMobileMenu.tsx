import { Link } from 'react-router-dom';
import Button from '../Button';
import { headerLinks } from './headerLinks';

interface HeaderMobileMenuProps {
  isAuthenticated: boolean;
  user?: { name?: string; email?: string };
  onLogout: () => void;
  onClose: () => void;
}

const HeaderMobileMenu = ({ isAuthenticated, user, onLogout, onClose }: HeaderMobileMenuProps) => {
  return (
    <div className="md:hidden mt-4 border-t border-silver-200 pt-4 overflow-hidden origin-top transform-gpu animate-mobileMenuIn">
      <div className="flex flex-col space-y-2">
        {headerLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}

        {isAuthenticated ? (
          <>
            <Link
              to="/my-urls"
              className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
              onClick={onClose}
            >
              My URLs
            </Link>
            <div className="px-4 py-3 bg-beige-50 border border-silver-200 rounded-xl mt-2">
              <p className="text-sm font-semibold text-silver-800">{user?.name}</p>
              <p className="text-xs text-silver-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-left text-apple-600 hover:text-apple-700 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-apple-50 flex items-center gap-2 mt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-silver-600 hover:text-silver-900 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-beige-100"
              onClick={onClose}
            >
              Login
            </Link>
            <Link to="/register" onClick={onClose} className="mt-2 block">
              <Button className="w-full text-center">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderMobileMenu;
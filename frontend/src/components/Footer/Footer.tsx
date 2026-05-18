import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <footer className="relative overflow-hidden py-8 sm:py-12 bg-beige-100/50 backdrop-blur-md border-t border-silver-200 mt-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="120px" variant="text" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-silver-500">
                  &copy; Copyright 2026. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="h-full">
              <h3 className="mb-4 sm:mb-6 text-xs font-semibold uppercase text-silver-800 tracking-wider">
                Product
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full">
              <h3 className="mb-4 sm:mb-6 text-xs font-semibold uppercase text-silver-800 tracking-wider">
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="h-full">
              <h3 className="mb-4 sm:mb-6 text-xs font-semibold uppercase text-silver-800 tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm sm:text-base font-medium text-silver-500 hover:text-silver-900 transition-colors"
                    to="/"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

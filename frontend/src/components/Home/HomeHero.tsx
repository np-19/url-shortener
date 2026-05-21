import { Link } from 'react-router-dom';
import Button from '../Button';

const HomeHero = () => (
  <div className="w-full md:w-3/5 text-left pt-12 md:pt-0">
    <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-silver-200 text-silver-600 text-sm font-semibold tracking-wide mb-6 shadow-soft">
      Fast & Secure URL Shortening
    </div>
    <h2 className="font-extrabold text-silver-900 mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
      Make your links <br className="hidden md:block" />
      <span className="text-gradient font-black">shorter</span> & smarter
    </h2>
    <p className="text-silver-500 max-w-xl mb-10 text-lg leading-relaxed">
      Transform long URLs into clean, shareable links in seconds. Elevate your brand with premium analytics, lightning-fast redirects, and secure privacy.
    </p>

    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <Link to="/register">
        <Button className="px-8 py-3 text-lg font-bold shadow-md hover:shadow-lg">Get Started for Free</Button>
      </Link>
      <Link to="/login">
        <Button bgColor="bg-white/60 hover:bg-white border border-silver-200" textColor="text-silver-700" className="px-8 py-3 text-lg font-bold backdrop-blur-md">Log In</Button>
      </Link>
    </div>
  </div>
);

export default HomeHero;

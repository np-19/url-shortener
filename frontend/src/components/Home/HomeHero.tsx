import { Link } from 'react-router-dom';
import Button from '../Button';

const HomeHero = () => (
  <div className="w-full max-w-3xl mx-auto text-center pt-8 md:pt-16 flex flex-col items-center">
    <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-silver-200 text-silver-600 text-sm font-semibold tracking-wide mb-6 shadow-sm backdrop-blur-xs select-none">
      ✨ Lightning-Fast & Secure URL Shortening
    </div>
    
    <h2 className="font-extrabold text-silver-900 mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
      Make your links <br className="sm:hidden" />
      <span className="text-gradient font-black bg-gradient-to-r from-forest-500 to-forest-400 bg-clip-text text-transparent">shorter</span> & smarter
    </h2>
    
    <p className="text-silver-500 max-w-2xl mb-8 text-base sm:text-lg leading-relaxed">
      Transform long, cluttered URLs into clean, recognizable, and shareable links in milliseconds. Access robust analytics and secure management out of the box.
    </p>

    <div className="flex flex-row items-center justify-center gap-4 mb-12">
      <Link to="/register">
        <Button className="px-6 py-2.5 text-base font-bold shadow-sm hover:shadow-md transition-shadow">Get Started</Button>
      </Link>
      <Link to="/login">
        <Button bgColor="bg-white/60 hover:bg-white border border-silver-200" textColor="text-silver-700" className="px-6 py-2.5 text-base font-bold backdrop-blur-md">Log In</Button>
      </Link>
    </div>
  </div>
);

export default HomeHero;

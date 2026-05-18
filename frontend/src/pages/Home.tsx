import { useState } from 'react';
import { UrlShortener } from '../components';

const Home = () => {
  const [, setRefreshKey] = useState(0);

  const handleUrlCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between min-h-[75vh] px-4 animate-fadeIn">
      
      {/* Left Column: Typography & Input */}
      <div className="w-full md:w-3/5 text-left pt-12 md:pt-0">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-silver-200 text-silver-600 text-sm font-semibold tracking-wide mb-6 shadow-soft">
          ✨ New Light Theme Design
        </div>
        <h2 className="font-extrabold text-silver-900 mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          Make your links <br className="hidden md:block" />
          <span className="text-gradient font-black">shorter</span> & smarter
        </h2>
        <p className="text-silver-500 max-w-xl mb-10 text-lg leading-relaxed">
          Transform long URLs into clean, shareable links in seconds. Elevate your brand with premium analytics, lightning-fast redirects, and secure privacy.
        </p>
        
        {/* Render UrlShortener inside this column */}
        <div className="w-full max-w-2xl relative z-10">
          <UrlShortener onUrlCreated={handleUrlCreated} />
        </div>
      </div>

      {/* Right Column: Floating Feature Cards (Asymmetrical) */}
      <div className="w-full md:w-2/5 relative h-full min-h-[400px] mt-12 md:mt-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-beige-100 to-white rounded-[3rem] transform rotate-3 shadow-soft -z-10"></div>
        
        <div className="relative flex flex-col gap-6 p-6 sm:p-10 z-10 h-full justify-center">
          
          <div className="glass-panel p-6 rounded-3xl transform hover:-translate-y-2 transition-all duration-300 shadow-soft md:-ml-12 border border-white/50 bg-white/60">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-forest-50 text-forest-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-silver-800 text-lg">Fast & Reliable</h3>
            </div>
            <p className="text-silver-500 text-sm">Create shortened URLs instantly with our high-performance system.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl transform hover:-translate-y-2 transition-all duration-300 shadow-soft md:ml-12 border border-white/50 bg-white/60">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-50 text-blue-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-silver-800 text-lg">Track Analytics</h3>
            </div>
            <p className="text-silver-500 text-sm">Monitor click counts and engagement for all your links.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl transform hover:-translate-y-2 transition-all duration-300 shadow-soft md:-ml-4 border border-white/50 bg-white/60">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-purple-50 text-purple-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-silver-800 text-lg">Secure & Private</h3>
            </div>
            <p className="text-silver-500 text-sm">Your data is safe with automatic link expiration policies.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;

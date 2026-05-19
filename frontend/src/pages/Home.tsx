import { useState } from 'react';
import { UrlShortener } from '../components';

const Home = () => {
  const [, setRefreshKey] = useState(0);

  const featureCards = [
    {
      title: 'Fast & Reliable',
      description: 'Create shortened URLs instantly with our high-performance system.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      accent: 'from-forest-50 to-forest-100 text-forest-500',
      ring: 'ring-forest-500/10',
    },
    {
      title: 'Track Analytics',
      description: 'Monitor click counts and engagement for all your links.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      accent: 'from-forest-50 to-forest-100 text-forest-500',
      ring: 'ring-forest-500/10',
    },
    {
      title: 'Secure & Private',
      description: 'Your data is safe with automatic link expiration policies.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      accent: 'from-forest-50 to-forest-100 text-forest-600',
      ring: 'ring-forest-500/10',
    },
  ];

  const handleUrlCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn">
      
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

      {/* Right Column: Feature Rail */}
      <div className="w-full md:w-2/5 mt-2 md:mt-0 md:pl-4 lg:pl-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 p-4 sm:p-6 shadow-[0_24px_80px_-35px_rgba(17,24,39,0.3)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-silver-300 to-transparent" />
          <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-forest-100/40 blur-3xl" />
          <div className="absolute -left-10 bottom-10 h-32 w-32 rounded-full bg-forest-100/30 blur-3xl" />

          <div className="relative mb-5 sm:mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest-400">Why LinkShort</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-silver-900">Built for clarity and speed</h3>
            </div>
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl border border-silver-200 bg-white text-silver-500 shadow-sm">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.086-1.086m2.828-6.828l1.086-1.086a4 4 0 115.656 5.656l-3 3a4 4 0 01-5.656 0" />
              </svg>
            </div>
          </div>

          <div className="relative space-y-4 sm:space-y-5">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="group glass-panel w-full rounded-3xl border border-white/70 bg-white/75 p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(17,24,39,0.28)]"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${card.accent} ring-1 ${card.ring} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                    {card.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-base sm:text-lg font-bold text-silver-800">{card.title}</h4>
                      <span className="hidden sm:inline-flex h-2.5 w-2.5 rounded-full bg-silver-300 transition-colors group-hover:bg-silver-500" />
                    </div>
                    <p className="mt-2 max-w-md text-sm sm:text-base leading-relaxed text-silver-500">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

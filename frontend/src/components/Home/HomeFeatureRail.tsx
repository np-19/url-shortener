import HomeFeatureCard from './HomeFeatureCard';
import { homeFeatures } from './homeFeatures';

const HomeFeatureRail = () => (
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
        {homeFeatures.map((card) => (
          <HomeFeatureCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  </div>
);

export default HomeFeatureRail;

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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-forest-400">Why Snipr</p>
          <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-silver-900">Built for clarity and speed</h3>
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

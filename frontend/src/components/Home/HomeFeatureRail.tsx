import { homeFeatures } from './homeFeatures';

const HomeFeatureRail = () => (
  <div className="w-full max-w-5xl mx-auto mt-16 px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {homeFeatures.map((feature) => (
        <div 
          key={feature.title} 
          className="group glass-panel rounded-3xl border border-white/70 bg-white/45 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white/60 text-center flex flex-col items-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-50 to-forest-100 text-forest-500 ring-1 ring-forest-500/10 shadow-sm mb-4 transition-transform duration-300 group-hover:scale-105">
            {feature.icon}
          </div>
          <h4 className="text-lg font-bold text-silver-800 mb-2">{feature.title}</h4>
          <p className="text-sm leading-relaxed text-silver-500">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default HomeFeatureRail;

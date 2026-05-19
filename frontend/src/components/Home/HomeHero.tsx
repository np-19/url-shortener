import { UrlShortener } from '..';

interface HomeHeroProps {
  onUrlCreated: () => void;
}

const HomeHero = ({ onUrlCreated }: HomeHeroProps) => (
  <div className="w-full md:w-3/5 text-left pt-12 md:pt-0">
    <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-silver-200 text-silver-600 text-sm font-semibold tracking-wide mb-6 shadow-soft">
      New Light Theme Design
    </div>
    <h2 className="font-extrabold text-silver-900 mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
      Make your links <br className="hidden md:block" />
      <span className="text-gradient font-black">shorter</span> & smarter
    </h2>
    <p className="text-silver-500 max-w-xl mb-10 text-lg leading-relaxed">
      Transform long URLs into clean, shareable links in seconds. Elevate your brand with premium analytics, lightning-fast redirects, and secure privacy.
    </p>

    <div className="w-full max-w-2xl relative z-10">
      <UrlShortener onUrlCreated={onUrlCreated} />
    </div>
  </div>
);

export default HomeHero;

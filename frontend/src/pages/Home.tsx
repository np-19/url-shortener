import { useState } from 'react';
import HomeFeatureRail from '../components/Home/HomeFeatureRail';
import HomeHero from '../components/Home/HomeHero';

const Home = () => {
  const [, setRefreshKey] = useState(0);

  const handleUrlCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn">
      <HomeHero onUrlCreated={handleUrlCreated} />
      <HomeFeatureRail />
    </div>
  );
};

export default Home;

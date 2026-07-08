import { useAppSelector } from '../store/hooks';
import HomeHero from '../components/Home/HomeHero';
import HomeFeatureRail from '../components/Home/HomeFeatureRail';
import UrlShortener from '../components/Url/UrlShortener';
import HomeQuickStats from '../components/Home/HomeQuickStats';

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleUrlCreated = () => {
    // URL created callback
  };

  if (isAuthenticated) {
    return (
      <div className="relative min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn w-full max-w-5xl mx-auto pt-8 md:pt-16">
        {/* Background decorative elements */}
        <div className="absolute top-0 -left-10 h-96 w-96 rounded-full bg-forest-200/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-10 h-96 w-96 rounded-full bg-blue-200/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col pt-4">
          <div className="mb-10 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-silver-900 mb-2 tracking-tight">
              Welcome back, <span className="text-gradient bg-gradient-to-r from-forest-500 to-forest-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>!
            </h2>
            <p className="text-silver-500 text-base sm:text-lg">
              Create a trackable, short URL and monitor its performance in real-time.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-full">
            {/* Shortener area (60%) */}
            <div className="w-full lg:w-[58%]">
              <UrlShortener onUrlCreated={handleUrlCreated} />
            </div>

            {/* Quick stats area (40%) */}
            <div className="w-full lg:w-[38%]">
              <HomeQuickStats />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn w-full max-w-4xl mx-auto pt-8 md:pt-16">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-forest-200/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-blue-200/10 blur-[100px] pointer-events-none" />

      <HomeHero />
      
      <div className="w-full max-w-2xl mx-auto mt-4 z-10">
        <UrlShortener onUrlCreated={handleUrlCreated} />
      </div>

      <HomeFeatureRail />
    </div>
  );
};

export default Home;

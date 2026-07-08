import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useToast } from '../context/ToastContext';
import HomeHero from '../components/Home/HomeHero';
import HomeFeatureRail from '../components/Home/HomeFeatureRail';
import UrlShortener from '../components/Url/UrlShortener';

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    if (searchParams.get('error') === 'url-not-found') {
      toast.error('The link you tried to visit does not exist or has expired.');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  const handleUrlCreated = () => {
    // URL created callback
  };

  if (isAuthenticated) {
    return (
      <div className="relative flex items-center justify-center min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn w-full max-w-4xl mx-auto pt-12 md:pt-20">
        {/* Background decorative elements */}
        <div className="absolute top-0 -left-10 h-96 w-96 rounded-full bg-forest-200/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-10 h-96 w-96 rounded-full bg-blue-200/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col pt-4 items-center">
          <div className="mb-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-silver-900 mb-4 tracking-tight">
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!
            </h2>
            <p className="text-silver-500 max-w-xl text-lg sm:text-xl mx-auto">
              Drop a long link below to instantly create a trackable, short URL and monitor its performance in real-time.
            </p>
          </div>
          
          <div className="w-full max-w-3xl">
            <UrlShortener onUrlCreated={handleUrlCreated} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center justify-between min-h-[75vh] px-4 pb-24 sm:pb-32 animate-fadeIn">
      <HomeHero />
      <HomeFeatureRail />
    </div>
  );
};

export default Home;

import type { ReactNode } from 'react';
import Logo from '../Logo';

interface AuthSplitPageProps {
  heroTitle: ReactNode;
  heroDescription: string;
  heroBadgeTitle: string;
  heroBadgeDescription: string;
  heroBadgeIcon: ReactNode;
  cardTitle: string;
  cardSubtitle: ReactNode;
  children: ReactNode;
  mobileLogoWidth?: string;
}

const AuthSplitPage = ({
  heroTitle,
  heroDescription,
  heroBadgeTitle,
  heroBadgeDescription,
  heroBadgeIcon,
  cardTitle,
  cardSubtitle,
  children,
  mobileLogoWidth = '120px',
}: AuthSplitPageProps) => {
  return (
    <div className="flex min-h-[85vh] flex-col bg-transparent animate-fadeIn lg:flex-row">
      <div className="relative hidden w-1/2 flex-col items-start justify-center p-16 lg:flex">
        <div className="absolute inset-0 -z-10 m-6 rounded-[3rem] bg-linear-to-br from-beige-100 to-white shadow-soft" />
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-block rounded-2xl bg-white p-4 shadow-sm">
            <Logo width="140px" variant="text" />
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-silver-900">{heroTitle}</h1>
          <p className="text-lg font-medium leading-relaxed text-silver-500">{heroDescription}</p>

          <div className="mt-12 flex gap-4">
            <div className="flex items-center gap-4 rounded-2xl border border-silver-100 bg-white/80 p-4 backdrop-blur shadow-sm">
              <div className="rounded-xl bg-forest-50 p-2.5 text-forest-500">{heroBadgeIcon}</div>
              <div>
                <p className="text-sm font-bold text-silver-900">{heroBadgeTitle}</p>
                <p className="text-xs text-silver-500">{heroBadgeDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] backdrop-blur-xl sm:p-10">

          <div className="mb-8 flex justify-center lg:hidden">
            <Logo width={mobileLogoWidth} variant="text" />
          </div>

          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-silver-900 sm:text-3xl">{cardTitle}</h2>
          <div className="text-sm font-medium text-silver-500 sm:text-base">{cardSubtitle}</div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitPage;
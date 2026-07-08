import type { ReactNode } from 'react';
import Logo from '../Logo';

interface AuthCardProps {
  cardTitle: string;
  cardSubtitle: ReactNode;
  children: ReactNode;
}

const AuthCard = ({ cardTitle, cardSubtitle, children }: AuthCardProps) => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center p-4 sm:p-6 animate-fadeIn w-full max-w-md mx-auto">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-forest-200/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-blue-200/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full overflow-hidden rounded-3xl border border-white bg-white/70 p-6 sm:p-8 shadow-soft backdrop-blur-md">
        <div className="mb-6 flex justify-center">
          <Logo width="120px" variant="text" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-silver-900 sm:text-3xl mb-2">{cardTitle}</h2>
          <div className="text-sm font-medium text-silver-500">{cardSubtitle}</div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthCard;

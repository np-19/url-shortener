import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Container from '../components/Container/Container';

const NotFoundPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 md:py-16 text-center animate-fadeIn max-w-xl mx-auto space-y-6">
        {/* Illustration */}
        <div className="w-full max-w-xs flex justify-center items-center mb-4">
          <svg className="w-full h-auto" width="400" height="340" viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <circle cx="200" cy="170" r="140" fill="#f5f5f0" />
            <circle cx="90" cy="100" r="25" fill="#eff6ff" />
            <circle cx="310" cy="240" r="15" fill="#eff6ff" />
            <path d="M70 240 C 90 230, 110 250, 130 240" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
            
            {/* Door Frame */}
            <rect x="230" y="50" width="110" height="240" rx="12" fill="white" stroke="#ebebe4" strokeWidth="4" />
            <line x1="285" y1="50" x2="285" y2="290" stroke="#ebebe4" strokeWidth="2" />
            <circle cx="245" cy="170" r="6" fill="#c9c9bc" />
            
            {/* 404 Sticker on the Door */}
            <g transform="translate(255, 90) rotate(-6)">
              <rect x="0" y="0" width="60" height="40" rx="4" fill="#ebebe4" stroke="#c9c9bc" strokeWidth="2" />
              <line x1="0" y1="12" x2="60" y2="12" stroke="#c9c9bc" strokeWidth="1.5" />
              <circle cx="30" cy="6" r="2" fill="#c9c9bc" />
              <text x="30" y="32" fill="#ef4444" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle">404</text>
            </g>

            {/* Delivery Person Character */}
            {/* Body/Shirt */}
            <path d="M120 200 L180 200 L190 290 L110 290 Z" fill="#eff6ff" stroke="#1e40af" strokeWidth="4" />
            
            {/* Legs */}
            <rect x="125" y="290" width="20" height="25" fill="#dfdfd6" stroke="#c9c9bc" strokeWidth="3" />
            <rect x="155" y="290" width="20" height="25" fill="#dfdfd6" stroke="#c9c9bc" strokeWidth="3" />
            
            {/* Head & Neck */}
            <rect x="142" y="160" width="16" height="40" rx="4" fill="#fca5a5" stroke="#ef4444" strokeWidth="3" />
            <circle cx="150" cy="140" r="28" fill="#fca5a5" stroke="#ef4444" strokeWidth="4" />
            {/* Cap */}
            <path d="M122 135 C122 110, 178 110, 178 135 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="3" />
            <path d="M125 135 L90 145 C85 147, 85 138, 125 135 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="3" />
            
            {/* Face details */}
            <circle cx="130" cy="138" r="2.5" fill="#111827" />
            <path d="M122 152 Q130 148 138 152" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Delivery Boxes in Hand */}
            <g transform="translate(150, 170)">
              {/* Lower Box */}
              <rect x="0" y="30" width="70" height="50" rx="8" fill="#ebebe4" stroke="#c9c9bc" strokeWidth="4" />
              {/* Box tape */}
              <rect x="25" y="30" width="20" height="50" fill="#dfdfd6" />
              {/* Upper Box */}
              <rect x="10" y="0" width="50" height="35" rx="6" fill="#ebebe4" stroke="#c9c9bc" strokeWidth="4" />
              <rect x="28" y="0" width="14" height="35" fill="#dfdfd6" />
              
              {/* Link Icon on lower box */}
              <path d="M25 55 C22 52, 22 47, 25 44 L32 37 C35 34, 40 34, 43 37 C46 40, 46 45, 43 48 L40 51" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
              <path d="M45 55 C48 58, 48 63, 45 66 L38 73 C35 76, 30 76, 27 73 C24 70, 24 65, 27 62 L30 59" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
              <line x1="32" y1="57" x2="38" y2="51" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Arm holding the boxes */}
            <path d="M120 210 Q145 230 150 220" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
            <circle cx="150" cy="220" r="6" fill="#fca5a5" stroke="#ef4444" strokeWidth="3" />
          </svg>
        </div>

        {/* Text information */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-apple-500">
            Error 404 - Page Not Found
          </p>
          <h2 className="text-3xl font-extrabold text-silver-900 tracking-tight leading-tight sm:text-4xl">
            You've got the wrong address.
          </h2>
          <div className="space-y-3 text-silver-500 text-sm sm:text-base leading-relaxed font-medium px-4">
            <p>
              Snipr links are case-sensitive. Please double-check your spelling, or verify that the owner has not deleted or changed the URL path.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link to="/">
            <Button className="px-6 py-3 font-bold shadow-xs">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;

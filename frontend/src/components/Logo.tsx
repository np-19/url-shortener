interface LogoProps {
  width?: string;
  size?: number;
  variant?: 'text' | 'light' | 'icon';
}

const Logo = ({ width = '120px', size = 24, variant = 'text' }: LogoProps) => {
  if (variant === 'icon') {
    return (
      <svg
        className="text-gray-800"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    );
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';

  return (
    <div className="flex items-center gap-2" style={{ width }}>
      <svg
        className={variant === 'light' ? 'text-gray-300' : 'text-gray-800'}
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
      <span className={`text-xl font-bold ${textColor}`}>
        Snipr
      </span>
    </div>
  );
};

export default Logo;

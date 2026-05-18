interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: string;
  textColor?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  children,
  type = 'button',
  bgColor = 'bg-forest-500 hover:bg-forest-600 shadow-soft border border-forest-500/10',
  textColor = 'text-white',
  className = '',
  disabled = false,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex justify-center items-center ${bgColor} ${textColor} ${className} rounded-full py-2 sm:py-2.5 px-6 sm:px-8 transition-all duration-300 font-medium text-sm sm:text-base hover-glow ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

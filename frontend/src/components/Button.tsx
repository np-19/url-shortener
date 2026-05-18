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
  bgColor = 'bg-white hover:bg-beige-50 shadow-soft border border-silver-200',
  textColor = 'text-silver-800',
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

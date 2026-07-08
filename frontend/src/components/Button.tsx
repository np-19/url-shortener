import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string;
  textColor?: string;
}

const Button = ({
  children,
  type = 'button',
  bgColor = 'bg-forest-500 hover:bg-forest-600 shadow-soft border border-forest-500/10',
  textColor = 'text-white',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
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

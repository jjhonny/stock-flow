import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isOutline?: boolean;
  isBlock?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isOutline = false,
  isBlock = false,
  isLoading = false,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const outlineClass = isOutline ? 'btn-outline' : '';
  const blockClass = isBlock ? 'btn-block' : '';
  
  // No daisyUI 4, a classe para loading é .btn-loading
  const loadingClass = isLoading ? 'btn-loading' : '';

  const combinedClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    outlineClass,
    blockClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={combinedClasses} disabled={isLoading || props.disabled} {...props}>
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button; 
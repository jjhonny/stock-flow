import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  bordered = true,
  compact = false,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
}) => {
  const cardClasses = [
    'card',
    'bg-base-100',
    bordered ? 'shadow-md' : '',
    compact ? 'card-compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className={`card-body ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h2 className="card-title">{title}</h2>
              : title
          )}
          {subtitle && (
            typeof subtitle === 'string'
              ? <p className="text-sm opacity-70">{subtitle}</p>
              : subtitle
          )}
        </div>
      )}
      <div className={`card-body py-4 ${contentClassName}`}>{children}</div>
      {footer && (
        <div className={`card-actions justify-end p-4 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 
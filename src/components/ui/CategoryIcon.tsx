import { CATEGORIES } from '../../data/categories';

interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-7 h-7', icon: 'w-3.5 h-3.5' },
  md: { container: 'w-9 h-9', icon: 'w-4 h-4' },
  lg: { container: 'w-11 h-11', icon: 'w-5 h-5' },
};

export default function CategoryIcon({ category, size = 'md', className = '' }: CategoryIconProps) {
  const cat = CATEGORIES[category];
  const { container, icon } = sizeMap[size];

  if (!cat) {
    return (
      <div className={`${container} rounded-xl flex items-center justify-center bg-surface-100 dark:bg-surface-800 ${className}`}>
        <svg className={`${icon} text-surface-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${container} rounded-xl flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: cat.bgColor }}
    >
      <svg
        className={icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke={cat.color}
        strokeWidth={1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
      </svg>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { HeaderProps } from '../../types/ui';
import { cn } from '../../utils/cn';
import Container from '../ui/Container';

const Header: React.FC<HeaderProps> = ({
  className,
  sticky = true,
  transparent = false,
  children
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (sticky) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sticky]);

  return (
    <header
      className={cn(
        'top-0 z-50 w-full transition-all duration-300',
        sticky && 'sticky',
        transparent && !isScrolled 
          ? 'bg-transparent' 
          : 'bg-background/80 backdrop-blur-lg border-b border-border',
        isScrolled && 'shadow-sm',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {children}
        </div>
      </Container>
    </header>
  );
};

Header.displayName = 'Header';

export default Header; 
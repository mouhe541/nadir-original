import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Component has mounted, trigger animation
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50); // Short delay to ensure transition is applied
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-700 ease-out ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition; 
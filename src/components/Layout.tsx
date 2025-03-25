
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white text-black ${className}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

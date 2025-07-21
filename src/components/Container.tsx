import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 w-full ${className}`}>
      {children}
    </div>
  );
}


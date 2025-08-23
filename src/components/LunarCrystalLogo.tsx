import React from 'react';

interface LunarCrystalLogoProps {
  size?: number;
  className?: string;
}

export const LunarCrystalLogo: React.FC<LunarCrystalLogoProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Hexagonal outline */}
        <polygon
          points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5"
          fill="none"
          stroke="url(#hexGradient)"
          strokeWidth="2"
          className="animate-pulse-glow"
        />
        
        {/* Main crystal structure */}
        <g transform="translate(50,50)">
          {/* Central crystal */}
          <polygon
            points="0,-30 12,-15 8,15 -8,15 -12,-15"
            fill="url(#crystalGradient)"
            className="opacity-90"
          />
          
          {/* Left crystal shard */}
          <polygon
            points="-12,-15 -25,-5 -20,10 -8,15"
            fill="url(#crystalGradient2)"
            className="opacity-80"
          />
          
          {/* Right crystal shard */}
          <polygon
            points="12,-15 25,-5 20,10 8,15"
            fill="url(#crystalGradient3)"
            className="opacity-80"
          />
          
          {/* Back crystals */}
          <polygon
            points="-8,-25 0,-30 8,-25 4,-10 -4,-10"
            fill="url(#crystalGradient4)"
            className="opacity-70"
          />
        </g>
        
        {/* Sparkle effects */}
        <circle cx="25" cy="25" r="1" fill="hsl(var(--primary))" className="animate-pulse">
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="35" r="1" fill="hsl(var(--primary))" className="animate-pulse">
          <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="80" r="1" fill="hsl(var(--primary))" className="animate-pulse">
          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </linearGradient>
          
          <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="30%" stopColor="hsl(var(--foreground))" stopOpacity="0.8" />
            <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="crystalGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="50%" stopColor="hsl(var(--foreground))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
          </linearGradient>
          
          <linearGradient id="crystalGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="crystalGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
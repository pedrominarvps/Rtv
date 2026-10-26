import React from 'react';

interface RukaTvLogoProps {
  className?: string;
  showPlus?: boolean;
  useColorBadge?: boolean;
}

export const RukaTvLogo: React.FC<RukaTvLogoProps> = ({ 
  className = "h-6 w-auto", 
  showPlus = true,
  useColorBadge = false
}) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none group">
      {useColorBadge ? (
        /* Authentic Ruka Glowing Squircle Badge + Apple TV Typography */
        <div className="relative flex items-center justify-center">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 shadow-md group-hover:border-purple-400/50 transition-all bg-black/60 backdrop-blur-md">
            <img 
              src="/ruka-icon.png" 
              alt="RukaTV" 
              className="w-full h-full object-cover scale-125" 
            />
          </div>
        </div>
      ) : (
        /* Pure Apple-Style Vector Emblem: Ruka "R" with Orbital Arc */
        <svg 
          viewBox="0 0 46 46" 
          className="h-6 w-6 text-white group-hover:text-white transition-colors drop-shadow-[0_0_12px_rgba(168,85,247,0.35)]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Ruka Logo"
        >
          {/* Outer subtle Apple-style ambient squircle path */}
          <rect width="46" height="46" rx="10" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.16" strokeWidth="1" />
          
          {/* Ruka Stylized R Ribbon */}
          <path 
            d="M 12 36 L 12 15 C 12 11.5 14.8 9.5 19 9.5 C 24.5 9.5 32 10.2 32 18 C 32 23.2 27.5 25.5 22.5 26 L 33 36 L 27 36 L 18 26.5 L 17 26.5 L 17 36 Z M 17 14 L 17 22.5 C 19.5 22.5 26.5 22.5 26.5 18 C 26.5 14 20.5 14 17 14 Z" 
            fill="currentColor"
            fillRule="evenodd"
          />

          {/* Ruka Orbital Cosmic Ring Swoosh */}
          <path 
            d="M 8 28.5 C 13 25.5 21 21.5 37 13.5 C 34.5 16 26.5 22.5 11 31 C 9.5 30.2 8.5 29.3 8 28.5 Z" 
            fill="url(#ruka-orbit-grad)"
          />

          {/* Orbital glowing beam highlight */}
          <path 
            d="M 10 29.5 Q 23 23 36 14" 
            stroke="#ffffff" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeOpacity="0.95" 
          />

          <defs>
            <linearGradient id="ruka-orbit-grad" x1="8" y1="30" x2="38" y2="13" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="0.5" stopColor="#ffffff" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Official Apple TV Typographic Wordmark "tv" */}
      <div className="flex items-center">
        <svg 
          viewBox="40 0 60 50" 
          className={className} 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#FFFFFF">
            {/* Letter 't' from Apple TV */}
            <path d="M48.9508841,5.82581047 L48.9508841,14.0733791 L43.8660242,14.0733791 L43.8660242,20.2866584 L48.9508841,20.2866584 L48.9508841,39.4798005 C48.9508841,46.3612219 51.8270759,49.1681421 58.8783164,49.1681421 C60.3747847,49.1681421 62.0230026,49.0426434 62.8864529,48.8629052 L63.1931968,48.7990648 L63.1931968,42.5655237 L62.7531729,42.628616 C62.3005447,42.6935162 61.1257331,42.7897756 60.4302557,42.7897756 C57.737948,42.7897756 56.5892808,41.5926434 56.5892808,38.7869701 L56.5892808,20.2866584 L63.2261425,20.2866584 L63.2261425,14.0733791 L56.5892808,14.0733791 L56.5892808,5.82581047 L48.9508841,5.82581047 Z" fillRule="nonzero" />
            {/* Letter 'v' from Apple TV */}
            <polygon points="91.4470155 14.0733167 83.2085465 40.6889027 74.9700775 14.0733167 66.9086913 14.0733167 79.2397201 48.9543017 87.0725459 48.9543017 99.3764944 14.0733167" fillRule="nonzero" />
          </g>
        </svg>

        {/* Superscript '+' in Apple San Francisco typography */}
        {showPlus && (
          <span className="text-xl font-light text-white tracking-tight -ml-0.5 leading-none font-sans">
            +
          </span>
        )}
      </div>
    </div>
  );
};

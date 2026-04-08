import React, { useId } from 'react';
import './BrandLogo.css';

/**
 * Brand mark: layered pages + light spark (document intelligence motif).
 */
export function BrandLogo({ className = '', size = 'medium' }) {
  const reactId = useId().replace(/[^\w-]/g, '');
  const gradId = `logo-grad-${reactId}`;

  return (
    <div className={`brand-logo brand-logo--${size} ${className}`.trim()}>
      <svg
        className="brand-logo__mark"
        viewBox="0 0 40 40"
        width="40"
        height="40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lumina Docs logo"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d9b8c" />
            <stop offset="100%" stopColor="#4a8ec4" />
          </linearGradient>
        </defs>
        <rect
          className="brand-logo__sheet-back"
          x="6"
          y="4"
          width="22"
          height="28"
          rx="3"
          fill={`url(#${gradId})`}
          opacity="0.92"
        />
        <rect
          className="brand-logo__sheet-front"
          x="12"
          y="8"
          width="22"
          height="28"
          rx="3"
          fill="#f8fefb"
          stroke="#8fd4c4"
          strokeWidth="1.2"
        />
        <path
          className="brand-logo__lines"
          d="M16 16h14M16 21h10M16 26h12"
          stroke="#2d8f7c"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle className="brand-logo__accent" cx="30" cy="12" r="5" fill="#6ecff5" opacity="0.95" />
        <path
          d="M28 12l1.5 1.5L33 9"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="brand-logo__text">
        <span className="brand-logo__name">Lumina Docs</span>
        <span className="brand-logo__tag">Intelligence</span>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import './SiteHeader.css';

const SCROLL_THRESHOLD = 40;

/**
 * Sticky ribbon header: light pastel bar at top, shifts to a deeper teal when scrolled.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a href="#top" className="site-header__brand">
          <BrandLogo size="small" />
        </a>
        <nav className="site-header__nav" aria-label="Primary">
          <a href="#upload">Upload</a>
          <a href="#library">Library</a>
          <a href="#ask">Ask</a>
        </nav>
      </div>
    </header>
  );
}

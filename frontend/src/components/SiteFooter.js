import React from 'react';
import { BrandLogo } from './BrandLogo';
import './SiteFooter.css';

/**
 * Site closing band with brand repeat and light legal line.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <BrandLogo size="small" />
        <p className="site-footer__copy">
          Lumina Docs · Prototype workspace for document upload and retrieval-augmented Q&amp;A. Connect your model server for
          live answers.
        </p>
      </div>
    </footer>
  );
}

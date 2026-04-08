import React from 'react';
import './HeroSection.css';

/**
 * Hero with value proposition and soft illustration background.
 */
export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__eyebrow">Document intelligence workspace</p>
        <h1 id="hero-title" className="hero__title">
          Turn long PDFs into answers you can trust
        </h1>
        <p className="hero__subtitle">
          Lumina Docs helps you upload important files, keep them organized, and ask natural-language questions.
          Retrieval-augmented answers ground responses in your own pages—ideal for reports, policies, and research.
        </p>
        <div className="hero__badges" role="list">
          <span className="hero__badge" role="listitem">Upload &amp; catalog</span>
          <span className="hero__badge hero__badge--mint" role="listitem">Semantic Q&amp;A</span>
          <span className="hero__badge hero__badge--sea" role="listitem">Source-aware replies</span>
        </div>
      </div>
    </section>
  );
}

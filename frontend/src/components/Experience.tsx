import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

/** Progressive motion: content stays readable if animation APIs are unavailable. */
export function Experience() {
  const { pathname } = useLocation();
  const progress = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
      document.documentElement.classList.toggle('has-scrolled', window.scrollY > 24);
      setShowTop(window.scrollY > 650);
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-scrolled');
    };
  }, [pathname]);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    const stop = () => {
      observer?.disconnect();
      mutations?.disconnect();
      active.forEach(animation => animation.cancel());
      active.clear();
    };
    const start = () => {
      stop();
      if (preference.matches || !('IntersectionObserver' in window)) return;
      const seen = new WeakSet<Element>();
      const main = document.querySelector('main');
      if (!main) return;
      // Keep operational workspaces immediate; movement belongs to the public experience.
      if (/^\/(admin|student|instructor)/.test(pathname)) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.unobserve(entry.target);
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const delay = Math.min(siblings.indexOf(entry.target), 3) * 65;
          const animation = entry.target.animate([
            { opacity: 0, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 650, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
          active.add(animation);
          animation.onfinish = () => { animation.cancel(); active.delete(animation); };
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      const discover = () => {
        main.querySelectorAll('.section-heading, .trust-strip > div, .program-feature, .path-card, .about-image, .about-copy, .step, .info-card, .empty-schedule, .faq-layout > div, .cta .wrap > div, .application-steps, .form-card, .rounded-image').forEach(element => {
          if (seen.has(element)) return;
          seen.add(element);
          observer?.observe(element);
        });
      };
      discover();
      mutations = new MutationObserver(discover);
      mutations.observe(main, { childList: true, subtree: true });
    };
    start();
    preference.addEventListener('change', start);
    return () => { stop(); preference.removeEventListener('change', start); };
  }, [pathname]);

  return <>
    <div className="reading-progress" aria-hidden="true"><div ref={progress}/></div>
    <button className={`back-to-top ${showTop ? 'is-visible' : ''}`} aria-label="Back to top" tabIndex={showTop ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
      <ChevronUp size={20}/>
    </button>
  </>;
}

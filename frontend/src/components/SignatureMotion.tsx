import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import './signature-motion.css';

export function HeartbeatSignature(){return <div className="heartbeat-signature" aria-hidden="true">
  <svg viewBox="0 0 420 38" fill="none"><path className="heartbeat-track" d="M0 22H78L88 16L98 27L111 5L124 34L137 16L146 22H266L277 16L287 27L300 5L313 34L326 16L335 22H420"/><path pathLength="1" className="heartbeat-ink" d="M0 22H78L88 16L98 27L111 5L124 34L137 16L146 22H266L277 16L287 27L300 5L313 34L326 16L335 22H420"/></svg>
  <span className="heartbeat-label">A LITTLE COMPASSION. A LASTING IMPACT.</span>
</div>}

/** Signature interactions stay on public content and never intercept clicks or scrolling. */
export function SignatureMotion(){
  const {pathname}=useLocation();
  useEffect(()=>{
    if(pathname!=='/')return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
    const steps=document.querySelector<HTMLElement>('.steps');
    const cards=Array.from(document.querySelectorAll<HTMLElement>('.program-feature, .path-card'));
    let frame=0;
    let pointerFrame=0;
    const update=()=>{
      frame=0;
      if(!steps)return;
      const rect=steps.getBoundingClientRect();
      const progress=preference.matches?1:Math.max(0,Math.min(1,(window.innerHeight*.78-rect.top)/Math.max(rect.height*.9,160)));
      steps.style.setProperty('--journey-progress',String(progress));
      steps.querySelectorAll('.step').forEach((step,i)=>step.classList.toggle('journey-reached',progress>=i/4));
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const move=(event:PointerEvent)=>{
      if(preference.matches||!finePointer.matches)return;
      const card=event.currentTarget as HTMLElement;
      const x=event.clientX,y=event.clientY;
      cancelAnimationFrame(pointerFrame);
      pointerFrame=requestAnimationFrame(()=>{
        const rect=card.getBoundingClientRect();
        card.style.setProperty('--light-x',`${x-rect.left}px`);
        card.style.setProperty('--light-y',`${y-rect.top}px`);
      });
    };
    // SVG uses CSS coordinates, so it adapts without re-measuring each icon.
    const horizontal=document.createElementNS('http://www.w3.org/2000/svg','svg');
    horizontal.setAttribute('viewBox','0 0 1000 60');
    horizontal.setAttribute('preserveAspectRatio','none');
    horizontal.setAttribute('aria-hidden','true');
    horizontal.classList.add('journey-wire','journey-wire-horizontal');
    horizontal.innerHTML='<path class="journey-wire-base" d="M0 30 C70 30 55 50 125 50 S180 30 250 30 S305 10 375 10 S430 30 500 30 S555 50 625 50 S680 30 750 30 S805 10 875 10 S930 30 1000 30"/><path class="journey-wire-ink" pathLength="1" d="M0 30 C70 30 55 50 125 50 S180 30 250 30 S305 10 375 10 S430 30 500 30 S555 50 625 50 S680 30 750 30 S805 10 875 10 S930 30 1000 30"/>';
    const vertical=document.createElementNS('http://www.w3.org/2000/svg','svg');
    vertical.setAttribute('viewBox','0 0 60 1000');
    vertical.setAttribute('preserveAspectRatio','none');
    vertical.setAttribute('aria-hidden','true');
    vertical.classList.add('journey-wire','journey-wire-vertical');
    vertical.innerHTML='<path class="journey-wire-base" d="M30 0 C30 70 10 55 10 125 S30 180 30 250 S50 305 50 375 S30 430 30 500 S10 555 10 625 S30 680 30 750 S50 805 50 875 S30 930 30 1000"/><path class="journey-wire-ink" pathLength="1" d="M30 0 C30 70 10 55 10 125 S30 180 30 250 S50 305 50 375 S30 430 30 500 S10 555 10 625 S30 680 30 750 S50 805 50 875 S30 930 30 1000"/>';
    if(steps){steps.prepend(horizontal,vertical);steps.classList.add('has-journey-wire')}
    cards.forEach(card=>card.addEventListener('pointermove',move));
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    preference.addEventListener('change',schedule);
    update();
    return()=>{
      cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);
      window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
      preference.removeEventListener('change',schedule);
      cards.forEach(card=>card.removeEventListener('pointermove',move));
      horizontal.remove();vertical.remove();steps?.classList.remove('has-journey-wire');
      steps?.querySelectorAll('.step').forEach(step=>step.classList.remove('journey-reached'));
    };
  },[pathname]);
  return null;
}

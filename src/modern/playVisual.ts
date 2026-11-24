import gsap from 'gsap';

// Plays a tile's own animation once it has been placed.
export function playVisual(tile: HTMLElement) {
  const viz = tile.querySelector<HTMLElement>('[data-visual]');
  if (!viz) return;
  const q = gsap.utils.selector(viz);
  switch (viz.dataset.visual) {
    case 'nova':
      gsap
        .timeline()
        .from(q('.nova-input'), { x: -12, autoAlpha: 0, duration: 0.4 })
        .from(q('.nova-arrow'), { autoAlpha: 0, x: -6, duration: 0.3 })
        .from(q('.nova-outline li'), { autoAlpha: 0, y: 10, stagger: 0.18, duration: 0.35 })
        .from(q('.nova-check'), { scale: 0, stagger: 0.18, duration: 0.3, ease: 'back.out(3)' }, '<0.15')
        .from(q('.nova-kinds i'), { autoAlpha: 0, scale: 0.6, stagger: 0.05, duration: 0.25, ease: 'back.out(2)' }, '-=0.4');
      break;
    case 'editor': {
      const typed = q('.ed-typed')[0];
      const text = typed?.textContent ?? '';
      if (typed) typed.textContent = '';
      const state = { n: 0 };
      gsap
        .timeline()
        .from(q('.ed-ai'), { scale: 0.7, autoAlpha: 0, duration: 0.3, ease: 'back.out(3)' })
        .from(q('.ed-pop'), { y: 8, autoAlpha: 0, duration: 0.35 }, '+=0.1')
        .to(state, {
          n: text.length,
          duration: 2,
          ease: 'none',
          onUpdate: () => {
            if (typed) typed.textContent = text.slice(0, Math.round(state.n));
          },
        });
      break;
    }
    case 'hub':
      gsap
        .timeline()
        .from(q('.hub-core'), { scale: 0.6, transformOrigin: '50% 50%', autoAlpha: 0, duration: 0.4, ease: 'back.out(2)' })
        .from(q('.hub-wire'), { autoAlpha: 0, stagger: 0.1, duration: 0.4 })
        .from(q('.hub-node'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.35, ease: 'back.out(2)' }, '<0.1')
        .add(() => viz.classList.add('flowing'));
      break;
    case 'chart':
      gsap.from(q('.bar'), { scaleX: 0, transformOrigin: 'left center', stagger: 0.15, duration: 0.8, ease: 'power3.out' });
      break;
    case 'pipe':
      gsap
        .timeline()
        .from(q('.stage'), { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.3 })
        .set(q('.stage.flaky .ok'), { autoAlpha: 0 }, 0)
        .fromTo(q('.stage.flaky .bad'), { autoAlpha: 1 }, { autoAlpha: 0, scale: 0.4, stagger: 0.25, duration: 0.25 }, '+=0.6')
        .fromTo(q('.stage.flaky .ok'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, stagger: 0.25, duration: 0.3, ease: 'back.out(3)' }, '<0.1')
        .from(q('.pipe-comment'), { autoAlpha: 0, y: 10, duration: 0.4 });
      break;
    case 'term':
      gsap.from(q('.term-line'), { autoAlpha: 0, x: -6, stagger: 0.35, duration: 0.25 });
      break;
  }
}

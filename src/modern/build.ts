import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// "Cursor crew": named cursors fly in and assemble each section as it scrolls
// into view, the way collaborators build a frame in a design tool.
//
// Markup contract:
//   [data-build-section]           a section the crew builds when it enters
//   [data-build="Label"]           a piece inside it; Label shows on the selection box
// Called inside gsap.matchMedia for no-preference motion only, so with reduced
// motion everything is simply visible.

const CREW = [
  { name: 'Bryan', color: 'var(--crew-1)' },
  { name: 'Claude', color: 'var(--crew-2)' },
  { name: 'Gemini', color: 'var(--crew-3)' },
];

const ARROW =
  '<svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M1.5 1.5 L16 10.2 L9.2 11.6 L6 18.5 Z" fill="currentColor" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>';

export type OnBuilt = (el: HTMLElement) => void;

export function setupCursorCrew(root: HTMLElement, onBuilt: OnBuilt) {
  const layer = document.createElement('div');
  layer.className = 'crew-layer';
  layer.setAttribute('aria-hidden', 'true');
  root.appendChild(layer);

  const cursors = CREW.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'crew-cursor';
    el.style.color = c.color;
    el.innerHTML = `${ARROW}<span style="background:${c.color}">${c.name}</span>`;
    layer.appendChild(el);
    gsap.set(el, { x: root.clientWidth * (0.3 + i * 0.2), y: -60, autoAlpha: 0 });
    return { ...c, el };
  });

  const rel = (el: Element) => {
    const r = el.getBoundingClientRect();
    const base = root.getBoundingClientRect();
    return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
  };

  const triggers: ScrollTrigger[] = [];
  let turn = 0;

  root.querySelectorAll<HTMLElement>('[data-build-section]').forEach((section) => {
    const targets = Array.from(section.querySelectorAll<HTMLElement>('[data-build]'));
    if (!targets.length) return;
    gsap.set(targets, { autoAlpha: 0, y: 18 });

    const play = () => {
      const tl = gsap.timeline();
      const used = new Set<(typeof cursors)[number]>();
      targets.forEach((target, i) => {
        const crew = cursors[turn++ % cursors.length];
        used.add(crew);
        const at = i * 0.22;
        const box = document.createElement('div');
        box.className = 'crew-box';
        box.style.setProperty('--c', crew.color);
        box.innerHTML = `<span>${target.dataset.build}</span>`;
        tl.call(
          () => {
            const p = rel(target);
            layer.appendChild(box);
            gsap.set(box, { x: p.x - 4, y: p.y - 4 + 18, width: p.w + 8, height: p.h + 8, autoAlpha: 0 });
            gsap
              .timeline()
              .to(crew.el, { autoAlpha: 1, x: p.x + Math.min(40, p.w * 0.2), y: p.y + Math.min(30, p.h * 0.4), duration: 0.45, ease: 'power2.inOut' })
              .to(box, { autoAlpha: 1, duration: 0.12 }, '-=0.1')
              .to([target, box], { y: '-=18', duration: 0.55, ease: 'power3.out' }, '<')
              .to(target, { autoAlpha: 1, duration: 0.4, onComplete: () => onBuilt(target) }, '<')
              .to(crew.el, { x: p.x + p.w * 0.8, y: p.y + p.h * 0.8, duration: 0.5, ease: 'sine.inOut' }, '<')
              .to(box, { autoAlpha: 0, duration: 0.35, onComplete: () => box.remove() }, '+=0.15');
          },
          undefined,
          at,
        );
      });
      // When the section is done, the crew drifts off.
      tl.call(
        () => {
          Array.from(used).forEach((c, i) =>
            gsap.to(c.el, { autoAlpha: 0, x: `+=${40 + i * 20}`, y: `+=${30 - i * 25}`, duration: 0.6, delay: 0.2 + i * 0.1 }),
          );
        },
        undefined,
        targets.length * 0.22 + 1.2,
      );
    };

    triggers.push(ScrollTrigger.create({ trigger: section, start: 'top 78%', once: true, onEnter: play }));
  });

  return () => {
    triggers.forEach((t) => t.kill());
    layer.remove();
  };
}

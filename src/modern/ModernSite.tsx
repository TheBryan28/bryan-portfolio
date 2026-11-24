import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, MessageSquareText, Monitor, Moon, Sun } from 'lucide-react';
import { Flag } from '../ui/Flag';
import { useTheme } from '../hooks/useTheme';
import { useLang } from '../i18n/LanguageContext';
import { AskPanel } from './AskPanel';
import { GoogleCloudIcon } from '../ui/GoogleCloudIcon';
import { setupCursorCrew } from './build';
import { ChartVisual, EditorVisual, HubVisual, NovaVisual, PipelineVisual, ProjectArt, TerminalVisual } from './visuals';
import { playVisual } from './playVisual';
import portrait from '../assets/profile.webp';
import './modern.css';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

const WORK = [
  { id: 'nova', size: 'wide', Visual: NovaVisual },
  { id: 'editor', size: '', Visual: EditorVisual },
  { id: 'hub', size: '', Visual: HubVisual },
  { id: 'chart', size: '', Visual: ChartVisual },
  { id: 'pipe', size: '', Visual: PipelineVisual },
  { id: 'term', size: 'wide', Visual: TerminalVisual },
] as const;

// Side projects shown in the modern view, by position in profile.projects.
const PROJECT_ART: Record<number, 'wallet' | 'services' | 'flow'> = { 0: 'wallet', 2: 'services', 3: 'flow' };

function CopyEmail({ className = 'btn ghost' }: { className?: string }) {
  const { t, profile } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? t.hero.copied : t.hero.copy}
    </button>
  );
}

// The rotating word under the tagline. Remounted per language so GSAP and
// React never fight over the same text node.
function FocusWord({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cycle = gsap.timeline({ repeat: -1, delay: 2.4 });
        words
          .slice(1)
          .concat(words[0])
          .forEach((w) => {
            cycle.to(ref.current, { duration: 0.9, scrambleText: { text: w, chars: 'lowerCase', speed: 0.6 } }).to({}, { duration: 2.2 });
          });
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className="focus-word">
      {words[0]}
    </span>
  );
}

export function ModernSite({ onRetro }: { onRetro: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const { lang, toggleLang, t, profile } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cleanupCrew = setupCursorCrew(root.current!, (el) => {
          if (el.matches('.work-tile')) playVisual(el);
        });

        // Stack marquee drifts with the scroll direction.
        gsap.utils.toArray<HTMLElement>('.marquee-track').forEach((track, i) => {
          gsap.to(track, { xPercent: i % 2 ? 12 : -12, ease: 'none', scrollTrigger: { trigger: track, scrub: 0.5 } });
        });

        // Big contact line fills with color once it comes into view. It is
        // filled at rest, so it never stays grey if the trigger is missed.
        ScrollTrigger.create({
          trigger: '.contact',
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.fromTo('.contact h2 .fill', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 1.6, ease: 'power2.inOut' }),
        });

        // Web fonts change line heights after load; re-measure every trigger.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return cleanupCrew;
      });

      // Without motion, still show the finished visuals.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        root.current!.classList.add('still');
      });
    },
    { scope: root },
  );

  // Copy changes length between languages; re-measure scroll positions.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lang]);

  const year = new Date().getFullYear();
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(t.services.ctaSubject)}`;

  return (
    <div className="modern" ref={root}>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              BC
            </span>
            {profile.name}
          </a>
          <nav className="site-nav" aria-label={lang === 'es' ? 'Secciones' : 'Sections'}>
            <a href="#work">{t.nav.work}</a>
            <a href="#services">{t.nav.services}</a>
            <a href="#ask">{t.nav.ask}</a>
            <a href="#experience">{t.nav.experience}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <button type="button" className="lang-toggle" onClick={toggleLang} aria-label={t.switchTo} title={t.switchTo}>
            <Flag country={lang === 'en' ? 'co' : 'us'} />
            <span>{lang === 'en' ? 'ES' : 'EN'}</span>
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
            title={theme === 'dark' ? t.themeToLight : t.themeToDark}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="retro-toggle" onClick={onRetro}>
            <Monitor size={15} aria-hidden="true" /> <span className="retro-label">{t.retro}</span>
            <span className="retro-short">{t.retroShort}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" data-build-section>
          <div className="wrap hero-grid">
            <figure className="portrait" data-build="portrait.webp">
              <img src={portrait} alt={lang === 'es' ? 'Retrato de Bryan Cruz' : 'Portrait of Bryan Cruz'} width={600} height={703} />
              <figcaption className="mono">600 × 703 · Ibagué, CO</figcaption>
              <span className="handle tl" aria-hidden="true" />
              <span className="handle tr" aria-hidden="true" />
              <span className="handle bl" aria-hidden="true" />
              <span className="handle br" aria-hidden="true" />
            </figure>

            <div className="hero-copy">
              <p className="status" data-build="Status">
                <span className="live" aria-hidden="true" /> {profile.availability}
              </p>
              <h1 data-build="Heading">
                Bryan
                <br />
                Cruz<span className="dot">.</span>
              </h1>
              <p className="tagline" data-build="Tagline">
                <span className="visually-hidden">
                  {t.hero.building} {t.hero.focus.join(', ')}.
                </span>
                <span aria-hidden="true">
                  {t.hero.building}
                  <FocusWord key={lang} words={t.hero.focus} />
                </span>
              </p>
              <div className="hero-meta" data-build="Credentials">
                <p>
                  {t.hero.leadA} <strong>Open LMS</strong>
                  {t.hero.leadB} {profile.location}.
                </p>
                <ul className="badges">
                  {profile.certifications.slice(0, 2).map((c) => (
                    <li key={c.name}>
                      <span className="badge-mark" aria-hidden="true">
                        <GoogleCloudIcon size={18} />
                      </span>
                      <span>
                        {c.name}
                        <small>{t.hero.certified}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="actions" data-build="Actions">
                <a className="btn" href="#services">
                  {t.hero.hire} <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a className="btn ghost" href={profile.resumeUrl} target="_blank" rel="noopener">
                  <ArrowDownToLine size={16} aria-hidden="true" /> {t.hero.resume}
                </a>
                <CopyEmail />
              </div>
            </div>
          </div>
        </section>

        <section className="work" id="work" data-build-section>
          <div className="wrap">
            <div className="section-head" data-build="Section">
              <p className="eyebrow">{t.work.eyebrow}</p>
              <h2>{t.work.title}</h2>
            </div>
            <div className="bento">
              {WORK.map(({ id, size, Visual }) => {
                const tile = t.work.tiles[id];
                return (
                  <article key={id} className={`work-tile ${size}`} data-build={tile.title}>
                    <Visual />
                    <div className="tile-copy">
                      <div className="tile-top">
                        <h3>{tile.title}</h3>
                        <span className="tile-stat mono">{tile.stat}</span>
                      </div>
                      <p>{tile.line}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="footnote">{t.work.footnote}</p>
          </div>
        </section>

        <section className="services" id="services" data-build-section>
          <div className="wrap">
            <div className="services-head" data-build="Offer">
              <p className="eyebrow">{t.services.eyebrow}</p>
              <h2>{t.services.title}</h2>
              <p>{t.services.lede}</p>
            </div>
            <div className="service-grid">
              {t.services.items.map((s, i) => (
                <article key={s.title} className="service" data-build={`Service 0${i + 1}`}>
                  <span className="service-index mono">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="tags">
                    {s.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="process" data-build="Process">
              <h3>{t.services.processTitle}</h3>
              <ol>
                {t.services.process.map((step, i) => (
                  <li key={step.title}>
                    <span className="step mono">{i + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="process-cta">
                <a className="btn" href={mailto}>
                  {t.services.cta} <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a className="btn ghost" href="#ask">
                  <MessageSquareText size={16} aria-hidden="true" /> {t.services.askFit}
                </a>
                <p className="process-note">{t.services.note}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ask-section" id="ask" data-build-section>
          <div className="wrap ask-grid">
            <div className="ask-intro" data-build="Intro">
              <p className="eyebrow">{t.ask.eyebrow}</p>
              <h2>{t.ask.title}</h2>
              <p>{t.ask.lede}</p>
            </div>
            <div data-build="Chat">
              <AskPanel />
            </div>
          </div>
        </section>

        <section className="experience" id="experience" data-build-section>
          <div className="wrap">
            <div className="section-head" data-build="Section">
              <p className="eyebrow">{t.experience.eyebrow}</p>
              <h2>{t.experience.title}</h2>
            </div>
            <ol className="roles">
              {profile.experience.map((role) => (
                <li key={role.company} className="role" data-build={role.company}>
                  <details>
                    <summary>
                      <span className="role-when mono">
                        {role.start} – {role.end}
                      </span>
                      <span className="role-what">
                        <strong>{role.title}</strong>
                        <span>{role.company}</span>
                      </span>
                      <span className="role-sum">{role.summary}</span>
                      <ChevronDown className="role-chev" size={18} aria-hidden="true" />
                    </summary>
                    <ul>
                      {role.highlights.map((h) => (
                        <li key={h.label}>
                          <strong>{h.label}.</strong> {h.text}
                          {h.link && (
                            <>
                              {' '}
                              <a href={h.link.url} target="_blank" rel="noopener">
                                {h.link.label}
                              </a>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="projects-section" id="projects" data-build-section>
          <div className="wrap">
            <div className="section-head" data-build="Section">
              <p className="eyebrow">{t.projects.eyebrow}</p>
              <h2>{t.projects.title}</h2>
            </div>
            <div className="projects">
              {profile.projects.map((p, i) =>
                PROJECT_ART[i] ? (
                  <article className="project" key={i} data-build={p.name}>
                    <ProjectArt kind={PROJECT_ART[i]} />
                    <div className="project-copy">
                      <p className="eyebrow">
                        {p.kind} · {p.year}
                      </p>
                      <h3>{p.name}</h3>
                      <p>{p.pitch}</p>
                      {p.links.length > 0 && (
                        <div className="project-links">
                          {p.links.map((l) => (
                            <a key={l.url} href={l.url} target="_blank" rel="noopener">
                              {l.label} <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ) : null,
              )}
            </div>
          </div>
        </section>

        <section className="stack" aria-label="Stack">
          {[0, 1].map((row) => {
            const items = profile.skills.flatMap((s) => s.items).filter((_, i) => i % 2 === row);
            return (
              <div className="marquee" key={row}>
                <div className="marquee-track">
                  {[...items, ...items].map((item, i) => (
                    <span key={i} aria-hidden={i >= items.length}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="creds-section" data-build-section>
          <div className="wrap creds">
            <div data-build="Certifications">
              <p className="eyebrow">{t.creds.certifications}</p>
              <ul className="cert-cards">
                {profile.certifications.map((c) => (
                  <li key={c.name} className={c.issuer.startsWith('Google') ? 'gc' : ''}>
                    {c.issuer.startsWith('Google') && (
                      <span className="cert-logo">
                        <GoogleCloudIcon size={20} />
                      </span>
                    )}
                    <span className="cert-year mono">{c.year}</span>
                    <strong>{c.name}</strong>
                    <span>{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-build="Education">
              <p className="eyebrow">{t.creds.education}</p>
              <ul className="edu">
                {profile.education.map((e) => (
                  <li key={e.name}>
                    <span className="mono">{e.year}</span>
                    <div>
                      <strong>{e.name}</strong>
                      <span>{e.issuer}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="langs">
                <span className="eyebrow">{t.creds.languages}</span> {profile.languages.join(' · ')}
              </p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>
              <span className="fill">{t.contact.title}</span>
            </h2>
            <p className="email-line">
              <a href={mailto}>{profile.email}</a>
            </p>
            <div className="actions">
              <CopyEmail className="btn" />
              <a className="btn ghost" href={profile.links.linkedin.url} target="_blank" rel="noopener">
                LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="btn ghost" href={profile.links.github.url} target="_blank" rel="noopener">
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="btn ghost" href={profile.resumeUrl} target="_blank" rel="noopener">
                {t.hero.resume} <ArrowDownToLine size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <span>
            © {year} {profile.fullName}
          </span>
          <span>
            {t.footer.built}{' '}
            <button type="button" className="link-btn" onClick={onRetro}>
              {t.footer.retro}
            </button>
          </span>
        </div>
      </footer>
    </div>
  );
}

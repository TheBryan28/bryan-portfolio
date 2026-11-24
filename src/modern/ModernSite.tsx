import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { ArrowDownToLine, ArrowUpRight, Check, ChevronDown, Copy, MessageSquareText, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { profile } from '../data/profile';
import { AskPanel } from './AskPanel';
import { GoogleCloudIcon } from '../ui/GoogleCloudIcon';
import { setupCursorCrew } from './build';
import { ChartVisual, EditorVisual, HubVisual, NovaVisual, PipelineVisual, ProjectArt, TerminalVisual } from './visuals';
import { playVisual } from './playVisual';
import portrait from '../assets/profile.webp';
import './modern.css';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

const FOCUS_WORDS = ['generative AI features', 'RAG pipelines', 'cloud infrastructure', 'AI developer tools'];

const WORK = [
  {
    id: 'nova',
    size: 'wide',
    title: 'Nova Course Generator',
    stat: '649 sites',
    line: 'A topic or a set of files becomes a complete Moodle course in about five minutes. The instructor approves the outline first.',
    Visual: NovaVisual,
  },
  {
    id: 'editor',
    size: '',
    title: 'tiny_ai_assistant',
    stat: '666 sites',
    line: 'The AI content creator inside the course editor.',
    Visual: EditorVisual,
  },
  {
    id: 'hub',
    size: '',
    title: 'One AI layer, four providers',
    stat: '1 interface',
    line: 'Every AI plugin talks to OpenAI, Anthropic, Gemini or DeepSeek through one interface.',
    Visual: HubVisual,
  },
  {
    id: 'chart',
    size: '',
    title: 'Snap theme refactor',
    stat: '11 → 3',
    line: 'High-priority customer issues in the year after the refactor began.',
    Visual: ChartVisual,
  },
  {
    id: 'pipe',
    size: '',
    title: 'CI/CD back to green',
    stat: '300+ tests',
    line: 'Repaired Behat and PHPUnit suites, then added AI review that separates UI changes from regressions.',
    Visual: PipelineVisual,
  },
  {
    id: 'term',
    size: 'wide',
    title: 'The team’s Claude Code plugin',
    stat: '12 skills',
    line: 'From a Jira ticket to a merged Moodle release, with an approval gate before any code changes.',
    Visual: TerminalVisual,
  },
];

const PROJECT_ART = { 'VerifAI Wallet': 'wallet', 'Relatos de Papel': 'services', 'Banking Assistant Workflows': 'flow' } as const;

function CopyEmail({ className = 'btn ghost' }: { className?: string }) {
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
      {copied ? 'Copied' : 'Copy email'}
    </button>
  );
}

export function ModernSite({ onRetro }: { onRetro: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

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

        // The focus line cycles through what Bryan builds.
        const word = root.current!.querySelector('.focus-word');
        if (word) {
          const cycle = gsap.timeline({ repeat: -1, delay: 2.4 });
          FOCUS_WORDS.slice(1)
            .concat(FOCUS_WORDS[0])
            .forEach((w) => {
              cycle.to(word, { duration: 0.9, scrambleText: { text: w, chars: 'lowerCase', speed: 0.6 } }).to({}, { duration: 2.2 });
            });
        }

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

  const year = new Date().getFullYear();

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
          <nav className="site-nav" aria-label="Sections">
            <a href="#work">Work</a>
            <a href="#ask">Ask AI</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <button type="button" className="retro-toggle" onClick={onRetro}>
            <Monitor size={15} aria-hidden="true" /> <span className="retro-label">Retro desktop</span>
            <span className="retro-short">Retro</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" data-build-section>
          <div className="wrap hero-grid">
            <figure className="portrait" data-build="portrait.webp">
              <img src={portrait} alt="Portrait of Bryan Cruz" width={600} height={703} />
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
                  Full-stack AI engineer building generative AI features, RAG pipelines, cloud infrastructure and AI developer tools.
                </span>
                <span aria-hidden="true">
                  Full-stack AI engineer building
                  <span className="focus-word">{FOCUS_WORDS[0]}</span>
                </span>
              </p>
              <div className="hero-meta" data-build="Credentials">
                <p>
                  I lead the generative AI plugins at <strong>Open LMS</strong>, a learning platform with 10 million users. Based in{' '}
                  {profile.location}.
                </p>
                <ul className="badges">
                  {profile.certifications.slice(0, 2).map((c) => (
                    <li key={c.name}>
                      <span className="badge-mark" aria-hidden="true">
                        <GoogleCloudIcon size={18} />
                      </span>
                      <span>
                        {c.name}
                        <small>Google Cloud Certified</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="actions" data-build="Actions">
                <a className="btn" href={profile.resumeUrl} target="_blank" rel="noopener">
                  <ArrowDownToLine size={16} aria-hidden="true" /> Resume
                </a>
                <a className="btn ghost" href="#ask">
                  <MessageSquareText size={16} aria-hidden="true" /> Ask my AI
                </a>
                <CopyEmail />
              </div>
            </div>

          </div>
        </section>

        <section className="work" id="work" data-build-section>
          <div className="wrap">
            <div className="section-head" data-build="Section">
              <p className="eyebrow">Selected work · Open LMS</p>
              <h2>Generative AI in production, on more than 600 sites.</h2>
            </div>
            <div className="bento">
              {WORK.map(({ id, size, title, stat, line, Visual }) => (
                <article key={id} className={`work-tile ${size}`} data-build={title}>
                  <Visual />
                  <div className="tile-copy">
                    <div className="tile-top">
                      <h3>{title}</h3>
                      <span className="tile-stat mono">{stat}</span>
                    </div>
                    <p>{line}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="footnote">Illustrations of how each feature works. Product names belong to Open LMS.</p>
          </div>
        </section>

        <section className="ask-section" id="ask" data-build-section>
          <div className="wrap ask-grid">
            <div className="ask-intro" data-build="Intro">
              <p className="eyebrow">Ask my AI</p>
              <h2>Interview my resume.</h2>
              <p>
                Runs on Gemini Nano inside Chrome when your computer supports it, and on Gemini in the cloud when it doesn’t. It only
                answers from my resume, in English or Spanish.
              </p>
            </div>
            <div data-build="Chat">
              <AskPanel />
            </div>
          </div>
        </section>

        <section className="experience" id="experience" data-build-section>
          <div className="wrap">
            <div className="section-head" data-build="Section">
              <p className="eyebrow">Experience</p>
              <h2>Five years, from research lab to production AI.</h2>
            </div>
            <ol className="roles">
              {profile.experience.map((role) => (
                <li key={role.title} className="role" data-build={role.company}>
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
              <p className="eyebrow">Side projects</p>
              <h2>Built outside the day job.</h2>
            </div>
            <div className="projects">
              {profile.projects
                .filter((p) => p.name in PROJECT_ART)
                .map((p) => (
                  <article className="project" key={p.name} data-build={p.name}>
                    <ProjectArt kind={PROJECT_ART[p.name as keyof typeof PROJECT_ART]} />
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
                ))}
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
              <p className="eyebrow">Certifications</p>
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
              <p className="eyebrow">Education</p>
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
                <span className="eyebrow">Languages</span> {profile.languages.join(' · ')}
              </p>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap">
            <p className="eyebrow">Contact</p>
            <h2>
              <span className="fill">Building something with AI? Let’s talk.</span>
            </h2>
            <p className="email-line">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
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
                Resume <ArrowDownToLine size={15} aria-hidden="true" />
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
            Built with React, GSAP and Gemini Nano.{' '}
            <button type="button" className="link-btn" onClick={onRetro}>
              Open the retro desktop
            </button>
          </span>
        </div>
      </footer>
    </div>
  );
}

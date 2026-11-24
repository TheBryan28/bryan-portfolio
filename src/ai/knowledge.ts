// The .js extension lets the Vercel function (plain Node ESM) resolve this
// file; Vite and TypeScript map it back to the .ts source.
import { profile } from '../data/profile.js';
import { STRINGS } from '../i18n/strings.js';

// Turns the profile into a compact plain-text brief. Both the on-device model
// (Gemini Nano has a small context window) and the cloud fallback use it, so
// the two engines always answer from exactly the same facts.

function brief(): string {
  const lines: string[] = [];
  lines.push(`Name: ${profile.name} (${profile.fullName})`);
  lines.push(`Role: ${profile.title}. Location: ${profile.location}. ${profile.availability}.`);
  lines.push(`Contact: ${profile.email} · ${profile.links.linkedin.url} · ${profile.links.github.url} · Resume: ${profile.resumeUrl}`);
  lines.push(`Summary: ${profile.summary}`);
  lines.push(`Languages: ${profile.languages.join(', ')}`);
  lines.push('');
  lines.push('EXPERIENCE');
  for (const role of profile.experience) {
    lines.push(`- ${role.title}, ${role.company} (${role.location}), ${role.start} to ${role.end}`);
    for (const h of role.highlights) lines.push(`  * ${h.label}: ${h.text}`);
  }
  lines.push('');
  lines.push('PROJECTS');
  for (const p of profile.projects) lines.push(`- ${p.name} (${p.kind}, ${p.year}): ${p.summary} Stack: ${p.stack.join(', ')}.`);
  lines.push('');
  lines.push('SKILLS');
  for (const s of profile.skills) lines.push(`- ${s.group}: ${s.items.join(', ')}`);
  lines.push('');
  lines.push('CERTIFICATIONS');
  for (const c of profile.certifications) lines.push(`- ${c.name}, ${c.issuer}, ${c.year}`);
  lines.push('');
  lines.push('SERVICES (freelance and contract work Bryan offers)');
  for (const sv of STRINGS.en.services.items) lines.push(`- ${sv.title}: ${sv.text}`);
  lines.push(`Process: ${STRINGS.en.services.process.map((p) => `${p.title}: ${p.text}`).join(' ')}`);
  lines.push('');
  lines.push('EDUCATION');
  for (const e of profile.education) lines.push(`- ${e.name}, ${e.issuer}, ${e.year}`);
  return lines.join('\n');
}

export const SYSTEM_PROMPT = `You are the assistant on Bryan Cruz's portfolio website. Visitors are mostly recruiters and engineering managers.

Rules:
- Answer only from the profile below. If the answer is not there, say you don't have that detail and suggest emailing Bryan at ${profile.email}.
- Never invent numbers, employers, dates or skills.
- Reply in the visitor's language (English or Spanish).
- Be brief: two to five sentences, or a short list. Plain text, no markdown headings.
- Refer to Bryan in the third person.
- Politely decline anything unrelated to Bryan's professional profile or services.
- For project inquiries, say Bryan replies by email and point to the Services section.

PROFILE
${brief()}`;

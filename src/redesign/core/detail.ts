import { capture, esc, links, site, softwareGroups, type Shot } from "./data";

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** Case-study content for one project. Each direction styles the `d-*` hooks its own way. */
export function detailHTML(s: Shot): string {
  const e = s.entry!;
  const media = [...new Set([e.image, ...e.media])];
  const link = e.link
    ? `<a class="d-link" href="${e.link}" target="_blank" rel="noopener">${esc(e.linkLabel ?? `Open ${host(e.link)}`)}</a>`
    : "";
  return `
  <header class="d-head">
    <h2 class="d-title">${esc(s.title)}</h2>
    <p class="d-line">${esc(s.line)}</p>
  </header>
  <div class="d-body">
    <div class="d-copy">
      <p class="d-what">${esc(e.summary)}</p>
      <blockquote class="d-why">${esc(e.rationale)}</blockquote>
      <dl class="d-facts">
        <div><dt>Role</dt><dd>${esc(e.role)}</dd></div>
        <div><dt>Status</dt><dd>${esc(s.status!)}${e.statusNote ? `, ${esc(e.statusNote.toLowerCase())}` : ""} (${esc(e.year)})</dd></div>
        <div><dt>Built with</dt><dd>${e.stack.map(esc).join(", ")}</dd></div>
      </dl>
      ${link}
    </div>
    <div class="d-media">
      ${media.map((m) => `<img loading="lazy" decoding="async" src="${capture(m)}" alt="${esc(s.title)} screen capture" onerror="this.remove()">`).join("")}
    </div>
  </div>`;
}

export function aboutHTML(): string {
  return `
  <header class="d-head">
    <h2 class="d-title">${esc(site.name)}</h2>
    <p class="d-line">${esc(site.role)}. ${esc(site.focus)}.</p>
  </header>
  <div class="d-body">
    <div class="d-copy">
      ${site.about.map((p) => `<p class="d-what">${esc(p)}</p>`).join("")}
      <blockquote class="d-why">${esc(site.archives)}</blockquote>
      <dl class="d-facts">
        ${softwareGroups.map((g) => `<div><dt>${esc(g.title)}</dt><dd>${g.items.map(esc).join(", ")}</dd></div>`).join("")}
      </dl>
    </div>
    <div class="d-links">
      <p class="d-contact">${esc(site.contactBody)}</p>
      <a class="d-link" href="${site.contactUrl}" target="_blank" rel="noopener">Message me on LinkedIn</a>
      <ul>
        ${links.map((l) => `<li><a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}
      </ul>
    </div>
  </div>`;
}

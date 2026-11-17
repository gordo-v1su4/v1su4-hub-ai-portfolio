// SLIT — the portfolio as a row of slit-scans.
// Every project is a narrow slit onto its plate, smeared the way a slit-scan camera
// smears a single column of the image. Point at a slit (or tap it) and it opens
// into the full frame. No WebGL: transforms only, so it runs on any phone.
import "./slit.css";
import { aboutShot, esc, links, metaLine, projects, reducedMotion, site, type Shot } from "../core/data";
import { aboutHTML, detailHTML } from "../core/detail";

export function mount(root: HTMLElement): () => void {
  const list: Shot[] = [...projects, aboutShot];
  const calm = reducedMotion();
  const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");

  root.innerHTML = `
  <div class="slit" data-state="loading">
    <header class="sl-top">
      <span class="sl-mark">V1SU4</span>
      <nav class="sl-nav" aria-label="Site">
        <button data-about>About</button>
        <a href="${site.contactUrl}" target="_blank" rel="noopener">Contact</a>
      </nav>
    </header>
    <p class="sl-lede">${esc(site.mission)}</p>
    <ol class="sl-row" style="--n:${list.length}">
      ${list
        .map((s, i) => {
          const link = s.entry?.link;
          return `
      <li class="sl-slit" data-i="${i}" style="--fx:${s.focus[0] * 100}%;--fy:${s.focus[1] * 100}%;--d:${(i * -3.7).toFixed(1)}s">
        <div class="sl-pan"><img src="${s.plate}" alt="" decoding="async" ${i > 3 ? 'loading="lazy"' : ""}></div>
        <button class="sl-spine" aria-expanded="false" aria-controls="sl-card-${i}"><span>${esc(s.title)}</span></button>
        <div class="sl-card" id="sl-card-${i}">
          <h2 class="sl-title">${esc(s.title)}</h2>
          <p class="sl-line">${esc(s.line)}</p>
          ${s.kind === "project" ? `<p class="sl-meta">${esc(metaLine(s))}</p>` : ""}
          <div class="sl-actions">
            <button class="sl-open" data-open="${i}">${s.kind === "about" ? "About Gordo" : "View project"}</button>
            ${link ? `<a class="sl-ext" href="${link}" target="_blank" rel="noopener">${esc(s.entry!.linkLabel ?? `Open ${host(link)}`)}</a>` : ""}
          </div>
        </div>
      </li>`;
        })
        .join("")}
    </ol>
    <footer class="sl-foot">
      <ul class="sl-links">
        ${links.map((l) => `<li><a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}
      </ul>
      <span class="sl-base">${esc(site.base)}</span>
    </footer>
    <section class="sl-sheet" hidden aria-label="Project details">
      <button class="sl-close">Close</button>
      <div class="sl-sheet-in rd-detail"></div>
    </section>
  </div>`;

  const $ = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const el = $(".slit");
  const slits = [...root.querySelectorAll<HTMLElement>(".sl-slit")];
  const sheet = $(".sl-sheet");
  const sheetIn = $(".sl-sheet-in");
  let current = -1;
  let sheetOpen = false;
  let hoverT = 0;

  function openSlit(i: number) {
    if (i === current) return;
    current = i;
    slits.forEach((s, j) => {
      s.classList.toggle("is-open", j === i);
      s.querySelector(".sl-spine")!.setAttribute("aria-expanded", String(j === i));
    });
  }
  function openSheet(i: number) {
    const s = list[i];
    sheetIn.innerHTML = s.kind === "about" ? aboutHTML() : detailHTML(s);
    sheet.hidden = false;
    sheet.scrollTop = 0;
    requestAnimationFrame(() => el.classList.add("is-sheet"));
    sheetOpen = true;
    document.documentElement.style.overflow = "hidden";
    $(".sl-close").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    el.classList.remove("is-sheet");
    document.documentElement.style.overflow = "";
    window.setTimeout(() => {
      if (!sheetOpen) sheet.hidden = true;
    }, 500);
    slits[current]?.querySelector<HTMLElement>(".sl-open")?.focus({ preventScroll: true });
  }

  // Pointing at a slit opens it. Slits widen around the pointer, so the one you are on stays under it.
  const hoverable = matchMedia("(hover: hover) and (pointer: fine)");
  slits.forEach((s, i) => {
    s.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse" || !hoverable.matches) return;
      window.clearTimeout(hoverT);
      hoverT = window.setTimeout(() => openSlit(i), 70);
    });
    s.querySelector(".sl-spine")!.addEventListener("focus", () => openSlit(i));
  });
  el.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-open],[data-about],.sl-close,.sl-spine");
    if (!t) return;
    if (t.dataset.open !== undefined) openSheet(Number(t.dataset.open));
    else if (t.hasAttribute("data-about")) {
      openSlit(list.length - 1);
      openSheet(list.length - 1);
    } else if (t.classList.contains("sl-close")) closeSheet();
    else if (t.classList.contains("sl-spine")) {
      const i = Number((t.closest(".sl-slit") as HTMLElement).dataset.i);
      if (i === current) openSheet(i);
      else {
        openSlit(i);
        if (!hoverable.matches) (t.closest(".sl-slit") as HTMLElement).scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
      }
    }
  });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") return closeSheet();
    if (sheetOpen) return;
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const i = (Math.max(0, current) + step + list.length) % list.length;
    openSlit(i);
    slits[i].querySelector<HTMLElement>(".sl-spine")!.focus({ preventScroll: true });
  };
  window.addEventListener("keydown", onKey);

  // One opening move: every slit starts shut, then the first one unfolds.
  const first = slits[0].querySelector("img")!;
  const start = () => {
    el.dataset.state = "ready";
    window.setTimeout(() => openSlit(0), calm ? 0 : 500);
  };
  if (first.complete) start();
  else {
    first.addEventListener("load", start, { once: true });
    first.addEventListener("error", start, { once: true });
  }

  return () => {
    window.clearTimeout(hoverT);
    window.removeEventListener("keydown", onKey);
    document.documentElement.style.overflow = "";
    root.innerHTML = "";
  };
}

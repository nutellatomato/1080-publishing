// Shared by every page: the service list, the top bar and the footer.
// A page marks its slots with <header class="top" data-service="N"> and <footer class="foot">.
// Load before spiral.js so the logo's spiral gets drawn.
const SERVICES = [
  { name: "Publishing", href: "publishing.html" },
  { name: "Music Supervision", href: "music-supervision.html" },
  { name: "Sync", href: "sync.html" },
];
const LINKS = [["Catalogue", "catalogue.html"], ["Artists", "artists.html"], ["About", "about.html"], ["Contact", "contact.html"]];
const EMAIL = "contact@1080publishing.com";

(() => {
  const top = document.querySelector(".top");
  if (top) {
    const cur = +(top.dataset.service || 0);
    const others = SERVICES.filter((_, k) => k !== cur).map(s => `<a href="${s.href}">${s.name}</a>`).join("");
    top.innerHTML = `
      <div class="brand">
        <a href="index.html" aria-label="1080 home"><svg class="mark" data-spiral="compass" data-w="3.6" viewBox="-32 -32 64 64" aria-hidden="true"></svg></a>
        <a class="home" href="index.html">1080</a>
        <div class="svcs"><a class="cur" href="${SERVICES[cur].href}">${SERVICES[cur].name}</a><div class="others">${others}</div></div>
      </div>
      <ul>${LINKS.map(([t, h]) => `<li><a href="${h}"${location.pathname.endsWith("/" + h) ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>`;

    // No hover on touch screens: first tap on the service name reveals the others, second tap follows it.
    const brand = top.querySelector(".brand");
    top.querySelector(".cur").addEventListener("click", e => {
      if (matchMedia("(hover: none)").matches && !brand.classList.contains("open")) { e.preventDefault(); brand.classList.add("open"); }
    });
    document.addEventListener("click", e => { if (!brand.contains(e.target)) brand.classList.remove("open"); });
  }

  const foot = document.querySelector(".foot");
  if (foot) foot.innerHTML = `<span class="k">Get in touch</span><a href="mailto:${EMAIL}">${EMAIL}</a>`;
})();

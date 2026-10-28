// Spiral marks for 1080. Every spiral is exactly 3 turns (1080°) inside a -32..32 viewBox.
// Usage: <svg data-spiral="compass" data-w="2" viewBox="-32 -32 64 64"></svg>; data-w = stroke width in viewBox units.
(() => {
  const TURNS = 3, G = 4.4; // G = radius step per half-turn; 6 half-turns span ±26.4

  // Two-centre (compass) spiral: half-circles alternate between centres G apart, radius grows by G each.
  // Shifted left by G so the whole figure is centred on 0,0.
  function compass(tail = 0) {
    let d = "M 0,0";
    for (let k = 1; k <= TURNS * 2; k++) {
      const r = G * k, cx = k % 2 ? 0 : G, x = (k % 2 ? cx - r : cx + r) - G;
      d += ` A ${r} ${r} 0 0 0 ${x},0`;
    }
    // Path ends at the right moving upward; a tail continues that tangent.
    return tail ? d + ` l 0,${-tail}` : d;
  }

  function archimedes(n = 540, r0 = 3, r1 = 28) {
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = (i / n) * TURNS * 2 * Math.PI, r = r0 + (r1 - r0) * (i / n);
      return [r * Math.sin(t), -r * Math.cos(t)];
    });
  }
  // One-centre spiral from 0,0 out to radius r1, counter-clockwise. Used for the drifting home spiral.
  function single(n = 720, r1 = G * TURNS * 2) {
    return Array.from({ length: n + 1 }, (_, i) => {
      const f = i / n, t = f * TURNS * 2 * Math.PI, r = r1 * f;
      return [r * Math.cos(t), -r * Math.sin(t)];
    });
  }
  const pts = p => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const stroke = (w, cap = "round") => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="${cap}"`;

  const draw = {
    compass: w => `<path d="${compass()}" ${stroke(w ?? 2)}/>`,
    single: w => `<polyline points="${pts(single())}" ${stroke(w ?? 2)} stroke-linejoin="round"/>`,
    flat: w => `<path d="${compass()}" ${stroke(w ?? 3.2, "butt")}/>`,
    // Tail runs off the end; rotate(90) turns it into a horizontal underline heading right.
    tail: w => `<path transform="rotate(90)" d="${compass(140)}" ${stroke(w ?? 2)}/>`,
    dotted: w => `<path d="${compass()}" ${stroke(w ?? 2.6)} stroke-dasharray="0 ${(w ?? 2.6) * 2.2}"/>`,
    // Groove pair: a wide stroke with a paper-coloured stroke inside reads as two parallel lines.
    groove: w => `<path d="${compass()}" ${stroke(w ?? 3.6)}/><path d="${compass()}" fill="none" stroke="var(--paper)" stroke-width="${(w ?? 3.6) * 0.45}" stroke-linecap="round"/>`,
    taper: w => {
      const p = archimedes(720), max = w ?? 3.4, step = 4;
      let out = "";
      for (let i = 0; i < p.length - 1; i += step) {
        const sw = 0.5 + (max - 0.5) * (i / p.length);
        out += `<polyline points="${pts(p.slice(i, i + step + 1))}" ${stroke(sw.toFixed(2))} stroke-linejoin="round"/>`;
      }
      return out;
    },
    // Badge: paper spiral knocked out of a solid disc.
    disc: w => `<circle r="32" fill="currentColor"/><g transform="scale(0.7)"><path d="${compass()}" fill="none" stroke="var(--paper)" stroke-width="${w ?? 3}" stroke-linecap="round"/></g>`,
  };

  window.draw1080 = root => (root || document).querySelectorAll("svg[data-spiral]").forEach(svg => {
    const w = svg.dataset.w ? parseFloat(svg.dataset.w) : undefined;
    svg.innerHTML = draw[svg.dataset.spiral](w);
  });
  window.draw1080();
})();

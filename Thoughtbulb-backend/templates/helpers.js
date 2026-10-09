const hbs = require("handlebars");

hbs.registerHelper("convertToINR", function (array1, num) {
    if (array1[num]) {
        let x = array1[num].toString().trim();
        y = Number.parseInt(x);
        x = Math.abs(y);
        return ((y<0 ? "-" :"") +
            " INR " +
            x.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                })
                .slice(1, -3)
        );
    }
    return "Nil";
});

hbs.registerHelper("convertToINRNum", function (num) {
    if (num) {
        num = num.toString().trim();
        y = Number.parseInt(num);
        num = Math.abs(y);
        return ((y<0 ? "-" :"") +
            " INR " +
            num.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                })
                .slice(1, -3)
        );
    }
    return "Nil";
});

hbs.registerHelper("eq", function(str1,str2){
    return (str1 === str2);
});

hbs.registerHelper('if_even', function(conditional, options) {
    if((conditional % 2) == 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
// Renders **phrase** as bold (used for objective bullets game_obj_1..3).
// Text is HTML-escaped first, so only the bold markers become markup. Use with triple braces: {{{boldmd data.game_obj_1}}}
hbs.registerHelper('boldmd', function (text) {
  if (!text) return '';
  const safe = hbs.escapeExpression(String(text));
  return new hbs.SafeString(safe.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 800;">$1</strong>'));
});

// ---------------------------------------------------------------------------
// Welcome slide: learning model diagram (server-rendered SVG)
// Usage: {{{learningModel data strip_color}}}
// Needs data.model_type (wheel|quadrant|cycle|staircase|clover) and
// data.model_elements = [{label, line}, x4]. Activity name goes in the hub.
// ---------------------------------------------------------------------------
hbs.registerHelper('learningModel', function (data, accent) {
  if (!data || !Array.isArray(data.model_elements) || data.model_elements.length < 4) return '';
  const esc = (s) => hbs.escapeExpression(String(s || ''));
  const a = accent || '#7B6FD8';
  const W = 490, H = 300, SH = [20, 42, 68, 100];
  const mix = (p) => `color-mix(in srgb, ${a} ${p}%, white)`;
  const dk = (p) => `color-mix(in srgb, ${a} ${p}%, black)`;
  const ink = (i) => (SH[i] >= 68 ? '#FFFFFF' : dk(60));
  const subInk = (i) => (SH[i] >= 68 ? 'rgba(255,255,255,0.9)' : dk(45));
  const T = (x, y, txt, size, weight, fill, anchor = 'middle') =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-family="Nunito, sans-serif" font-size="${size}" font-weight="${weight}" style="fill:${fill}">${esc(txt)}</text>`;
  const wrap = (s, max) => { const out = []; String(s || '').split(/\s+/).filter(Boolean).forEach((w) => { const l = out[out.length - 1]; if (l && (l + ' ' + w).length <= max) out[out.length - 1] = l + ' ' + w; else out.push(w); }); return out; };
  const els = data.model_elements.slice(0, 4).map((e) => (Array.isArray(e) ? { label: e[0], line: e[1] } : e));
  const label = (x, y, el, i, maxc = 18, size = 16) => {
    let s = T(x, y, el.label, size, 900, ink(i));
    wrap(el.line, maxc).forEach((l, k) => { s += T(x, y + 18 + k * 14, l, 11.5, 700, subInk(i)); });
    return s;
  };
  const name = String(data.game_name || '').trim();
  const hub = (cx, cy, r, maxc = 11) => {
    const lines = wrap(name.replace(/-/g, '- '), maxc).map((l) => l.replace(/- /g, '-'));
    const longest = Math.max(...lines.map((l) => l.length), 0);
    const fs = lines.length >= 3 || longest > 11 ? 14 : 17, lh = fs + 3;
    const top = cy - ((lines.length - 1) * lh) / 2 + fs * 0.35;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${mix(25)}" stroke-width="2"/>` +
      lines.map((l, k) => T(cx, top + k * lh, l, fs, 900, '#002F59')).join('');
  };
  const layouts = {
    wheel() {
      const cx = W / 2, cy = 268, R = 240, r = 94, n = 4, gap = 0.02, pt = (rad, t) => [cx + rad * Math.cos(t), cy + rad * Math.sin(t)];
      let s = '';
      els.forEach((el, i) => {
        const a0 = Math.PI + (i / n) * Math.PI + gap, a1 = Math.PI + ((i + 1) / n) * Math.PI - gap;
        const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
        s += `<path d="M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z" style="fill:${mix(SH[i])}"/>`;
        const [tx, ty] = pt((R + r) / 2 + 8, (a0 + a1) / 2); s += label(tx, ty - 8, el, i, 16);
      });
      return s + hub(cx, cy - 34 + 34, r - 10).replace(/<text/g, '<text transform="translate(0,-34)"');
    },
    quadrant() {
      const cw = 224, ch = 140, g = 12, x0 = (W - 2 * cw - g) / 2, y0 = 6, cx = W / 2, cy = y0 + ch + g / 2;
      let s = '';
      els.forEach((el, i) => {
        const col = i % 2, row = Math.floor(i / 2), x = x0 + col * (cw + g), y = y0 + row * (ch + g);
        s += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="18" style="fill:${mix(SH[i])}"/>`;
        s += label(col === 0 ? x + 70 : x + cw - 70, row === 0 ? y + 44 : y + ch - 52, el, i, 18);
      });
      return s + hub(cx, cy, 62);
    },
    cycle() {
      const cx = W / 2, cy = 148, R = 104;
      let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${mix(45)}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>`;
      [45, 135, 225, 315].forEach((deg) => { const t = ((deg - 90) * Math.PI) / 180, x = cx + R * Math.cos(t), y = cy + R * Math.sin(t);
        s += `<path d="M-7,-6 L5,0 L-7,6 Z" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg})" style="fill:${mix(80)}"/>`; });
      const pos = [[cx, cy - R], [cx + R + 30, cy], [cx, cy + R], [cx - R - 30, cy]];
      els.forEach((el, i) => { const [x, y] = pos[i], w = 162, h = 70;
        s += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="16" style="fill:${mix(SH[i])}"/>`; s += label(x, y - 8, el, i, 20, 15); });
      return s + hub(cx, cy, 58);
    },
    staircase() {
      const bw = 112, g = 8, x0 = (W - 4 * bw - 3 * g) / 2, base = 292, hs = [118, 160, 202, 244];
      let s = '';
      els.forEach((el, i) => { const x = x0 + i * (bw + g), h = hs[i], y = base - h;
        s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="14" style="fill:${mix(SH[i])}"/>`;
        s += T(x + 14, y + 26, '0' + (i + 1), 13, 900, SH[i] >= 68 ? 'rgba(255,255,255,0.85)' : dk(50), 'start');
        s += label(x + bw / 2, y + 54, el, i, 13, 15); });
      const fx = x0 + 3 * (bw + g) + bw / 2, fy = base - hs[3] - 8;
      return s + `<path d="M${fx - 2},${fy} L${fx - 2},${fy - 34} L${fx + 22},${fy - 26} L${fx - 2},${fy - 18}" style="fill:${a};stroke:${dk(70)};stroke-width:2;stroke-linejoin:round"/>`;
    },
    clover() {
      const cx = W / 2, cy = 150, d = 74, pr = 84;
      const pos = [[cx - d, cy - d * 0.72], [cx + d, cy - d * 0.72], [cx - d, cy + d * 0.72], [cx + d, cy + d * 0.72]];
      let s = '';
      els.forEach((el, i) => { const [x, y] = pos[i]; s += `<circle cx="${x}" cy="${y}" r="${pr}" style="fill:${mix(SH[i])};opacity:0.96"/>`; });
      els.forEach((el, i) => { const [x, y] = pos[i]; s += label(x + (x < cx ? -26 : 26), y + (y < cy ? -24 : 22) - 6, el, i, 15, 15); });
      return s + hub(cx, cy, 58);
    },
  };
  const fn = layouts[data.model_type] || layouts.wheel;
  return new hbs.SafeString(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${fn()}</svg>`);
});

hbs.registerHelper('upper', (s) => String(s || '').toUpperCase());

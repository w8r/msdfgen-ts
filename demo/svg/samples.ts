/** Sample SVGs shared by the SVG demos. */
export const SAMPLES: Record<string, string> = {
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#ff7aa2"/><stop offset="1" stop-color="#c8102e"/></linearGradient>
  <path fill="url(#g)" d="M12 21C12 21 2 14.5 2 8.5A5 5 0 0 1 12 6A5 5 0 0 1 22 8.5C22 14.5 12 21 12 21Z"/>
</svg>`,
  sunset: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <linearGradient id="sky" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".6" stop-color="#d53369"/><stop offset="1" stop-color="#ffcf6b"/></linearGradient>
  <radialGradient id="sun"><stop offset=".5" stop-color="#fff6c2"/><stop offset="1" stop-color="#ffb347"/></radialGradient>
  <path fill="url(#sky)" d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
  <path fill="url(#sun)" d="M7 13a5 5 0 1 1 10 0a5 5 0 1 1-10 0z"/>
  <path fill="#5b2a86" opacity=".85" d="M2 16Q7 11 12 15T22 14V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
  <path fill="#1d0b3a" d="M2 19Q9 15 14 18T22 17V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
</svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <radialGradient id="p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fd4ff"/><stop offset="1" stop-color="#0b4f9c"/></radialGradient>
  <path fill="url(#p)" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM10 8v8l6-4z"/>
</svg>`,
  wave: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="teal" d="M2 12Q7 2 12 12T22 12V22H2Z"/>
  <path style="fill:#ff8c00;fill-opacity:.8" d="M4 4h4c2 0 3 1 3 2s-1 2-3 2h-4z"/>
</svg>`,
};

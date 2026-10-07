/* Local, consistent upright glyphs. Presentation only: no rune outcomes or entropy. */
(() => {
  'use strict';
  const glyphs = [
    ['fehu','Fehu','ᚠ','M16 55V9M16 27L36 12M16 39L36 24'],
    ['uruz','Uruz','ᚢ','M12 55V9L36 23V55'],
    ['thurisaz','Thurisaz','ᚦ','M16 55V9M16 20L36 32L16 44'],
    ['ansuz','Ansuz','ᚨ','M16 55V9M16 13L36 28M16 28L36 43'],
    ['raidho','Raidho','ᚱ','M14 55V9L36 23L14 35L36 55'],
    ['kaunan','Kaunan','ᚲ','M35 12L13 32L35 52'],
    ['gebo','Gebo','ᚷ','M12 10L36 54M36 10L12 54'],
    ['wunjo','Wunjo','ᚹ','M14 55V9L36 22L14 35'],
    ['hagalaz','Hagalaz','ᚺ','M12 9V55M36 9V55M12 20L36 44'],
    ['nauthiz','Nauthiz','ᚾ','M24 9V55M10 21L38 43'],
    ['isa','Isa','ᛁ','M24 9V55'],
    ['jera','Jera','ᛃ','M12 9L26 21L12 33M36 31L22 43L36 55'],
    ['eihwaz','Eihwaz','ᛇ','M24 55V9L36 23M24 55L12 41'],
    ['perthro','Perthro','ᛈ','M12 9V55M12 9L26 23L36 9M12 55L26 41L36 55'],
    ['algiz','Algiz','ᛉ','M24 55V9M10 13L24 31L38 13'],
    ['sowilo','Sowilo','ᛊ','M34 9L14 25L34 39L14 55'],
    ['tiwaz','Tiwaz','ᛏ','M24 55V9M10 25L24 9L38 25'],
    ['berkano','Berkano','ᛒ','M14 55V9L36 21L14 32L36 44L14 55'],
    ['ehwaz','Ehwaz','ᛖ','M12 55V9L24 29L36 9V55'],
    ['mannaz','Mannaz','ᛗ','M12 55V9L36 35M36 55V9L12 35'],
    ['laguz','Laguz','ᛚ','M16 55V9L36 27'],
    ['ingwaz','Ingwaz','ᛜ','M24 12L39 32L24 52L9 32Z'],
    ['dagaz','Dagaz','ᛞ','M12 9V55L36 9V55Z'],
    ['othala','Othala','ᛟ','M10 55L36 25L24 9L12 25L38 55']
  ].map(([id,name,glyph,path]) => Object.freeze({id,name,glyph,path}));
  const byId = new Map(glyphs.map(rune => [rune.id,rune]));
  function stone(id = null) {
    const rune = id === null ? null : byId.get(id);
    if (id !== null && !rune) throw new Error('Unknown rune glyph.');
    const element = document.createElement('div');
    element.className = `rune-stone ${rune ? 'rune-revealed' : 'rune-concealed'}`;
    element.setAttribute('aria-hidden','true');
    if (rune) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 48 64');
      svg.setAttribute('class','rune-symbol');
      svg.setAttribute('aria-hidden','true');
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',rune.path);
      svg.append(path);
      element.append(svg);
    }
    return element;
  }
  window.RuneVisuals = Object.freeze({glyphs:Object.freeze(glyphs),stone});
})();

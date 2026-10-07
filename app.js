/* Local UI: all assignments and orientations come from the locked deck engine. */
(() => {
  'use strict';
  const cards = window.TarotDeck.cards;
  const cardById = new Map(cards.map(card => [card.id,card]));
  const exportUrls = new Set();
  const $ = id => document.getElementById(id);
  const node = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  };
  const category = card => card.family === 'major' ? 'Major Arcana' : `Minor Arcana · ${card.suit[0].toUpperCase()}${card.suit.slice(1)}`;
  function suitEmblem(suit) {
    const paths = {
      cups:['M8 7H32V12C32 23 8 23 8 12Z','M20 21V31M12 33H28'],
      wands:['M12 33L28 7M8 29L24 3M16 37L32 11','M14 18L9 13M23 24L30 25'],
      swords:['M20 3L24 23H16ZM11 25H29M20 25V35M17 36H23'],
      pentacles:['M20 6L23.5 16.5L35 16.5L26 23.5L29.5 34L20 27.5L10.5 34L14 23.5L5 16.5L16.5 16.5Z']
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 40 40');
    svg.setAttribute('class','suit-symbol');
    svg.setAttribute('aria-hidden','true');
    for (const d of paths[suit]) {
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d);
      svg.append(path);
    }
    return svg;
  }
  function face(card, reversed = false) {
    const element = node('div', `card-face ${card.family} ${card.suit || ''}${reversed ? ' is-reversed' : ''}`);
    element.setAttribute('aria-hidden','true');
    const emblem = node('span','face-emblem',card.family === 'major' ? card.emblem : '');
    if (card.family === 'minor') emblem.append(suitEmblem(card.suit));
    element.append(node('span','face-index',card.index),emblem);
    const name = node('div','face-name',card.name);
    name.append(node('p','face-family',card.family === 'major' ? 'Major Arcana' : card.suit));
    element.append(name);
    return element;
  }
  ['moon','ace-cups'].map(id => cardById.get(id)).forEach(card => {
    const item = node('div','sample-item');
    item.append(face(card),node('p','',`${card.name} · ${category(card)}`));
    $('frame-samples').append(item);
  });
  for (const group of [{id:'major',name:'Major Arcana'},...window.TarotDeck.suits]) {
    const optgroup = node('optgroup');
    optgroup.label = group.id === 'major' ? group.name : `${group.name} · ${group.element}`;
    for (const card of cards.filter(card => group.id === 'major' ? card.family === 'major' : card.suit === group.id)) {
      const option = node('option','',card.name);
      option.value = card.id;
      optgroup.append(option);
    }
    $('signifier').append(optgroup);
  }
  $('signifier').value = 'moon';
  function updateSignifier() {
    const card = cards.find(card => card.id === $('signifier').value);
    $('signifier-description').textContent = `${category(card)} · ${card.meanings.upright}`;
  }
  let localError = '';
  let cutMessage = '';
  let touchMessage = '';
  let deckSignature = '';
  let previousCutCount = 0;
  let previousTouchCount = 0;
  let divinationShell = null;
  let tarotDraftEdited = false;
  let engine = window.TarotEngine.create(syncPreparation);
  const selectedSpread = () => window.TarotSpreads.find(spread => spread.id === $('spread-choice').value);
  function optionsFromControls() {
    return {spreadId:$('spread-choice').value,signifierId:$('signifier').value,reversals:$('reversals').checked,question:$('intention').value};
  }
  function attempt(action) {
    localError = '';
    try { action(); } catch (failure) { localError = failure.message; }
    syncPreparation();
  }
  function syncPreparation(state = engine.getState()) {
    const disabled = state.phase !== 'preparing';
    $('spread-choice').value = state.settings.spreadId;
    if (state.settings.signifierId) $('signifier').value = state.settings.signifierId;
    $('reversals').checked = state.settings.reversals;
    $('intention').value = state.settings.question;
    for (const id of ['spread-choice','signifier','reversals','intention']) $(id).disabled = disabled;
    $('start-shuffle').disabled = disabled || !state.secureRandomAvailable;
    $('stop-shuffle').disabled = state.phase !== 'shuffling';
    $('begin-reading').disabled = state.phase === 'reading' || !state.hasShuffled || (!state.secureRandomAvailable && state.settings.reversals) || (state.ritual.enabled && state.ritual.completedRounds < 6);
    $('touch-controls').disabled = disabled;
    $('color-choice').disabled = !$('use-color').checked;
    $('apply-touches').disabled = disabled || !state.hasShuffled;
    const signature = `${state.settings.spreadId}/${state.settings.signifierId}`;
    if (signature !== deckSignature) {
      deckSignature = signature;
      const a = Math.floor(state.deckSize / 3);
      $('pile-a').value = a;
      $('pile-b').value = Math.floor((state.deckSize - a) / 2);
      cutMessage = '';
      touchMessage = '';
    }
    if (state.cutCount < previousCutCount) cutMessage = '';
    if (state.touchCount < previousTouchCount) touchMessage = '';
    previousCutCount = state.cutCount;
    previousTouchCount = state.touchCount;
    const ready = !disabled && state.hasShuffled;
    $('cut-controls').disabled = !ready;
    $('random-cut').disabled = !state.secureRandomAvailable;
    $('cut-count').textContent = `· ${state.cutCount} ${state.cutCount === 1 ? 'gathering' : 'gatherings'}`;
    $('cut-status').textContent = state.phase === 'shuffling' ? 'Stop shuffling before choosing or gathering piles.' : !state.hasShuffled ? 'Shuffle and stop to cut your deck.' : cutMessage || 'Choose sizes and a gathering order, then gather. You can repeat the cut.';
    $('touch-status').textContent = touchMessage || (state.touchCount ? `${state.touchCount} personal-touch ${state.touchCount === 1 ? 'application' : 'applications'}.` : 'No personal touches applied.');
    updatePilePreview(state);
    renderRitual(state);
    const status = state.phase === 'reading' ? 'The entire final deck is locked.' : !state.secureRandomAvailable ? 'Secure browser randomness is unavailable. Shuffling is disabled.' : state.phase === 'shuffling' ? `Shuffling your ${state.deckSize}-card deck. Stop whenever you feel ready.` : state.hasShuffled ? `Your ${state.deckSize}-card deck is ready. Shuffle again or begin reading.` : `Shuffle your ${state.deckSize}-card deck before beginning.`;
    if ($('shuffle-status').textContent !== status) $('shuffle-status').textContent = status;
    $('shuffle-count').textContent = state.shuffleCount ? `${state.shuffleCount} complete shuffle ${state.shuffleCount === 1 ? 'pass' : 'passes'}` : '';
    $('preparation-error').textContent = localError || state.error;
    $('preparation-error').hidden = !$('preparation-error').textContent;
    const spread = selectedSpread();
    $('spread-purpose').textContent = spread.purposeFromManual;
    $('signifier-setting').hidden = spread.chosenCardCount === 0;
    updateSignifier();
    if (divinationShell) divinationShell.update();
  }
  function pileSizes(state = engine.getState()) {
    const a = $('pile-a').valueAsNumber, b = $('pile-b').valueAsNumber;
    return [a,b,state.deckSize-a-b];
  }
  function updatePilePreview(state = engine.getState()) {
    const sizes = pileSizes(state);
    const valid = sizes.every(size => Number.isInteger(size) && size > 0);
    $('pile-a').max = state.deckSize - 2;
    $('pile-b').max = state.deckSize - 2;
    $('pile-c').value = Number.isFinite(sizes[2]) ? String(sizes[2]) : ' - ';
    $('pile-total').textContent = valid ? `${sizes.join(' + ')} = ${state.deckSize} cards` : `Each pile needs at least one whole card; the total must be ${state.deckSize}.`;
    $('pile-total').classList.toggle('invalid-piles',!valid);
    $('gather-piles').disabled = !valid || state.phase !== 'preparing' || !state.hasShuffled;
  }
  function numbersFromControls() {
    const text = $('favorite-numbers').value.trim();
    if (!text) return [];
    const tokens = text.split(/[,\s]+/).filter(Boolean);
    if (tokens.length > 12 || !tokens.every(token => /^\d{1,15}$/.test(token))) throw new Error('Use up to 12 whole numbers, each with at most 15 digits, separated by commas or spaces.');
    return tokens.map(Number);
  }
  function renderRitual(state) {
    $('ritual-setting').hidden = state.settings.spreadId !== 'celtic-cross';
    $('ritual-guide').disabled = state.phase !== 'preparing';
    $('ritual-guide').checked = state.ritual.enabled;
    $('ritual-progress').hidden = !state.ritual.enabled;
    const round = Math.min(state.ritual.completedRounds + 1,6);
    const role = round <= 3 ? 'Reader' : 'Inquirer';
    const action = {shuffle:'Start a fresh shuffle.',stop:'Stop shuffling, then cut and gather.',cut:'Cut into three piles and gather them.'}[state.ritual.stage];
    const status = state.ritual.completedRounds === 6 ? 'All six rounds are complete. Your deck is ready to read.' : `${role} · round ${round <= 3 ? round : round-3} of 3 (${round} of 6): ${action || 'Turn the guide on to follow the rounds.'}`;
    if ($('ritual-status').textContent !== status) $('ritual-status').textContent = status;
    $('ritual-rounds').replaceChildren();
    for (let i = 1; i <= 6; ++i) {
      const done = i <= state.ritual.completedRounds;
      const li = node('li',done ? 'done' : i === round ? 'current' : '',`${i <= 3 ? 'Reader' : 'Inquirer'} ${i <= 3 ? i : i-3}${done ? ' · done' : ''}`);
      if (!done && i === round) li.setAttribute('aria-current','step');
      $('ritual-rounds').append(li);
    }
  }
  function readingView() {
    const snapshot = engine.getReading();
    const spread = window.TarotSpreads.find(item => item.id === snapshot.settings.spreadId);
    return {
      spread,
      assignments:snapshot.assignments.map(entry => ({position:spread.positions.find(position => position.number === entry.position),card:cardById.get(entry.cardId),reversed:entry.reversed})),
      revealed:new Set(engine.getRevealed())
    };
  }
  function inspect(number) {
    const saved = engine.inspect(number);
    if (!saved) return;
    const spread = window.TarotSpreads.find(item => item.id === engine.getReading().settings.spreadId);
    const position = spread.positions.find(item => item.number === number);
    const card = cardById.get(saved.cardId);
    const orientation = saved.reversed ? 'Reversed' : 'Upright';
    const opposite = saved.reversed ? 'Upright' : 'Reversed';
    $('detail-position').textContent = `Position ${number} · ${position.label}`;
    $('detail-title').textContent = card.name;
    $('reading-selection-status').textContent = `Position ${number}: ${position.label}. ${card.name}, ${orientation.toLowerCase()}${spread.chosenCardCount && number === 0 ? ', chosen signifier' : ''}.`;
    $('detail-face').replaceChildren(face(card,saved.reversed));
    $('detail-category').textContent = `${category(card)} · ${orientation}${spread.chosenCardCount && number === 0 ? ' · Chosen signifier' : ''}`;
    $('position-meaning').textContent = position.meaningFromManual;
    $('meaning-heading').textContent = `From the handbook · ${orientation}`;
    $('card-meaning').textContent = card.meanings[orientation.toLowerCase()];
    $('alternate-heading').textContent = `${opposite} meaning · reference`;
    $('alternate-meaning').textContent = card.meanings[opposite.toLowerCase()];
    $('meaning-source').textContent = `${window.TarotDeck.title} · handbook page ${card.source.printedPage}`;
    $('meaning-source').hidden = false;
    $('alternate-reference').hidden = false;
    $('alternate-reference').open = false;
    const reflection = window.TarotInterpretation.build(engine.getReading(),engine.getRevealed())?.positions.find(entry => entry.number === number);
    $('position-reflection').hidden = !reflection;
    $('reflection-context').textContent = reflection?.context || '';
    $('reflection-prompt').textContent = reflection?.prompt || '';
    for (const slot of $('spread-table').children) {
      const selected = Number(slot.dataset.position) === number;
      slot.classList.toggle('selected',selected);
      slot.setAttribute('aria-pressed',String(selected));
    }
  }
  function renderReflection() {
    const reflection = window.TarotInterpretation.build(engine.getReading(),engine.getRevealed());
    $('spread-reflection').hidden = !reflection?.complete;
    $('connection-groups').replaceChildren();
    $('reflection-recap').replaceChildren();
    if (!reflection?.complete) {
      $('reading-connections').open = false;
      $('spread-reflection-note').textContent = '';
      return;
    }
    $('spread-reflection-note').textContent = reflection.note;
    for (const group of reflection.groups) {
      const section = node('section','connection-group');
      section.append(node('h4','',group.title),node('p','connection-context',group.context));
      for (const entry of group.entries) {
        const source = node('div','connection-source');
        source.append(node('p','connection-card-heading',window.TarotInterpretation.reference(entry)),
          node('p','small muted',`Handbook meaning (${entry.orientation.toLowerCase()}):`),
          node('blockquote','',entry.meaning),
          node('p','source-credit',`${window.TarotDeck.title} · handbook page ${entry.sourcePage}`));
        section.append(source);
      }
      section.append(node('p','reflection-prompt',group.prompt));
      $('connection-groups').append(section);
    }
    const recap = reflection.recap;
    const list = node('ul','recap-cards');
    for (const entry of recap.entries) list.append(node('li','',window.TarotInterpretation.reference(entry)));
    $('reflection-recap').append(node('h4','',recap.title),node('p','',recap.context),list,node('p','reflection-prompt',recap.prompt));
  }
  function renderTable() {
    const {spread,assignments,revealed} = readingView();
    $('spread-table').className = `spread-table ${spread.id}`;
    $('spread-table').replaceChildren();
    for (const {position,card,reversed} of assignments) {
      const open = revealed.has(position.number);
      const slot = node('button','slot');
      slot.type = 'button';
      slot.dataset.position = position.number;
      slot.disabled = !open;
      slot.setAttribute('aria-label',`Position ${position.number}: ${position.label}. ${open ? `${card.name}, ${category(card)}, ${reversed ? 'reversed' : 'upright'}. Inspect card.` : 'Face down.'}`);
      slot.setAttribute('aria-pressed','false');
      // Geometry comes from the source map; offsets expose the central 0/1/2 layers.
      const x = spread.id === 'mystic-seven' ? 20 + position.x * 30 : 10 + position.x * 24;
      slot.style.left = `${x}%`;
      const staff = spread.id === 'celtic-cross' && position.number >= 7;
      if (staff) slot.classList.add('staff');
      slot.style.top = `calc(var(${staff ? '--staff-row' : '--row'}) * ${spread.id === 'mystic-seven' || staff ? position.y : position.y === 0 ? 0 : position.y - .05})`;
      slot.style.zIndex = String(position.layer + 1);
      if (spread.id === 'celtic-cross' && position.number <= 2) {
        slot.classList.add('center');
        const offset = position.number === 0 ? -10 : position.number === 1 ? 8 : 0;
        slot.style.marginLeft = `${offset}px`;
        slot.style.marginTop = position.number === 2 ? 'calc((var(--card-h) - var(--card-w)) / 2 + 8px)' : `${offset}px`;
      }
      if (position.rotationDegrees === 90) slot.classList.add('crossing');
      if (open) slot.append(face(card,reversed));
      else {
        const back = node('div','card-back');
        back.setAttribute('aria-hidden','true');
        back.append(node('span','','✦'));
        slot.append(back);
      }
      slot.append(node('span','position-badge',String(position.number)),node('span','slot-label',position.label));
      slot.addEventListener('click',() => inspect(position.number));
      $('spread-table').append(slot);
    }
    const count = spread.revealOrder.filter(number => revealed.has(number)).length;
    $('progress').textContent = `${count} of ${spread.dealtCardCount} revealed`;
    const next = spread.revealOrder.find(number => !revealed.has(number));
    $('reveal-next').disabled = next === undefined;
    $('reveal-next').textContent = next === undefined ? 'Your spread is revealed' : `Reveal card ${next}`;
    $('download-reading').disabled = next !== undefined;
    $('download-note').textContent = next === undefined ? 'Keep or share this text record. It cannot resume the app.' : 'Reveal every card to download the reading.';
    // A second inspection route keeps the Celtic Cross's covered center cards accessible.
    $('position-list').replaceChildren();
    for (const {position,card} of assignments) {
      const li = node('li');
      li.value = position.number;
      li.append(node('strong','',`${position.label}: `),document.createTextNode(position.meaningFromManual));
      if (revealed.has(position.number)) {
        const inspectButton = node('button','guide-inspect',`Inspect ${card.name}`);
        inspectButton.addEventListener('click',() => inspect(position.number));
        li.append(inspectButton);
      }
      $('position-list').append(li);
    }
    renderReflection();
    if (divinationShell) divinationShell.update();
  }
  function beginReading() {
    if (engine.getState().phase === 'preparing') engine.configure(optionsFromControls());
    const snapshot = engine.beginReading();
    const {spread} = readingView();
    $('reading-title').textContent = spread.name;
    $('reading-intention').textContent = snapshot.settings.question;
    $('reading-intention').hidden = !$('reading-intention').textContent;
    $('detail-position').textContent = 'Your next card';
    $('detail-title').textContent = 'Let the spread unfold';
    $('reading-selection-status').textContent = '';
    $('detail-face').replaceChildren();
    $('detail-category').textContent = '';
    $('position-meaning').textContent = 'Reveal the first card to explore its position.';
    $('card-meaning').textContent = 'Reveal a card to read its handbook meaning.';
    $('meaning-heading').textContent = 'From the handbook';
    $('alternate-meaning').textContent = '';
    $('meaning-source').hidden = true;
    $('alternate-reference').hidden = true;
    $('alternate-reference').open = false;
    $('position-reflection').hidden = true;
    $('reflection-context').textContent = '';
    $('reflection-prompt').textContent = '';
    $('download-status').textContent = '';
    $('download-status').hidden = true;
    $('locked-note').textContent = snapshot.signifier ? 'All 77 shuffled cards and your reserved signifier are fixed. Reveals use their saved order and orientation.' : 'All 78 cards are fixed. Reveals use their saved order and orientation.';
    renderTable();
    if (spread.chosenCardCount) inspect(0);
    document.querySelector('.preparation').hidden = true;
    $('reading').hidden = false;
    $('reveal-next').focus();
  }
  $('reveal-next').addEventListener('click',() => {
    const next = engine.revealNext();
    if (!next) return;
    renderTable();
    inspect(next.position);
  });
  function resetTarot({clearSettings = false} = {}) {
    localError = '';
    cutMessage = '';
    touchMessage = '';
    $('download-reading').disabled = true;
    $('download-status').textContent = '';
    $('download-status').hidden = true;
    if (engine.getState().phase === 'reading') engine.newReading();
    if (clearSettings) {
      tarotDraftEdited = false;
      $('spread-choice').value = 'mystic-seven';
      $('signifier').value = 'moon';
      $('reversals').checked = false;
      $('intention').value = '';
      $('use-color').checked = false;
      $('color-choice').value = '#d0af77';
      $('favorite-numbers').value = '';
      $('gathering-order').value = '120';
      deckSignature = '';
      for (const disclosure of $('tarot-branch').querySelectorAll('details')) disclosure.open = false;
      // The existing engine resets only begun readings; a discarded preparation gets a fresh instance.
      engine = window.TarotEngine.create(syncPreparation);
      engine.configure(optionsFromControls());
    }
    $('reading-selection-status').textContent = '';
    renderReflection();
    $('position-reflection').hidden = true;
    $('reflection-context').textContent = '';
    $('reflection-prompt').textContent = '';
    $('reading-title').textContent = '';
    $('reading-intention').textContent = '';
    $('reading-intention').hidden = true;
    $('spread-table').replaceChildren();
    $('position-list').replaceChildren();
    $('detail-face').replaceChildren();
    $('detail-title').textContent = 'Let the spread unfold';
    $('detail-position').textContent = 'Your next card';
    $('detail-category').textContent = '';
    $('position-meaning').textContent = 'Reveal a card to explore its position.';
    $('card-meaning').textContent = 'Reveal a card to read its handbook meaning.';
    $('meaning-source').textContent = '';
    $('meaning-source').hidden = true;
    $('alternate-meaning').textContent = '';
    $('alternate-reference').hidden = true;
    $('progress').textContent = '';
    $('locked-note').textContent = '';
    $('reading').hidden = true;
    document.querySelector('.preparation').hidden = false;
    if (!clearSettings) $('start-shuffle').focus();
  }
  $('new-reading').addEventListener('click',() => divinationShell.newTarotReading());
  for (const id of ['spread-choice','signifier','reversals','intention']) $(id).addEventListener('change',() => attempt(() => engine.configure(optionsFromControls())));
  $('start-shuffle').addEventListener('click',() => attempt(() => {
    engine.configure(optionsFromControls());
    engine.startShuffling();
  }));
  $('stop-shuffle').addEventListener('click',() => attempt(() => engine.stopShuffling()));
  $('use-color').addEventListener('change',() => { $('color-choice').disabled = !$('use-color').checked; });
  for (const id of ['use-color','color-choice','favorite-numbers']) $(id).addEventListener('input',() => {
    touchMessage = 'Choices changed. Press Apply after stopping to affect the deck.';
    $('touch-status').textContent = touchMessage;
  });
  $('apply-touches').addEventListener('click',() => attempt(() => {
    const operation = engine.applyTouches({color:$('use-color').checked ? $('color-choice').value : null,numbers:numbersFromControls()});
    touchMessage = !operation ? 'No color or numbers selected. The deck is unchanged.' : operation.rotation === 0 ? 'Personal touches applied. The top stays in place this time.' : 'Personal touches applied. The hidden deck has been rotated.';
  }));
  for (const id of ['pile-a','pile-b']) $(id).addEventListener('input',() => {
    cutMessage = 'Pile sizes changed. Gather to apply them.';
    $('cut-status').textContent = cutMessage;
    updatePilePreview();
  });
  $('gathering-order').addEventListener('change',() => {
    cutMessage = 'Gathering order chosen. Gather to apply it.';
    $('cut-status').textContent = cutMessage;
  });
  $('random-cut').addEventListener('click',() => attempt(() => {
    const choices = engine.randomCutChoices();
    $('pile-a').value = choices.sizes[0];
    $('pile-b').value = choices.sizes[1];
    $('gathering-order').value = choices.gatheringOrder.join('');
    cutMessage = 'Random sizes and order chosen. The deck changes only when you gather.';
  }));
  $('gather-piles').addEventListener('click',() => attempt(() => {
    const operation = engine.cutDeck(pileSizes(),Array.from($('gathering-order').value,Number));
    cutMessage = `Piles gathered ${operation.gatheringOrder.map(index => 'ABC'[index]).join(' → ')}. You can cut again.`;
  }));
  $('ritual-guide').addEventListener('change',() => attempt(() => engine.setRitualGuide($('ritual-guide').checked)));
  $('begin-reading').addEventListener('click',() => attempt(beginReading));
  $('download-reading').addEventListener('click',() => {
    try {
      const report = window.TarotReadingExport.build(engine.getReading(),engine.getRevealed());
      const blob = new Blob(['\ufeff',report.text],{type:'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      exportUrls.add(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = report.filename;
      document.body.append(link);
      try {
        link.click();
      } finally {
        link.remove();
        // Give the browser time to capture the local download, then release its Blob memory.
        window.setTimeout(() => { URL.revokeObjectURL(url); exportUrls.delete(url); },1000);
      }
      $('download-status').textContent = `TXT download requested: ${report.filename}`;
    } catch (failure) {
      $('download-status').textContent = failure.message || 'Your browser could not create the TXT download. Try again.';
    }
    $('download-status').hidden = false;
  });
  // Leaving the page cannot leave a preparation timer running in a suspended page.
  window.addEventListener('pagehide',() => {
    if (engine.getState().phase === 'shuffling') engine.stopShuffling();
    for (const url of exportUrls) URL.revokeObjectURL(url);
    exportUrls.clear();
  });
  const runePreparation = window.RunePreparation.create({
    onChange:() => { if (divinationShell) divinationShell.update(); },
    requestReset:() => divinationShell.resetRunePreparation()
  });
  divinationShell = window.DivinationShell.create({
    getRuneStatus:runePreparation.getStatus,
    resetRunes:runePreparation.reset,
    focusRunes:runePreparation.focus,
    resetTarot,
    getTarotStatus() {
      const state = engine.getState();
      const spread = window.TarotSpreads.find(item => item.id === state.settings.spreadId);
      const revealed = state.phase === 'reading' ? engine.getRevealed() : [];
      const count = spread.revealOrder.filter(number => revealed.includes(number)).length;
      return {
        hasSession:tarotDraftEdited || state.hasShuffled || state.phase !== 'preparing' || Boolean($('intention').value || $('favorite-numbers').value || $('use-color').checked || state.settings.reversals || state.settings.spreadId !== 'mystic-seven'),
        mode:spread.name,phase:state.phase,progress:`${count} of ${spread.dealtCardCount} revealed`,
        completed:state.phase === 'reading' && count === spread.dealtCardCount,
        canDownload:state.phase === 'reading' && count === spread.dealtCardCount,
        canNavigate:state.phase !== 'shuffling'
      };
    }
  });
  for (const event of ['input','change']) $('tarot-branch').addEventListener(event,() => {
    tarotDraftEdited = true;
    divinationShell.update();
  });
  syncPreparation();
})();

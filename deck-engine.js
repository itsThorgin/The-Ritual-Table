/* Deck mechanics only. No DOM, persistence, network access, or interpretation. */
(() => {
  'use strict';
  const UINT32_RANGE = 2 ** 32;
  const GATHERING_ORDERS = freeze([[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]);
  const RANDOM_ERROR = 'Your browser’s secure random generator is unavailable. The deck has not been changed. Try a browser with crypto.getRandomValues support.';
  function freeze(value) {
    if (value && typeof value === 'object') {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
    return value;
  }
  function randomIndex(bound) {
    if (!Number.isInteger(bound) || bound < 1 || bound > UINT32_RANGE) throw new Error('Invalid shuffle index bound.');
    // Reject the incomplete final bucket before reducing to an index: no modulo bias.
    const limit = UINT32_RANGE - UINT32_RANGE % bound;
    const word = new Uint32Array(1);
    do {
      try {
        if (typeof globalThis.crypto?.getRandomValues !== 'function') throw new Error('Missing secure randomness.');
        globalThis.crypto.getRandomValues(word);
      } catch {
        throw new Error(RANDOM_ERROR);
      }
    } while (word[0] >= limit);
    return word[0] % bound;
  }
  function create(onChange = () => {}) {
    const cards = window.TarotDeck.cards;
    const spreads = window.TarotSpreads;
    const ids = cards.map(card => card.id);
    if (ids.length !== 78 || new Set(ids).size !== 78) throw new Error('The deck must contain 78 unique cards.');
    let settings = freeze({spreadId:'mystic-seven',signifierId:null,reversals:false,question:''});
    let phase = 'preparing';
    let order = ids.slice();
    let shuffleCount = 0;
    let operations = [];
    let ritual = {enabled:false,completedRounds:0,shuffleBaseline:0};
    let timer = null;
    let epoch = 0;
    let reading = null;
    let revealed = new Set();
    let error = '';
    const ritualState = () => ({...ritual,stage:!ritual.enabled ? 'off' : ritual.completedRounds === 6 ? 'complete' : shuffleCount <= ritual.shuffleBaseline ? 'shuffle' : phase === 'shuffling' ? 'stop' : 'cut'});
    const getState = () => freeze({phase,settings,shuffleCount,hasShuffled:shuffleCount > 0,deckSize:order.length,error,secureRandomAvailable:typeof globalThis.crypto?.getRandomValues === 'function',cutCount:operations.filter(op => op.type === 'cut').length,touchCount:operations.filter(op => op.type === 'touches').length,ritual:ritualState()});
    const notify = () => onChange(getState());
    const spreadFor = () => spreads.find(spread => spread.id === settings.spreadId);
    function requireUnlocked() {
      if (phase === 'reading') throw new Error('This deck is locked. Start a new reading to prepare another deck.');
    }
    function requireIdle() {
      requireUnlocked();
      if (phase === 'shuffling') throw new Error('Stop shuffling before changing preparation settings.');
    }
    function requirePrepared() {
      requireIdle();
      if (!shuffleCount) throw new Error('Shuffle and stop before cutting or applying personal touches.');
    }
    function cancelTimer() {
      ++epoch; // Invalidate callbacks already queued, including callbacks from an earlier preparation.
      if (timer !== null) globalThis.clearTimeout(timer);
      timer = null;
    }
    function resetOrder() {
      order = ids.filter(id => id !== settings.signifierId);
      shuffleCount = 0;
      operations = [];
      ritual = {enabled:ritual.enabled && settings.spreadId === 'celtic-cross',completedRounds:0,shuffleBaseline:0};
      error = '';
    }
    function configure(options) {
      requireIdle();
      const spread = spreads.find(item => item.id === options.spreadId);
      if (!spread) throw new Error('Choose a supported spread.');
      if (typeof options.reversals !== 'boolean' || typeof options.question !== 'string' || options.question.length > 500) throw new Error('Invalid preparation settings.');
      const signifierId = spread.chosenCardCount ? options.signifierId : null;
      if (spread.chosenCardCount && !ids.includes(signifierId)) throw new Error('Choose a signifying card from this deck.');
      const reset = settings.spreadId !== spread.id || settings.signifierId !== signifierId;
      settings = freeze({spreadId:spread.id,signifierId,reversals:options.reversals,question:options.question.trim()});
      if (reset) resetOrder();
      error = '';
      notify();
    }
    function shufflePass() {
      // Commit only a complete pass, so a random-source failure cannot leave a partial shuffle.
      const next = order.slice();
      for (let i = next.length - 1; i > 0; --i) {
        const j = randomIndex(i + 1);
        [next[i],next[j]] = [next[j],next[i]];
      }
      order = next;
      ++shuffleCount;
      error = '';
    }
    function cycle(token) {
      if (phase !== 'shuffling' || token !== epoch) return;
      try {
        shufflePass();
        timer = globalThis.setTimeout(() => cycle(token),180);
      } catch (failure) {
        cancelTimer();
        phase = 'preparing';
        error = failure.message;
      }
      notify();
    }
    function startShuffling() {
      requireIdle();
      try {
        shufflePass();
      } catch (failure) {
        error = failure.message;
        notify();
        throw failure;
      }
      phase = 'shuffling';
      const token = ++epoch;
      timer = globalThis.setTimeout(() => cycle(token),180);
      notify();
    }
    function stopShuffling() {
      requireUnlocked();
      cancelTimer();
      phase = 'preparing';
      notify();
    }
    function randomCutChoices() {
      requirePrepared();
      // Two distinct boundaries, uniformly selected: every three-pile split is equally likely.
      const first = randomIndex(order.length - 1) + 1;
      let second = randomIndex(order.length - 2) + 1;
      if (second >= first) ++second;
      const a = Math.min(first,second), b = Math.max(first,second);
      return freeze({sizes:[a,b-a,order.length-b],gatheringOrder:GATHERING_ORDERS[randomIndex(6)].slice()});
    }
    function cutDeck(sizes,gatheringOrder) {
      requirePrepared();
      if (!Array.isArray(sizes) || sizes.length !== 3 || !sizes.every(size => Number.isInteger(size) && size > 0) || sizes.reduce((sum,size) => sum + size,0) !== order.length) throw new Error(`Choose three nonempty piles totaling ${order.length} cards.`);
      if (!Array.isArray(gatheringOrder) || gatheringOrder.length !== 3 || new Set(gatheringOrder).size !== 3 || !gatheringOrder.every(index => Number.isInteger(index) && index >= 0 && index <= 2)) throw new Error('Choose a gathering order using A, B and C exactly once.');
      const piles = [order.slice(0,sizes[0]),order.slice(sizes[0],sizes[0]+sizes[1]),order.slice(sizes[0]+sizes[1])];
      order = gatheringOrder.flatMap(index => piles[index]);
      const operation = freeze({type:'cut',sizes:sizes.slice(),gatheringOrder:gatheringOrder.slice(),shufflePass:shuffleCount});
      operations.push(operation);
      if (ritual.enabled && ritual.completedRounds < 6 && shuffleCount > ritual.shuffleBaseline) {
        ++ritual.completedRounds;
        ritual.shuffleBaseline = shuffleCount;
      }
      error = '';
      notify();
      return operation;
    }
    function applyTouches({color = null,numbers = []} = {}) {
      requirePrepared();
      if (color !== null && (typeof color !== 'string' || !/^#[0-9a-f]{6}$/i.test(color))) throw new Error('Choose a valid color or leave it off.');
      if (!Array.isArray(numbers) || numbers.length > 12 || !numbers.every(number => Number.isSafeInteger(number) && number >= 0 && number <= 999999999999999)) throw new Error('Use up to 12 whole numbers, each with at most 15 digits.');
      if (color === null && !numbers.length) return null;
      let rotation = color === null ? 0 : parseInt(color.slice(1),16) % order.length;
      for (const number of numbers) rotation = (rotation + number % order.length) % order.length;
      // A fixed rotation is a permutation of the existing uniform deck, without meaning weights.
      order = order.slice(rotation).concat(order.slice(0,rotation));
      const operation = freeze({type:'touches',color:color === null ? null : color.toLowerCase(),numbers:numbers.slice(),rotation,shufflePass:shuffleCount});
      operations.push(operation);
      error = '';
      notify();
      return operation;
    }
    function setRitualGuide(enabled) {
      requireIdle();
      if (typeof enabled !== 'boolean' || (enabled && settings.spreadId !== 'celtic-cross')) throw new Error('The six-round guide is available for the Celtic Cross.');
      if (enabled !== ritual.enabled) ritual = {enabled,completedRounds:0,shuffleBaseline:shuffleCount};
      error = '';
      notify();
    }
    function beginReading() {
      requireUnlocked();
      if (!shuffleCount) throw new Error('Shuffle the deck before beginning your reading.');
      if (ritual.enabled && ritual.completedRounds < 6) throw new Error('Complete the six ritual rounds, or stop shuffling and turn off the optional guide to read now.');
      cancelTimer();
      phase = 'preparing';
      try {
        // Every undealt card gets its final orientation too. No orientation is decided on reveal.
        const deck = order.map(id => ({id,reversed:settings.reversals ? randomIndex(2) === 1 : false}));
        const signifier = settings.signifierId ? {id:settings.signifierId,reversed:false} : null;
        const spread = spreadFor();
        let deckIndex = 0;
        const assignments = spread.placementOrder.map(position => {
          if (position === 0 && signifier) return {position,cardId:signifier.id,reversed:false,deckIndex:null};
          const entry = deck[deckIndex];
          return {position,cardId:entry.id,reversed:entry.reversed,deckIndex:deckIndex++};
        });
        reading = freeze({version:1,settings,deck,signifier,assignments,preparation:{shuffleCount,operations:operations.slice(),ritual:ritualState()}});
        revealed = new Set(signifier ? [0] : []);
        phase = 'reading';
        error = '';
      } catch (failure) {
        error = failure.message;
        notify();
        throw failure;
      }
      notify();
      return reading;
    }
    function requireReading() {
      if (phase !== 'reading' || !reading) throw new Error('Begin a reading first.');
    }
    function revealNext() {
      requireReading();
      const number = spreadFor().revealOrder.find(position => !revealed.has(position));
      if (number === undefined) return null;
      revealed.add(number);
      return reading.assignments.find(assignment => assignment.position === number);
    }
    function inspect(number) {
      requireReading();
      return revealed.has(number) ? reading.assignments.find(assignment => assignment.position === number) || null : null;
    }
    function newReading() {
      requireReading();
      cancelTimer();
      reading = null;
      revealed = new Set();
      phase = 'preparing';
      resetOrder();
      notify();
    }
    return Object.freeze({
      configure,startShuffling,stopShuffling,randomCutChoices,cutDeck,applyTouches,setRitualGuide,beginReading,revealNext,inspect,newReading,getState,
      getReading:() => reading,
      getRevealed:() => Object.freeze(Array.from(revealed)),
      getPreparedOrder:() => Object.freeze(order.slice())
    });
  }
  window.TarotEngine = Object.freeze({create});
})();

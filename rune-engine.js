/* Private Rune preparation and deterministic reveals. No DOM, storage or networking. */
(() => {
  'use strict';
  const IDS = Object.freeze(['fehu','uruz','thurisaz','ansuz','raidho','kaunan','gebo','wunjo','hagalaz','nauthiz','isa','jera','eihwaz','perthro','algiz','sowilo','tiwaz','berkano','ehwaz','mannaz','laguz','ingwaz','dagaz','othala']);
  const RANGE = 2 ** 32;
  function freeze(value) {
    if (value && typeof value === 'object') {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
    return value;
  }
  function randomIndex(bound) {
    const limit = RANGE - RANGE % bound;
    const word = new Uint32Array(1);
    do {
      try {
        if (typeof globalThis.crypto?.getRandomValues !== 'function') throw new Error();
        globalThis.crypto.getRandomValues(word);
      } catch {
        throw new Error('Secure shuffling failed. Your last completed preparation is unchanged. Retry when secure randomness is available.');
      }
    } while (word[0] >= limit);
    return word[0] % bound;
  }
  function create(onChange = () => {}) {
    if (typeof onChange !== 'function') throw new Error('Invalid Rune change handler.');
    const modes = window.RuneModes;
    if (!Array.isArray(modes) || modes.length !== 5 || IDS.length !== 24 || new Set(IDS).size !== 24) throw new Error('Rune definitions are unavailable.');
    let settings = freeze({modeId:'daily',question:'',reversals:false});
    let phase = 'preparing';
    let order = IDS.slice();
    let picks = [];
    let shuffleCount = 0;
    let operations = [];
    let reading = null;
    let revealed = new Set();
    let error = '';
    let timer = null;
    let epoch = 0;
    const modeFor = () => modes.find(mode => mode.id === settings.modeId);
    const canBegin = () => shuffleCount > 0 && (settings.modeId === 'norns' ? phase === 'selecting' && picks.length === 3 : phase === 'preparing');
    const getState = () => freeze({
      phase,settings,shuffleCount,hasShuffled:shuffleCount > 0,lotCount:24,error,
      secureRandomAvailable:typeof globalThis.crypto?.getRandomValues === 'function',
      canBegin:canBegin(),
      revealedCount:revealed.size,totalRoles:modeFor().count,
      nextRoleNumber:phase === 'reading' && revealed.size < reading.assignments.length ? revealed.size + 1 : null,
      complete:phase === 'reading' && revealed.size === reading.assignments.length,
      canSelect:settings.modeId === 'norns' && shuffleCount > 0 && (phase === 'preparing' || phase === 'selecting') && picks.length < 3,
      picks:picks.map((pick,index) => ({lotIndex:pick.lotIndex,roleNumber:index + 1}))
    });
    const notify = () => { if (phase !== 'disposed') onChange(getState()); };
    function requireAlive() {
      if (phase === 'disposed') throw new Error('This Rune preparation has been disposed.');
    }
    function requirePreparing() {
      requireAlive();
      if (phase !== 'preparing') throw new Error(phase === 'shuffling' ? 'Stop shuffling before changing preparation.' : 'Preparation is locked. Reset explicitly to prepare again.');
    }
    function cancelTimer() {
      ++epoch;
      if (timer !== null) globalThis.clearTimeout(timer);
      timer = null;
    }
    function configure(options) {
      requirePreparing();
      const mode = modes.find(item => item.id === options?.modeId);
      if (!mode || typeof options.question !== 'string' || options.question.length > 500) throw new Error('Choose a supported Rune mode and a question of at most 500 characters.');
      settings = freeze({modeId:mode.id,question:options.question,reversals:false});
      error = '';
      notify();
    }
    function shufflePass() {
      const next = order.slice();
      for (let i = next.length - 1; i > 0; --i) {
        const j = randomIndex(i + 1);
        [next[i],next[j]] = [next[j],next[i]];
      }
      order = next;
      ++shuffleCount;
      operations.push({type:'shuffle',pass:shuffleCount});
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
      requirePreparing();
      try { shufflePass(); }
      catch (failure) { error = failure.message; notify(); throw failure; }
      phase = 'shuffling';
      const token = ++epoch;
      timer = globalThis.setTimeout(() => cycle(token),180);
      notify();
    }
    function stopShuffling() {
      requireAlive();
      if (phase !== 'shuffling') throw new Error('There is no active Rune shuffle to stop.');
      cancelTimer();
      phase = 'preparing';
      notify();
    }
    function selectLot(lotIndex) {
      requireAlive();
      if (!getState().canSelect) throw new Error('Stop a prepared Three Norns shuffle before choosing up to three lots.');
      if (!Number.isInteger(lotIndex) || lotIndex < 0 || lotIndex >= 24 || picks.some(pick => pick.lotIndex === lotIndex)) throw new Error('Choose a distinct concealed lot from this arrangement.');
      picks.push({lotIndex,runeId:order[lotIndex]});
      phase = 'selecting';
      error = '';
      notify();
      return freeze({lotIndex,roleNumber:picks.length});
    }
    function beginReading() {
      requireAlive();
      if (!canBegin()) throw new Error('Shuffle and stop first; Three Norns requires three concealed picks before Begin.');
      const mode = modeFor();
      const lots = settings.modeId === 'norns' ? picks.map((pick,index) => ({roleNumber:index + 1,...pick})) : mode.roles.map((role,index) => ({roleNumber:role.number,lotIndex:index,runeId:order[index]}));
      if (order.length !== 24 || new Set(order).size !== 24 || !order.every(id => IDS.includes(id)) || lots.length !== mode.count || new Set(lots.map(lot => lot.lotIndex)).size !== mode.count || new Set(lots.map(lot => lot.runeId)).size !== mode.count || !lots.every((lot,index) => Number.isInteger(lot.lotIndex) && lot.lotIndex >= 0 && lot.lotIndex < 24 && order[lot.lotIndex] === lot.runeId && lot.roleNumber === mode.roles[index].number)) throw new Error('The prepared Rune assignments are inconsistent. Preparation has not been changed.');
      const snapshot = freeze({
        version:1,tradition:'runes',settings:{...settings},fullOrder:order.slice(),
        arrangement:{version:1,layoutId:mode.id,lotPlaces:order.map((_,index) => index),roles:mode.roles.map(role => ({...role}))},
        selection:{method:settings.modeId === 'norns' ? 'manual-three' : 'first-n',lots},
        assignments:lots.map((lot,index) => ({roleNumber:lot.roleNumber,roleId:mode.roles[index].roleId,runeId:lot.runeId,orderIndex:lot.lotIndex})),
        preparation:{shuffleCount,operations:operations.map(operation => ({...operation}))}
      });
      cancelTimer();
      reading = snapshot;
      revealed = new Set();
      phase = 'reading';
      error = '';
      notify();
      return reading;
    }
    function revealNext() {
      requireAlive();
      if (phase !== 'reading') throw new Error('Begin a Rune reading before revealing.');
      const assignment = reading.assignments[revealed.size];
      if (!assignment) return null;
      revealed.add(assignment.roleNumber);
      notify();
      return assignment;
    }
    function inspect(roleNumber) {
      requireAlive();
      if (phase !== 'reading') throw new Error('Begin a Rune reading before inspecting.');
      return Number.isInteger(roleNumber) && revealed.has(roleNumber) ? reading.assignments[roleNumber - 1] : null;
    }
    const getRevealed = () => Object.freeze([...revealed]);
    function resetPreparation() {
      requireAlive();
      if (phase === 'shuffling') throw new Error('Stop shuffling before resetting preparation.');
      cancelTimer();
      order = IDS.slice();
      picks = [];
      shuffleCount = 0;
      operations = [];
      reading = null;
      revealed = new Set();
      error = '';
      phase = 'preparing';
      notify();
    }
    function dispose() {
      cancelTimer();
      phase = 'disposed';
      order = IDS.slice();
      picks = [];
      reading = null;
      revealed = new Set();
      operations = [];
      shuffleCount = 0;
      error = '';
    }
    return Object.freeze({configure,startShuffling,stopShuffling,selectLot,beginReading,revealNext,inspect,getRevealed,resetPreparation,getState,getReading:() => reading,dispose});
  }
  window.RuneEngine = Object.freeze({create});
})();

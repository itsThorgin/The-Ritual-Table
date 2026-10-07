/* Explicit completed-reading archive, independent of DOM, storage and entropy. */
(() => {
  'use strict';
  function build(snapshot,revealedNumbers,exportedAt = new Date()) {
    const reading = window.RuneReading.build(snapshot,revealedNumbers);
    if (!reading?.complete) throw new Error('Reveal every rune before downloading your reading.');
    const model = window.RuneInterpretation.build(reading);
    const invalid = () => { throw new Error('The saved Rune preparation record is inconsistent.'); };
    const {preparation,selection,fullOrder,assignments,arrangement} = snapshot;
    if (!Array.isArray(fullOrder) || fullOrder.length !== 24 || new Set(fullOrder).size !== 24 ||
      !Array.from(fullOrder).every(id => window.RuneVisuals.glyphs.some(rune => rune.id === id)) ||
      !Array.isArray(arrangement.lotPlaces) || arrangement.lotPlaces.length !== 24 || !Array.from(arrangement.lotPlaces).every((place,index) => place === index) ||
      !preparation || !Number.isSafeInteger(preparation.shuffleCount) || preparation.shuffleCount < 1 ||
      !Array.isArray(preparation.operations) || preparation.operations.length !== preparation.shuffleCount ||
      !Array.from(preparation.operations).every((operation,index) => operation?.type === 'shuffle' && operation.pass === index + 1) ||
      !selection || selection.method !== (model.modeId === 'norns' ? 'manual-three' : 'first-n') ||
      !Array.isArray(selection.lots) || selection.lots.length !== model.total) invalid();
    const places = new Set();
    for (let index = 0; index < model.total; ++index) {
      const lot = selection.lots[index],assignment = assignments[index];
      if (!lot || lot.roleNumber !== index + 1 || !Number.isInteger(lot.lotIndex) || lot.lotIndex < 0 || lot.lotIndex >= 24 ||
        places.has(lot.lotIndex) || lot.runeId !== fullOrder[lot.lotIndex] || assignment.runeId !== lot.runeId || assignment.orderIndex !== lot.lotIndex ||
        (selection.method === 'first-n' && lot.lotIndex !== index)) invalid();
      places.add(lot.lotIndex);
    }
    const date = new Date(exportedAt);
    if (Number.isNaN(date.getTime()) || exportedAt === null) throw new Error('The export date is unavailable.');
    const pad = number => String(number).padStart(2,'0');
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const offset = -date.getTimezoneOffset(),sign = offset >= 0 ? '+' : '-';
    const hours = pad(Math.floor(Math.abs(offset) / 60)),minutes = pad(Math.abs(offset) % 60);
    const lines = ['ELDER FUTHARK · REFLECTIVE READING','',`Exported: ${day} ${time} (UTC${sign}${hours}:${minutes}, your local time)`,
      `Mode: ${model.name}`,`Adaptation context: ${model.context}`,'For fun and reflection.','',
      ...(model.question === '' ? ['Question or intention: none supplied'] : ['QUESTION / INTENTION',...model.question.split(/\r\n|\r|\n/).map(line => `  ${line}`)]),'',
      window.RuneInterpretation.toText(model),
      'FROZEN PREPARATION','----------------------------------------','Bag: 24 unique Elder Futhark runes; no blank rune.','Orientation: all upright.',
      `Complete shuffle passes: ${preparation.shuffleCount}`,`Selection: ${selection.method === 'manual-three' ? 'Three concealed lots picked before Begin, in role order.' : 'First N lots assigned before Begin, in role order.'}`,
      ...selection.lots.map(lot => `Position ${lot.roleNumber}: concealed lot ${lot.lotIndex + 1}`),
      `Recorded operations: The bag was shuffled ${preparation.shuffleCount} ${preparation.shuffleCount === 1 ? 'time' : 'times'} before Begin.`,'',
      'This TXT is an archive. Closing or refreshing clears the in-memory reading; this file cannot restore it.','',
      'BIBLIOGRAPHY · SELECTED ENTRIES ONLY'];
    const cited = new Set(model.positions.flatMap(position => Object.values(position.interpretation.sourceReferences).flat().map(ref => ref.sourceId)));
    for (const source of window.RuneCatalogue.sources.filter(source => cited.has(source.id))) lines.push(`[${source.id}] ${source.title}`,source.edition,source.url,'');
    return Object.freeze({filename:`elder-futhark-${model.modeId}-${day}_${time.replace(/:/g,'-')}_UTC${sign}${hours}${minutes}.txt`,text:lines.join('\r\n')});
  }
  window.RuneReadingExport = Object.freeze({build});
})();

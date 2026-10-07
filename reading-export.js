/* Plain-text record of a completed reading. No entropy, storage, DOM, or requests. */
(() => {
  'use strict';
  function build(snapshot,revealed,exportedAt = new Date()) {
    const spread = window.TarotSpreads.find(item => item.id === snapshot?.settings?.spreadId);
    if (!snapshot || !spread) throw new Error('Begin a reading before downloading it.');
    const visible = new Set(revealed);
    if (!spread.placementOrder.every(number => visible.has(number))) throw new Error('Reveal every card before downloading your reading.');
    const date = new Date(exportedAt);
    if (Number.isNaN(date.getTime())) throw new Error('The export date is unavailable.');
    const pad = number => String(number).padStart(2,'0');
    const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    // Device-local time and the offset at this instant include daylight-saving changes.
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);
    const timeZone = `UTC${offsetSign}${offsetHours}:${offsetMinutes}`;
    const cards = new Map(window.TarotDeck.cards.map(card => [card.id,card]));
    const preparation = snapshot.preparation;
    const operations = preparation.operations;
    const lines = [
      'THE GOTHIC TAROT',
      'READING RECORD',
      '',
      `Exported: ${stamp.replace('T',' ')} (${timeZone}, your local time)`,
      `Spread: ${spread.name}`,
      `Purpose (handbook): ${spread.purposeFromManual}`,
      'For fun and reflection.',
      '',
      'QUESTION / INTENTION',
      ...snapshot.settings.question.split(/\r\n|\r|\n/).map(line => `  ${line || (snapshot.settings.question ? '' : '(No question entered.)')}`),
      '',
      'CARDS IN THIS READING',
      ''
    ];
    // Export assigned positions only, never unused deck identities or an unrevealed card.
    for (const number of spread.placementOrder) {
      const assignment = snapshot.assignments.find(item => item.position === number);
      const position = spread.positions.find(item => item.number === number);
      const card = cards.get(assignment?.cardId);
      if (!card || !position) throw new Error('This reading contains an unavailable card or position.');
      const orientation = assignment.reversed ? 'Reversed' : 'Upright';
      const suit = window.TarotDeck.suits.find(item => item.id === card.suit);
      lines.push(
        '----------------------------------------',
        `Position ${number}: ${position.label}`,
        `Position meaning (handbook): ${position.meaningFromManual}`,
        `Card: ${card.name}`,
        `Family: ${card.family === 'major' ? `Major Arcana (${card.index})` : `Minor Arcana - ${suit.name} (${suit.element})`}`,
        `Orientation: ${orientation}${number === 0 ? ' (chosen signifier)' : ''}`,
        `Handbook meaning (${orientation.toLowerCase()}):`,
        `  ${card.meanings[orientation.toLowerCase()]}`,
        `Source: ${window.TarotDeck.title}, handbook page ${card.source.printedPage}`,
        ''
      );
    }
    lines.push(
      'PREPARATION RECORD',
      '----------------------------------------',
      `Shuffled cards: ${snapshot.deck.length}${snapshot.signifier ? '; one signifier reserved separately' : ''}`,
      `Reversals: ${snapshot.settings.reversals ? 'enabled, independent 50% chance before locking' : 'off'}`,
      `Complete shuffle passes: ${preparation.shuffleCount}`,
      `Three-pile gatherings: ${operations.filter(operation => operation.type === 'cut').length}`,
      `Personal-touch applications: ${operations.filter(operation => operation.type === 'touches').length}`
    );
    if (snapshot.signifier) lines.push(`Celtic ritual guide: ${preparation.ritual.enabled ? `enabled, ${preparation.ritual.completedRounds} of 6 rounds completed` : 'off'}`);
    lines.push('','Applied choices in order:');
    if (!operations.length) lines.push('  No cuts or personal touches applied.');
    operations.forEach((operation,index) => {
      lines.push(`  ${index + 1}. After shuffle pass ${operation.shufflePass}:`);
      if (operation.type === 'cut') lines.push(
        `     Pile sizes: A ${operation.sizes[0]}, B ${operation.sizes[1]}, C ${operation.sizes[2]}.`,
        `     Gathered top to bottom: ${operation.gatheringOrder.map(pile => 'ABC'[pile]).join(' -> ')}.`
      );
      else if (operation.type === 'touches') lines.push(
        `     Color: ${operation.color || '(not used)'}.`,
        `     Favorite numbers: ${operation.numbers.length ? operation.numbers.join(', ') : '(none)'}.`,
        `     Moved ${operation.rotation} cards from the top to the bottom of the deck.`
      );
    });
    const reflection = window.TarotInterpretation.build(snapshot,revealed);
    if (reflection) lines.push('',window.TarotInterpretation.toText(reflection));
    lines.push(
      '',
      'All cards and their orientations were fixed before the reading began.',
      reflection ? 'Handbook meanings are kept separate from the app-authored reflections above.' : 'This report records handbook meanings and spread positions.',
      'This text is an archive; it cannot be imported to resume the app.',
      ''
    );
    return Object.freeze({
      filename:`gothic-tarot-${spread.id}-${stamp.replace('T','_').replaceAll(':','-')}_UTC${offsetSign}${offsetHours}${offsetMinutes}.txt`,
      text:lines.join('\r\n')
    });
  }
  window.TarotReadingExport = Object.freeze({build});
})();

/* Deterministic reflection from validated revealed positions only. */
(() => {
  'use strict';
  const NOTE = 'These prompts connect the saved runes and their reflective roles. Consider what fits your experience, and leave aside what does not.';
  const CLOSING = 'Which observation fits your experience, and what manageable response would you like to try? You can leave aside anything that does not fit.';
  const group = (id,title,primaryNumbers,anchorNumber,rolePrompt) => ({id,title,primaryNumbers,anchorNumber,rolePrompt});
  const GROUPS = {
    daily:[],
    norns:[
      group('roots-present','Roots and Present',[1,2],null,'How might earlier choices or circumstances relate to what is unfolding now? Consider both runes without assuming that one caused the other.'),
      group('present-responsibility','Present and Responsibility',[2,3],null,'What response or obligation deserves consideration alongside what is unfolding now? Which part is within your influence?')
    ],
    elemental:[
      group('foundations-understanding','Foundations and Understanding',[2,3],1,'How might practical support and clearer understanding inform the central concern? Consider what needs care and what needs clearer thought or communication.'),
      group('motivation-feeling','Motivation and Feeling',[4,5],1,'How might energy for action and feelings or relationships inform the central concern? What pace or response would account for both?')
    ],
    counsels:[
      group('resolve-discernment','Resolve and Discernment',[1,2],null,'What deserves effort, and what needs closer scrutiny before you commit? Consider whether these runes suggest a useful question about how to direct your effort.'),
      group('care-repair','Care and Repair',[3,5],null,'What needs nurturing or protection, and what needs mending? Where might care support repair, or repair make care easier?'),
      group('journey-wisdom','Journey and Wisdom',[4,7],null,'What needs understanding as you navigate change? Consider whether a practical step and a clearer perspective could support each other.')
    ],
    worlds:[
      group('stillness-drive','Stillness and Drive',[2,3],1,'What is stable or difficult to move, and what fuels action? In ordinary life, what response could account for both without exhausting your reserves?'),
      group('nourishment-challenge','Nourishment and Challenge',[4,5],1,'What sustains growth and reciprocity, and what demands adaptation or firmer boundaries? How could you consider both in an ordinary action or relationship?'),
      group('perspective-inner-work','Perspective and Inner work',[6,7],1,'What wider perspective and what examination of a habit, memory or skill might help? Where could either make a practical difference in ordinary life?'),
      group('values-inheritance','Values and Inheritance',[8,9],1,'Which commitments do you want to act from, and which received expectations or past experiences still shape your view? What would you keep or reconsider in ordinary life?')
    ]
  };
  const PAIRS = {
    'fehu|jera':'How are your resources connected to something you have been tending over time? What is ready to gather, and what still needs care?',
    'fehu|nauthiz':'Where do available resources meet a need or limitation? What could be prioritized, shared or simplified?',
    'jera|nauthiz':'Which needs cannot wait, and which changes need time? How could you account for both?'
  };
  const INVITATIONS = {
    daily:"Which of this rune's three questions would you like to carry into today?",
    norns:'What, if anything, connects Roots, Present and Responsibility for you?',
    elemental:'Which observations about Foundations, Understanding, Motivation or Feeling help you consider the central Situation?',
    counsels:'Alongside Speech, what from Resolve, Discernment, Care, Journey, Repair or Wisdom would be useful to express or hear?',
    worlds:'Which thread, if any, has a practical bearing on Daily life?'
  };
  function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  }
  freeze(GROUPS);freeze(PAIRS);freeze(INVITATIONS);
  function build(model) {
    if (model === null) return null;
    const invalid = () => { throw new Error('The revealed Rune reflection is inconsistent.'); };
    const mode = window.RuneModes.find(item => item.id === model?.modeId);
    const layout = window.RuneLayouts.find(item => item.id === model?.layoutId);
    if (!mode || !layout || model.layoutId !== mode.id || model.layoutVersion !== layout.version || model.rows !== layout.rows ||
      model.name !== mode.name || model.context !== mode.context || typeof model.question !== 'string' || model.question.length > 500 ||
      model.total !== mode.count || !Number.isInteger(model.count) || model.count < 0 || model.count > mode.count ||
      model.complete !== (model.count === mode.count) || model.next !== (model.complete ? null : model.count + 1) ||
      !Array.isArray(model.positions) || model.positions.length !== mode.count || window.RuneCatalogue.version !== 1) invalid();
    const identities = new Set();
    const positions = Array.from(model.positions,(position,index) => {
      const role = mode.roles[index],place = layout.positions[index];
      if (!position || !['number','roleId','label','question'].every(key => position[key] === role[key]) ||
        position.column !== place.column || position.row !== place.row || position.revealed !== (index < model.count) ||
        position.next !== (position.number === model.next)) invalid();
      let rune = null,interpretation = null;
      if (position.revealed) {
        const identity = window.RuneVisuals.glyphs.find(item => item.id === position.rune?.id);
        const entry = window.RuneCatalogue.entries.find(item => item.id === identity?.id);
        if (!identity || !entry || position.rune.name !== identity.name || position.rune.glyph !== identity.glyph || identities.has(identity.id)) invalid();
        identities.add(identity.id);
        const refs = entry.sourceReferences;
        if (!Object.values(refs).flat().every(ref => window.RuneCatalogue.sources.some(source => source.id === ref.sourceId) && ref.locator)) invalid();
        rune = {id:identity.id,name:identity.name,glyph:identity.glyph};
        interpretation = {nameImage:entry.nameImage,historicalRoots:entry.historicalRoots,backgroundName:entry.backgroundName,
          themes:entry.themes,reflection:entry.reflection,questions:entry.questions,
          // Preserve raw catalogue text; omit only superseded approval bookkeeping in presentation.
          adaptationNote:entry.adaptationNote.replace(' Display choice and reflection await review.','').replace("Retains the R2 sample's original wording. ",''),sourceReferences:refs,
          positionInvitation:`Consider ${entry.themes[0]}, ${entry.themes[1]} and ${entry.themes[2]} alongside this position question. Which, if any, helps you reflect on your situation?`};
      } else if (position.rune !== null) invalid();
      return {...role,column:place.column,row:place.row,revealed:position.revealed,next:position.next,rune,interpretation};
    });
    const reference = number => {
      const position = positions[number - 1];
      return {number:position.number,label:position.label,rune:position.rune,themes:position.interpretation.themes};
    };
    let threads = null,recap = null;
    if (model.complete) {
      threads = {note:NOTE,groups:GROUPS[mode.id].map(definition => {
        const members = definition.primaryNumbers.map(reference);
        const pairKey = members.map(member => member.rune.id).sort().join('|');
        return {...definition,members,anchor:definition.anchorNumber ? reference(definition.anchorNumber) : null,pairPrompt:PAIRS[pairKey] || null};
      }),dailyQuestions:mode.id === 'daily' ? positions[0].interpretation.questions : null};
      recap = {references:positions.map(position => reference(position.number)),modeInvitation:INVITATIONS[mode.id],closingInvitation:CLOSING};
    }
    return freeze({modeId:mode.id,name:mode.name,context:mode.context,question:model.question,layoutId:layout.id,
      layoutVersion:layout.version,rows:layout.rows,count:model.count,total:mode.count,next:model.next,complete:model.complete,
      catalogueVersion:1,positions,threads,recap});
  }
  function sourceLine(reference) {
    const source = window.RuneCatalogue.sources.find(item => item.id === reference.sourceId);
    if (!source) throw new Error('A Rune source reference is unavailable.');
    return `[${source.id}] ${source.title} · ${reference.locator}`;
  }
  function toText(model) {
    const safe = build(model);
    if (!safe) return '';
    const lines = ['RUNES IN THIS READING',''];
    for (const position of safe.positions.filter(item => item.revealed)) {
      const detail = position.interpretation;
      lines.push('----------------------------------------',`Position ${position.number} · ${position.label}`,
        `Rune: ${position.rune.name} ${position.rune.glyph} · Upright`,'Name and historical image:',`  ${detail.nameImage}`,
        'Historical roots:',`  ${detail.historicalRoots}`);
      if (detail.backgroundName) lines.push(`  ${detail.backgroundName}`);
      for (const [field,refs] of Object.entries(detail.sourceReferences)) for (const ref of refs) lines.push(`  ${field === 'name' ? 'Name' : field === 'roots' ? 'Roots' : 'Adaptation'} source: ${sourceLine(ref)}`);
      lines.push('About this reflection:',`  ${detail.adaptationNote}`,'Original reflection:',`  Themes: ${detail.themes.join(', ')}`,`  ${detail.reflection}`,
        'Personal questions · original app content:',...detail.questions.map((question,index) => `  ${index + 1}. ${question}`),
        'Position question · original app content:',`  ${position.question}`,`  ${detail.positionInvitation}`,'');
    }
    if (safe.complete) {
      lines.push('ORIGINAL APP REFLECTION · THREADS TO CONSIDER',safe.threads.note,'');
      const describe = member => `Position ${member.number} · ${member.label}: ${member.rune.name} · ${member.themes.join(', ')}`;
      if (safe.threads.dailyQuestions) lines.push(describe(safe.recap.references[0]),...safe.threads.dailyQuestions.map((question,index) => `${index + 1}. ${question}`),'');
      for (const group of safe.threads.groups) {
        lines.push(group.title,...group.members.map(describe));
        if (group.anchor) lines.push(`Anchor: ${describe(group.anchor)}`);
        lines.push(`Original role reflection: ${group.rolePrompt}`);
        if (group.pairPrompt) lines.push(`Original pair reflection: ${group.pairPrompt}`);
        lines.push('');
      }
      lines.push('BRING IT BACK TO YOUR LIFE',...safe.recap.references.map(member => `${member.number} · ${member.label}: ${member.rune.name}`),safe.recap.modeInvitation,safe.recap.closingInvitation,'');
    }
    return lines.join('\r\n');
  }
  window.RuneInterpretation = Object.freeze({build,toText,sourceLine});
})();

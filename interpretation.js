/* Approved spread reflections: saved cards, source meanings and fixed prompts only. */
(() => {
  'use strict';
  const mysticRules = [
    null,
    {context:'Consider these themes as earlier experiences or patterns you may be leaving behind.',prompt:'Which of these themes describes something you have already experienced or are leaving behind?'},
    {context:'Consider these themes in the situation as you experience it now.',prompt:'Where do these themes appear in the situation as you experience it now?'},
    {context:'Consider these themes as possibilities ahead, distinct from the overall outcome.',prompt:'If these themes emerge next, what would you want to notice or prepare for?'},
    {context:'Consider a thoughtful response to these themes that could give you more control. Difficult themes invite examination or a response; they are not instructions to enact them.',prompt:'How could you respond thoughtfully to these themes and gain more control over the situation?'},
    {context:'Consider these themes in the people, circumstances or pressures surrounding the matter.',prompt:'Which people, circumstances or pressures around you might reflect these themes?'},
    {context:'Consider how these themes may inhibit progress. A quality can also be missing, difficult to access or relied on too heavily; use these as possible lenses while keeping the handbook meaning intact.',prompt:'How might these themes hinder you, and what could help you address them?'},
    {context:'Consider these themes as a possible overall direction in relation to your question.',prompt:'What would this possible outcome mean to you in relation to your question?'}
  ];
  const mysticConnections = [
    {title:'Timeline',numbers:[1,2,3],context:'Read the past, present and future meanings in sequence.',prompt:'What changes, and what seems to continue across these three positions?'},
    {title:'Surroundings and resistance',numbers:[5,6],context:'Read the surrounding influences alongside what may inhibit you.',prompt:'How might the surrounding influences make this obstacle easier or harder to address?'},
    {title:'Response',numbers:[4,6],context:'Read the advised qualities alongside what may inhibit you.',prompt:'How could the advised path help you respond to what inhibits you?'},
    {title:'Direction',numbers:[3,7],context:'Compare the possibilities ahead with the possible overall direction.',prompt:'How does the possible outcome relate to the future influences shown here?'}
  ];
  const celticRules = [
    {context:'Use the handbook themes as a lens for this deliberately chosen representative of the person at the center of the inquiry.',prompt:'What does this chosen card represent about the person at the center of the inquiry?'},
    {context:'Consider these themes in the current situation and the influences affecting the matter.',prompt:'Where do these themes appear in the present situation?'},
    {context:'Consider these themes as opposition or what inhibits progress; the source permits a person or an event. A quality may also be missing, difficult to access or relied on too heavily, without changing the handbook meaning.',prompt:'How might these themes represent opposition, and what could help you respond?'},
    {context:'Consider these themes as possible future influences, the highest state the inquirer may achieve, an ideal or standard of perfection, or what they ultimately wish to attain.',prompt:'How do these themes relate to what you hope to attain or to influences that may lie ahead?'},
    {context:'Consider these themes as earlier conditions or patterns influencing the matter.',prompt:'Which earlier influences might these themes bring to mind?'},
    {context:'Consider these themes in past events or circumstances the inquirer is moving away from.',prompt:'What might you be leaving behind, and what still deserves acknowledgment?'},
    {context:'Consider these themes as possible future influences, keeping the separate outcome position in view.',prompt:'If these themes emerge ahead, what would you want to notice or prepare for?'},
    {context:'Consider these themes in the inquirer’s stance toward the matter and how they affect the world. If the inquiry concerns somebody else, reflect on the represented person’s stance without assuming knowledge of their thoughts.',prompt:'How might these themes reflect your stance or the way you affect the situation?'},
    {context:'Consider these themes in the house or environment and the surrounding people or events influencing the inquirer.',prompt:'Which people or circumstances around you might reflect these themes?'},
    {context:'Consider these themes as the inquirer’s hopes or fears. A wish or worry is not evidence that the event will happen.',prompt:'Which of these themes might express a hope, a fear, or both?'},
    {context:'Consider these themes as possible future events and the overall outcome of the inquiry.',prompt:'What would this possible outcome mean in relation to the inquiry?'}
  ];
  const celticConnections = [
    {title:'You and the situation',numbers:[0,1,2],context:'Read the chosen representative alongside the present situation and opposition.',prompt:'How do the present influences and obstacles relate to the person represented by your chosen signifier?'},
    {title:'What is changing',numbers:[4,5,1,6],context:'Compare past influences and past events with the present and possible future influences. The two past positions describe different roles, not an ordered sequence of events.',prompt:'What might you be leaving behind, what still influences the present, and what may change ahead?'},
    {title:'Your stance and surroundings',numbers:[7,8],context:'Read the inquirer’s attitude alongside their environment.',prompt:'How might the inquirer\'s stance and surrounding circumstances affect one another?'},
    {title:'Wishes and worries',numbers:[3,9],context:'Read future influences and aspirations alongside hopes and fears, keeping their distinct roles.',prompt:'How might hopes or fears shape the way you view these aspirations and possible future influences?'},
    {title:'Direction',numbers:[3,6,10],context:'Compare future influences and aspirations, possible conditions ahead, and the overall outcome.',prompt:'How does the possible outcome relate to the aspirations and future influences shown here?'}
  ];
  const configurations = {
    'mystic-seven':{rules:mysticRules,connections:mysticConnections,recapNumbers:[2,6,4,7],recapContext:'Return to the handbook meanings of these four positions as you decide what deserves attention.'},
    'celtic-cross':{rules:celticRules,connections:celticConnections,recapNumbers:[0,1,2,7,10],recapContext:'Return to the handbook meanings of these five positions as you decide what deserves attention, remembering that the signifier was deliberately chosen.'}
  };
  const reference = entry => `Position ${entry.number} · ${entry.label}: ${entry.cardName} (${entry.orientation.toLowerCase()}${entry.chosenSignifier ? ', chosen signifier' : ''})`;
  function build(snapshot,revealed) {
    const spread = window.TarotSpreads.find(item => item.id === snapshot?.settings?.spreadId);
    const configuration = spread && configurations[spread.id];
    if (!configuration) return null;
    const visible = new Set(revealed);
    // Resolve only revealed assignments; incomplete results contain no hidden-card references.
    const positions = Object.freeze(spread.placementOrder.filter(number => visible.has(number)).map(number => {
      const assignment = snapshot.assignments.find(item => item.position === number);
      const card = window.TarotDeck.cards.find(item => item.id === assignment?.cardId);
      if (!card) throw new Error('This reflection contains an unavailable card.');
      const position = spread.positions.find(item => item.number === number);
      const orientation = assignment.reversed ? 'Reversed' : 'Upright';
      const chosenSignifier = spread.id === 'celtic-cross' && number === 0;
      return Object.freeze({number,label:position.label,cardId:card.id,cardName:card.name,orientation,
        chosenSignifier,
        meaning:card.meanings[orientation.toLowerCase()],sourcePage:card.source.printedPage,
        context:`${card.name} (${orientation.toLowerCase()}${chosenSignifier ? ', chosen signifier' : ''}) occupies ${position.label}. ${configuration.rules[number].context}`,
        prompt:configuration.rules[number].prompt});
    }));
    const complete = spread.placementOrder.every(number => visible.has(number));
    const byNumber = new Map(positions.map(entry => [entry.number,entry]));
    const groups = Object.freeze(complete ? configuration.connections.map(group => Object.freeze({
      title:group.title,context:group.context,prompt:group.prompt,
      entries:Object.freeze(group.numbers.map(number => byNumber.get(number)))
    })) : []);
    const recap = complete ? Object.freeze({
      title:'Closing reflection',
      context:configuration.recapContext,
      entries:Object.freeze(configuration.recapNumbers.map(number => byNumber.get(number))),
      prompt:'Considering this reading, what deserves your attention next?'
    }) : null;
    return Object.freeze({spreadId:spread.id,complete,positions,groups,recap,
      label:'App-authored reflection',
      note:'These prompts connect the handbook meanings to their positions. Your own associations complete the reading.'});
  }
  function toText(reading) {
    if (!reading) return '';
    if (!reading.complete) throw new Error('Reveal every card before exporting the complete reflection.');
    const lines = [reading.label.toUpperCase(),reading.note,'','REFLECTIONS FOR EACH POSITION',''];
    for (const entry of reading.positions) lines.push(reference(entry),entry.context,entry.prompt,'');
    lines.push('READ THE SPREAD TOGETHER','');
    for (const group of reading.groups) {
      lines.push(group.title,group.context);
      for (const entry of group.entries) lines.push(reference(entry),`Handbook meaning (${entry.orientation.toLowerCase()}):`,entry.meaning);
      lines.push(group.prompt,'');
    }
    lines.push(reading.recap.title,reading.recap.context,...reading.recap.entries.map(reference),reading.recap.prompt,'');
    return lines.join('\r\n');
  }
  window.TarotInterpretation = Object.freeze({build,toText,reference});
})();

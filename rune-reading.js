/* Pure, revealed-only presentation boundary. Never expose concealed assignments. */
(() => {
  'use strict';
  function freeze(value) {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  function build(snapshot,revealedNumbers) {
    if (snapshot === null) return null;
    const invalid = () => { throw new Error('The locked Rune reading is inconsistent. Start a new reading to prepare again.'); };
    const mode = window.RuneModes.find(item => item.id === snapshot?.settings?.modeId);
    const arrangement = snapshot?.arrangement;
    const layout = window.RuneLayouts.find(item => item.id === arrangement?.layoutId);
    if (!mode || !layout || snapshot.version !== 1 || snapshot.tradition !== 'runes' ||
      layout.id !== mode.id || arrangement.version !== layout.version || snapshot.settings.reversals !== false ||
      typeof snapshot.settings.question !== 'string' || snapshot.settings.question.length > 500 ||
      !Array.isArray(arrangement.roles) || arrangement.roles.length !== mode.count || layout.positions.length !== mode.count ||
      !Array.isArray(snapshot.assignments) || snapshot.assignments.length !== mode.count ||
      !Array.isArray(revealedNumbers) || revealedNumbers.length > mode.count ||
      !Array.from(revealedNumbers).every((number,index) => Number.isInteger(number) && number === index + 1)) invalid();
    for (let index = 0; index < mode.count; ++index) {
      const role = arrangement.roles[index];
      const expected = mode.roles[index];
      const assignment = snapshot.assignments[index];
      if (!role || !assignment || !['number','roleId','label','question'].every(key => role[key] === expected[key]) ||
        assignment.roleNumber !== role.number || assignment.roleId !== role.roleId) invalid();
    }
    const count = revealedNumbers.length;
    const complete = count === mode.count;
    const next = complete ? null : count + 1;
    const positions = arrangement.roles.map((role,index) => {
      let rune = null;
      if (index < count) {
        const identity = window.RuneVisuals.glyphs.find(item => item.id === snapshot.assignments[index].runeId);
        if (!identity) invalid();
        rune = {id:identity.id,name:identity.name,glyph:identity.glyph};
      }
      return {...role,column:layout.positions[index].column,row:layout.positions[index].row,
        revealed:index < count,next:role.number === next,rune};
    });
    return freeze({modeId:mode.id,name:mode.name,context:mode.context,question:snapshot.settings.question,
      layoutId:layout.id,layoutVersion:layout.version,rows:layout.rows,positions,count,total:mode.count,next,complete});
  }
  window.RuneReading = Object.freeze({build});
})();

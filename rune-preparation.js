/* Private Rune engine controller. Tables consume only the revealed-only view. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const textNode = (tag,className,text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function create({onChange,requestReset}) {
    let dirty = false;
    let localError = '';
    let renderedMode = '';
    let displayedSnapshot = null;
    let inspectedRole = null;
    let readingModel = null;
    let positionControls = [];
    let cachedSnapshot = null;
    let cachedCount = -1;
    let renderedDetail = null;
    let renderedThreads = null;
    const exportUrls = new Set();
    const engine = window.RuneEngine.create(render);
    const modeFor = () => window.RuneModes.find(mode => mode.id === engine.getState().settings.modeId);
    for (const mode of window.RuneModes) {
      const option = textNode('option','',`${mode.name} · ${mode.count} ${mode.count === 1 ? 'rune' : 'runes'}`);
      option.value = mode.id;
      $('rune-mode').append(option);
    }
    const lotButtons = [];
    for (let lotIndex = 0; lotIndex < 24; ++lotIndex) {
      const button = textNode('button','rune-lot');
      button.type = 'button';
      button.dataset.lotIndex = lotIndex;
      button.append(window.RuneVisuals.stone(),textNode('span','rune-lot-number',`Lot ${lotIndex + 1}`),textNode('span','rune-pick-marker'));
      button.addEventListener('click',() => {
        if (!attempt(() => engine.selectLot(lotIndex))) return;
        const state = engine.getState();
        const role = modeFor().roles[state.picks.length - 1];
        $('rune-selection-announcement').textContent = `Lot ${lotIndex + 1} selected for ${role.label}. ${state.picks.length} of 3 selected.`;
        if (state.picks.length === 3) $('begin-rune-reading').focus();
        else {
          const available = lotButtons.slice(lotIndex + 1).concat(lotButtons.slice(0,lotIndex + 1)).find(lot => !lot.disabled);
          if (available) available.focus();
        }
      });
      lotButtons.push(button);
      $('rune-lot-grid').append(button);
    }
    function attempt(action) {
      localError = '';
      try { action(); }
      catch (failure) { localError = failure.message; render(); return false; }
      render();
      return true;
    }
    const shortLabel = position => position.label.split(' · ').at(-1);
    function activatePosition(number,origin) {
      if (!readingModel) return;
      const position = readingModel.positions[number - 1];
      if (!position || (!position.revealed && !position.next)) return;
      let assignment;
      if (!attempt(() => { assignment = position.revealed ? engine.inspect(number) : engine.revealNext(); })) return;
      if (!assignment) return;
      inspectedRole = assignment.roleNumber;
      renderReading();
      const selected = readingModel.positions[inspectedRole - 1];
      $('rune-reading-announcement').textContent = `Position ${selected.number} · ${shortLabel(selected)}: ${selected.rune.name}. ${readingModel.count} of ${readingModel.total} revealed.`;
      if (origin === 'main' && readingModel.complete) $('rune-completion').focus();
    }
    function renderReading() {
      const snapshot = engine.getReading();
      const revealed = engine.getRevealed();
      if (cachedSnapshot !== snapshot || cachedCount !== revealed.length) {
        readingModel = window.RuneInterpretation.build(window.RuneReading.build(snapshot,revealed));
        cachedSnapshot = snapshot;
        cachedCount = revealed.length;
      }
      if (!readingModel) {
        displayedSnapshot = null;
        inspectedRole = null;
        positionControls = [];
        $('rune-table').replaceChildren();
        $('rune-position-list').replaceChildren();
        $('rune-detail-face').replaceChildren();
        $('rune-reading-announcement').textContent = '';
        for (const id of ['rune-reading-title','rune-reading-question','rune-reading-context','rune-progress','rune-detail-title','rune-detail-position','rune-position-question']) $(id).textContent = '';
        $('rune-completion').hidden = true;
        $('reveal-next-rune').disabled = true;
        $('reveal-next-rune').textContent = '';
        renderDetail(null);
        renderThreads(null);
        $('download-rune-reading').disabled = true;
        $('rune-download-note').textContent = 'Reveal every rune to download the reading.';
        $('rune-download-status').textContent = '';
        $('rune-download-status').hidden = true;
        return;
      }
      const model = readingModel;
      if (displayedSnapshot !== snapshot) {
        displayedSnapshot = snapshot;
        inspectedRole = null;
        $('rune-table').replaceChildren();
        $('rune-position-list').replaceChildren();
        positionControls = model.positions.map(position => {
          const button = textNode('button','rune-position');
          button.type = 'button';
          button.style.gridColumn = position.column;
          button.style.gridRow = position.row;
          const face = textNode('span','rune-position-face');
          const label = textNode('span','rune-position-label');
          label.append(textNode('span','rune-full-role',`${position.number} · ${position.label}`),textNode('span','rune-short-role',`${position.number} · ${shortLabel(position)}`));
          const name = textNode('span','rune-position-name');
          const marker = textNode('span','rune-position-marker');
          button.append(face,label,name,marker);
          button.addEventListener('click',() => activatePosition(position.number,'stone'));
          $('rune-table').append(button);
          const row = textNode('li','rune-guide-row');
          row.append(textNode('strong','',`${position.number} · ${position.label}`),textNode('p','small muted',position.question));
          const guide = textNode('button','rune-guide-action');
          guide.type = 'button';
          guide.addEventListener('click',() => activatePosition(position.number,'guide'));
          row.append(guide);
          $('rune-position-list').append(row);
          return {button,face,name,marker,guide,identity:null};
        });
      }
      $('rune-reading-title').textContent = model.name;
      $('rune-reading-context').textContent = model.context;
      $('rune-reading-question').textContent = model.question;
      $('rune-reading-question').hidden = model.question === '';
      $('rune-progress').textContent = `${model.count} of ${model.total} revealed`;
      $('rune-completion').hidden = !model.complete;
      $('reveal-next-rune').disabled = model.complete;
      $('reveal-next-rune').textContent = model.complete ? 'All runes revealed' : `Reveal ${model.next} · ${shortLabel(model.positions[model.next - 1])}`;
      for (const position of model.positions) {
        const control = positionControls[position.number - 1];
        const selected = position.revealed && position.number === inspectedRole;
        const identity = position.rune?.id || null;
        if (!control.face.firstChild || control.identity !== identity) {
          control.face.replaceChildren(window.RuneVisuals.stone(identity));
          control.identity = identity;
        }
        control.name.textContent = position.rune?.name || '';
        control.name.hidden = !position.revealed;
        control.marker.textContent = selected ? 'Selected' : position.next ? 'Next' : '';
        control.button.disabled = !position.revealed && !position.next;
        control.button.classList.toggle('is-next',position.next);
        control.button.classList.toggle('is-selected',selected);
        control.button.setAttribute('aria-pressed',String(selected));
        control.button.setAttribute('aria-label',`${position.number} · ${position.label}, ${position.revealed ? `${position.rune.name}, inspect${selected ? ', selected' : ''}` : position.next ? 'concealed, reveal next' : 'concealed, unavailable'}.`);
        control.guide.disabled = control.button.disabled;
        control.guide.textContent = position.revealed ? 'Inspect' : position.next ? 'Reveal' : 'Unrevealed';
        control.guide.setAttribute('aria-label',`${control.guide.textContent} position ${position.number} · ${position.label}${position.rune ? `: ${position.rune.name}` : ''}`);
        control.guide.setAttribute('aria-pressed',String(selected));
      }
      const detail = model.positions[(inspectedRole || model.next || model.total) - 1];
      $('rune-detail-position').textContent = `Position ${detail.number} · ${detail.label}`;
      $('rune-detail-title').textContent = detail.rune ? detail.rune.name : 'Reveal this position';
      $('rune-detail-face').replaceChildren(...(detail.rune ? [window.RuneVisuals.stone(detail.rune.id)] : []));
      $('rune-position-question').textContent = detail.question;
      renderDetail(detail.interpretation);
      renderThreads(model.complete ? model : null);
      $('download-rune-reading').disabled = !model.complete;
      $('rune-download-note').textContent = model.complete ? 'Keep or share this text record. It cannot resume the app.' : 'Reveal every rune to download the reading.';
    }
    function renderDetail(detail) {
      if (renderedDetail === detail) return;
      renderedDetail = detail;
      $('rune-historical-roots').open = false;
      $('rune-catalogue-detail').hidden = !detail;
      for (const [id,key] of [['rune-name-image','nameImage'],['rune-roots-text','historicalRoots'],['rune-background-name','backgroundName'],['rune-adaptation-note','adaptationNote'],['rune-original-reflection','reflection'],['rune-position-invitation','positionInvitation']]) $(id).textContent = detail?.[key] || '';
      $('rune-background-name').hidden = !detail?.backgroundName;
      $('rune-position-invitation').hidden = !detail;
      $('rune-themes').textContent = detail ? `Themes: ${detail.themes.join(', ')}` : '';
      $('rune-personal-questions').replaceChildren(...(detail ? detail.questions.map(question => textNode('li','',question)) : []));
      $('rune-source-references').replaceChildren();
      if (detail) {
        for (const [field,refs] of Object.entries(detail.sourceReferences)) for (const ref of refs) {
          const label = field === 'name' ? 'Name' : field === 'roots' ? 'Roots' : 'Adaptation';
          $('rune-source-references').append(textNode('p','source-credit',`${label} source: ${window.RuneInterpretation.sourceLine(ref)}`));
        }
        const cited = new Set(Object.values(detail.sourceReferences).flat().map(ref => ref.sourceId));
        for (const source of window.RuneCatalogue.sources.filter(source => cited.has(source.id))) $('rune-source-references').append(textNode('p','small muted',`[${source.id}] ${source.edition}`));
      }
    }
    function renderThreads(model) {
      if (renderedThreads === model) return;
      renderedThreads = model;
      $('rune-threads-panel').hidden = !model;
      $('rune-threads-disclosure').open = false;
      $('rune-threads-note').textContent = model?.threads.note || '';
      $('rune-connection-groups').replaceChildren();
      $('rune-recap').replaceChildren();
      if (!model) return;
      function reference(member,anchor = false) {
        const section = textNode('div','rune-thread-reference');
        section.append(textNode('p','rune-thread-member',`${anchor ? 'Anchor · ' : ''}${member.number} · ${member.label}: ${member.rune.name}`),textNode('p','small muted',member.themes.join(', ')));
        const button = textNode('button','rune-thread-inspect',`Inspect ${member.rune.name}`);
        button.type = 'button';
        button.setAttribute('aria-label',`Inspect position ${member.number} · ${member.label}: ${member.rune.name}`);
        button.addEventListener('click',() => activatePosition(member.number,'thread'));
        section.append(button);
        return section;
      }
      if (model.threads.dailyQuestions) {
        const section = textNode('section','connection-group');
        section.append(reference(model.recap.references[0]));
        const list = textNode('ol','');
        list.append(...model.threads.dailyQuestions.map(question => textNode('li','',question)));
        section.append(list);
        $('rune-connection-groups').append(section);
      }
      for (const group of model.threads.groups) {
        const section = textNode('section','connection-group');
        section.append(textNode('h4','',group.title),...group.members.map(member => reference(member)));
        if (group.anchor) section.append(reference(group.anchor,true));
        section.append(textNode('p','rune-role-prompt',group.rolePrompt));
        if (group.pairPrompt) section.append(textNode('h4','rune-pair-heading','Original pair reflection'),textNode('p','rune-pair-prompt',group.pairPrompt));
        $('rune-connection-groups').append(section);
      }
      const list = textNode('ol','rune-recap-list');
      list.append(...model.recap.references.map(member => textNode('li','',`${member.label}: ${member.rune.name}`)));
      $('rune-recap').append(textNode('h4','','Bring it back to your life'),list,textNode('p','',model.recap.modeInvitation),textNode('p','reflection-prompt',model.recap.closingInvitation));
    }
    function render(state = engine.getState()) {
      const mode = window.RuneModes.find(item => item.id === state.settings.modeId);
      const locked = state.phase === 'reading';
      $('rune-mode').value = mode.id;
      if ($('rune-question').value !== state.settings.question) $('rune-question').value = state.settings.question;
      $('rune-mode').disabled = state.phase !== 'preparing';
      $('rune-question').disabled = state.phase !== 'preparing';
      if (renderedMode !== mode.id) {
        renderedMode = mode.id;
        $('rune-mode-note').textContent = mode.note;
        $('rune-mode-context').textContent = mode.context;
        $('rune-role-list').replaceChildren(...mode.roles.map(role => textNode('li','',role.label)));
      }
      $('rune-preparation-panel').hidden = locked;
      $('rune-reading').hidden = !locked;
      $('rune-branch').setAttribute('aria-labelledby',locked ? 'rune-reading-title' : 'rune-title');
      $('start-rune-shuffle').disabled = state.phase !== 'preparing' || !state.secureRandomAvailable;
      $('stop-rune-shuffle').disabled = state.phase !== 'shuffling';
      $('rune-shuffle-controls').hidden = locked;
      $('begin-rune-reading').disabled = !state.canBegin;
      $('begin-rune-reading').hidden = locked;
      $('reset-rune-preparation').disabled = state.phase === 'shuffling' || !getStatus().hasSession;
      $('reset-rune-preparation').hidden = locked;
      $('rune-availability').hidden = locked;
      $('rune-design-examples').hidden = locked;
      const status = locked ? 'The complete 24-rune bag and every assignment are locked.' : state.phase === 'shuffling' ? 'Shuffling your rune bag. Stop whenever you are ready.' : state.phase === 'selecting' ? state.picks.length === 3 ? 'All three lots selected. Begin when you are ready.' : `${state.picks.length} of 3 lots selected. Choose the next concealed lot.` : state.hasShuffled ? mode.id === 'norns' ? 'Choose three concealed lots in order.' : 'Your rune bag is ready. Begin when you are ready.' : !state.secureRandomAvailable ? 'Secure browser randomness is unavailable. Shuffling is disabled.' : 'Shuffle the 24 runes before beginning.';
      if ($('rune-shuffle-status').textContent !== status) $('rune-shuffle-status').textContent = status;
      $('rune-shuffle-count').textContent = state.shuffleCount ? `${state.shuffleCount} complete shuffle ${state.shuffleCount === 1 ? 'pass' : 'passes'}` : '';
      $('rune-preparation-error').textContent = localError || state.error;
      $('rune-preparation-error').hidden = !$('rune-preparation-error').textContent;
      const selectionVisible = mode.id === 'norns' && state.hasShuffled && (state.phase === 'preparing' || state.phase === 'selecting');
      $('rune-selection').hidden = !selectionVisible;
      $('rune-pick-count').textContent = `${state.picks.length} of 3 selected`;
      $('rune-pick-slots').replaceChildren();
      if (mode.id === 'norns') {
        for (const role of mode.roles) {
          const pick = state.picks.find(item => item.roleNumber === role.number);
          const li = textNode('li','');
          li.append(textNode('strong','',`${role.number} · ${role.label}`),textNode('span','small muted',pick ? `Selected concealed lot ${pick.lotIndex + 1}` : 'Choose a concealed lot'));
          $('rune-pick-slots').append(li);
        }
      }
      for (let i = 0; i < lotButtons.length; ++i) {
        const button = lotButtons[i];
        const pick = state.picks.find(item => item.lotIndex === i);
        button.disabled = !state.canSelect || Boolean(pick);
        button.classList.toggle('picked',Boolean(pick));
        button.setAttribute('aria-pressed',String(Boolean(pick)));
        button.setAttribute('aria-label',pick ? `Lot ${i + 1}, selected for ${mode.roles[pick.roleNumber - 1].label}, pick ${pick.roleNumber} of 3.` : `Lot ${i + 1}, concealed${state.canSelect ? `, choose for ${mode.roles[state.picks.length].label}` : ''}.`);
        const marker = button.querySelector('.rune-pick-marker');
        marker.hidden = !pick;
        marker.textContent = pick ? String(pick.roleNumber) : '';
      }
      if (state.phase !== 'selecting') $('rune-selection-announcement').textContent = '';
      renderReading();
      onChange();
    }
    function getStatus() {
      const state = engine.getState();
      return {
        hasSession:dirty || state.hasShuffled || state.phase !== 'preparing' || state.settings.modeId !== 'daily' || state.settings.question !== '',
        mode:modeFor().name,phase:state.phase,
        progress:state.phase === 'reading' ? `${state.revealedCount} of ${state.totalRoles} revealed` : state.phase === 'selecting' ? `${state.picks.length} of 3 lots selected` : 'Preparation',
        completed:state.complete,canDownload:state.complete && readingModel?.complete === true,canNavigate:state.phase !== 'shuffling'
      };
    }
    $('rune-mode').addEventListener('change',() => {
      dirty = true;
      attempt(() => engine.configure({modeId:$('rune-mode').value,question:$('rune-question').value}));
    });
    $('rune-question').addEventListener('input',() => {
      dirty = true;
      attempt(() => engine.configure({modeId:$('rune-mode').value,question:$('rune-question').value}));
    });
    $('start-rune-shuffle').addEventListener('click',() => attempt(() => engine.startShuffling()));
    $('stop-rune-shuffle').addEventListener('click',() => attempt(() => engine.stopShuffling()));
    $('begin-rune-reading').addEventListener('click',() => {
      if (attempt(() => engine.beginReading())) $('reveal-next-rune').focus();
    });
    $('reveal-next-rune').addEventListener('click',() => activatePosition(readingModel?.next,'main'));
    $('reset-rune-preparation').addEventListener('click',requestReset);
    $('new-rune-reading').addEventListener('click',requestReset);
    $('download-rune-reading').addEventListener('click',() => {
      try {
        const report = window.RuneReadingExport.build(engine.getReading(),engine.getRevealed());
        const blob = new Blob(['\ufeff',report.text],{type:'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        exportUrls.add(url);
        const link = document.createElement('a');
        link.href = url;
        link.download = report.filename;
        document.body.append(link);
        try { link.click(); }
        finally {
          link.remove();
          window.setTimeout(() => { URL.revokeObjectURL(url); exportUrls.delete(url); },1000);
        }
        $('rune-download-status').textContent = `TXT download requested: ${report.filename}`;
      } catch (failure) {
        $('rune-download-status').textContent = `${failure.message || 'Your browser could not create the TXT download.'} Try again.`;
      }
      $('rune-download-status').hidden = false;
    });
    window.addEventListener('pagehide',() => {
      if (engine.getState().phase === 'shuffling') engine.stopShuffling();
      for (const url of exportUrls) URL.revokeObjectURL(url);
      exportUrls.clear();
    });
    render();
    return Object.freeze({getStatus,reset({clearSettings = false} = {}) {
      dirty = false;
      localError = '';
      engine.resetPreparation();
      if (clearSettings) {
        engine.configure({modeId:'daily',question:''});
        $('rune-branch').querySelector('.rune-glyph-reference').open = false;
      }
      render();
      if (!clearSettings) $('start-rune-shuffle').focus();
    },focus() {
      if (engine.getState().phase === 'reading') $(engine.getState().complete ? 'rune-completion' : 'reveal-next-rune').focus();
      else if (engine.getState().phase === 'selecting') (lotButtons.find(button => !button.disabled) || $('begin-rune-reading')).focus();
      else $('rune-title').focus();
    }});
  }
  window.RunePreparation = Object.freeze({create});
})();

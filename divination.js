/* In-memory screen navigation, explicit discard confirmation and fixed design references. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const textNode = (tag,className,text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function create({getTarotStatus,resetTarot,getRuneStatus,resetRunes,focusRunes}) {
    let tradition = null;
    let pending = null;
    const dialog = $('session-confirmation');
    for (const example of [
      {id:null,title:'Concealed',note:'Unmarked face'},
      {id:'fehu',title:'Revealed',note:'Fehu · fixed example'},
      {id:'jera',title:'Inspected',note:'Jera · fixed example',selected:true}
    ]) {
      const item = textNode('div',`rune-example${example.selected ? ' rune-inspected' : ''}`);
      item.append(window.RuneVisuals.stone(example.id),textNode('p','rune-example-state',example.title),textNode('p','small muted',example.note));
      if (example.selected) item.append(textNode('span','rune-selected-marker','Selected'));
      $('rune-examples').append(item);
    }
    for (const rune of window.RuneVisuals.glyphs) {
      const item = textNode('div','rune-glyph-item');
      item.append(window.RuneVisuals.stone(rune.id),textNode('p','',rune.name));
      $('rune-glyph-gallery').append(item);
    }
    function status() {
      return tradition === 'tarot' ? getTarotStatus() : getRuneStatus();
    }
    function update() {
      const current = status();
      const active = tradition !== null && current.hasSession;
      $('active-session').hidden = !active;
      $('active-session-summary').textContent = active ? `${tradition === 'tarot' ? 'Tarot' : 'Runes'} · ${current.mode} · ${current.phase === 'reading' || current.phase === 'selecting' ? current.progress : 'Preparation'}` : '';
      $('return-session').textContent = current.phase === 'reading' ? 'Return to reading' : 'Return to preparation';
      $('choose-divination').disabled = !current.canNavigate;
      $('navigation-note').hidden = current.canNavigate;
      $('choose-divination').title = current.canNavigate ? '' : 'Stop shuffling before choosing another divination.';
    }
    function showChoice() {
      if (!status().canNavigate) return;
      update();
      $('divination-choice').hidden = false;
      $('branch-navigation').hidden = true;
      $('tarot-branch').hidden = true;
      $('rune-branch').hidden = true;
      $('app-title').textContent = 'The Ritual Table';
      $('choice-title').focus();
    }
    function showBranch() {
      $('divination-choice').hidden = true;
      $('branch-navigation').hidden = false;
      $('tarot-branch').hidden = tradition !== 'tarot';
      $('rune-branch').hidden = tradition !== 'runes';
      $('app-title').textContent = tradition === 'tarot' ? 'The Gothic Tarot' : 'Elder Futhark';
      $('branch-caption').textContent = tradition === 'tarot' ? 'Tarot divination' : 'Rune divination';
      update();
      if (tradition === 'runes') focusRunes();
      else if (getTarotStatus().phase === 'reading') ($('reveal-next').disabled ? $('new-reading') : $('reveal-next')).focus();
      else $('spread-choice').focus();
    }
    function confirmAction({title,message,label,action}) {
      $('confirmation-title').textContent = title;
      $('confirmation-message').textContent = message;
      $('confirm-clear').textContent = label;
      $('confirmation-download-note').hidden = !status().canDownload;
      pending = action;
      dialog.showModal();
      $('keep-session').focus();
    }
    function choose(next) {
      if (tradition === next) { showBranch(); return; }
      const action = () => {
        if (tradition === 'tarot') resetTarot({clearSettings:true});
        if (tradition === 'runes') resetRunes({clearSettings:true});
        tradition = next;
        showBranch();
      };
      if (tradition !== null && status().hasSession) {
        const nextName = next === 'tarot' ? 'Tarot' : 'Runes';
        const oldName = tradition === 'tarot' ? 'Tarot' : 'Rune';
        confirmAction({title:`Switch to ${nextName}?`,message:`This clears your current ${oldName} preparation or reading.`,label:'Switch and clear',action});
      } else action();
    }
    $('choose-tarot').addEventListener('click',() => choose('tarot'));
    $('choose-runes').addEventListener('click',() => choose('runes'));
    $('choose-divination').addEventListener('click',showChoice);
    $('return-session').addEventListener('click',showBranch);
    $('keep-session').addEventListener('click',() => { pending = null; dialog.close(); });
    dialog.addEventListener('cancel',() => { pending = null; });
    dialog.addEventListener('keydown',event => {
      if (event.key !== 'Tab') return;
      const buttons = [$('keep-session'),$('confirm-clear')];
      const index = buttons.indexOf(document.activeElement);
      event.preventDefault();
      buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
    });
    $('confirm-clear').addEventListener('click',() => {
      const action = pending;
      pending = null;
      dialog.close();
      if (action) action();
    });
    update();
    return Object.freeze({update,resetRunePreparation() {
      const locked = getRuneStatus().phase === 'reading';
      confirmAction({title:locked ? 'Start a new rune reading?' : 'Reset rune preparation?',message:'This clears your prepared bag and all selected lots. Your mode and question are kept; shuffle again when you are ready.',label:locked ? 'New reading' : 'Reset preparation',action:() => { resetRunes({clearSettings:false}); update(); }});
    },newTarotReading() {
      confirmAction({title:'Start a new reading?',message:'This clears your current Tarot reading. Your preparation settings are kept; shuffle again when you are ready.',label:'New reading',action:() => { resetTarot({clearSettings:false}); update(); }});
    }});
  }
  window.DivinationShell = Object.freeze({create});
})();

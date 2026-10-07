/* Accepted reflective roles, shared by preparation and future Rune reading consumers. */
(() => {
  'use strict';
  const role = (number,roleId,label,question) => Object.freeze({number,roleId,label,question});
  window.RuneModes = Object.freeze([
    {id:'daily',name:'Daily Counsel',count:1,note:'A theme to notice today.',context:'A modern reflection practice. A fresh reading requires an explicit action.',roles:[
      role(1,'theme','A theme to notice today','A theme to notice today.')
    ]},
    {id:'norns',name:'Three Norns',count:3,note:'Roots, Present and Responsibility, read left to right.',context:'Modern reflective roles inspired by Norn imagery. Choose three concealed lots during preparation, before Begin reading.',roles:[
      role(1,'roots','Urðr · Roots','What earlier choices and circumstances shaped this?'),
      role(2,'present','Verðandi · Present','What is unfolding or asking for attention now?'),
      role(3,'responsibility','Skuld · Responsibility','What obligation, consequence or response deserves consideration?')
    ]},
    {id:'elemental',name:'Elemental Reflection',count:5,note:'A situation explored through foundations, understanding, motivation and feeling.',context:'A modern elemental reading convention. The center has a role, not greater predictive weight.',roles:[
      role(1,'situation','Center · Situation','What is central to your concern?'),
      role(2,'foundations','North / Earth · Foundations','What supports you, and what needs practical care?'),
      role(3,'understanding','East / Air · Understanding','What needs clearer thought or communication?'),
      role(4,'motivation','South / Fire · Motivation','What energizes you, and where might urgency overwhelm judgment?'),
      role(5,'feeling','West / Water · Feeling','What feelings, relationships or recurring emotional patterns matter?')
    ]},
    {id:'counsels',name:'Seven Counsels',count:7,note:'Seven questions about how to respond and act.',context:'An original modern adaptation inspired by Sigrdrífumál’s purpose classes.',roles:[
      role(1,'resolve','Resolve','What deserves your effort?'),
      role(2,'discernment','Discernment','What needs closer scrutiny?'),
      role(3,'care','Care','What needs nurturing or protection?'),
      role(4,'journey','Journey','How can you navigate change?'),
      role(5,'repair','Repair','What needs mending?'),
      role(6,'speech','Speech','What needs expressing or hearing?'),
      role(7,'wisdom','Wisdom','What needs understanding?')
    ]},
    {id:'worlds',name:'Nine Worlds Reflection',count:9,note:'Nine named places, with grounded reflective roles.',context:'Adapted modern World Tree reflection. Visual placement cannot change assignments or meanings.',roles:[
      role(1,'midgard','Midgard · Daily life','Where does this touch your ordinary actions and relationships?'),
      role(2,'niflheim','Niflheim · Stillness','What is stable, paused or difficult to move?'),
      role(3,'muspelheim','Muspelheim · Drive','What fuels action, and what might burn through your reserves?'),
      role(4,'vanaheim','Vanaheim · Nourishment','What sustains growth, care and reciprocity?'),
      role(5,'jotunheim','Jotunheim · Challenge','What forces demand adaptation or firmer boundaries?'),
      role(6,'alfheim','Alfheim · Perspective','What idea or wider perspective would help you see clearly?'),
      role(7,'svartalfheim','Svartalfheim · Inner work','What habit, memory or skill deserves examination or development?'),
      role(8,'asgard','Asgard · Values','What principles or commitments do you want to act from?'),
      role(9,'hel','Hel · Inheritance','What past experience, received expectation or ending still shapes this?')
    ]}
  ].map(mode => Object.freeze({...mode,roles:Object.freeze(mode.roles)})));
})();

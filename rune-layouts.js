/* Modern display geometry. Numbered roles, never screen position, determine reveal order. */
(() => {
  'use strict';
  const layout = (id,rows,coordinates) => Object.freeze({id,version:1,rows,
    positions:Object.freeze(coordinates.map(([column,row],index) => Object.freeze({number:index + 1,column,row})))
  });
  window.RuneLayouts = Object.freeze([
    layout('daily',1,[[2,1]]),
    layout('norns',1,[[1,1],[2,1],[3,1]]),
    layout('elemental',3,[[2,2],[2,1],[3,2],[2,3],[1,2]]),
    layout('counsels',3,[[1,1],[2,1],[3,1],[2,2],[1,3],[2,3],[3,3]]),
    layout('worlds',3,[[2,2],[1,2],[3,2],[3,1],[3,3],[1,1],[1,3],[2,1],[2,3]])
  ]);
})();

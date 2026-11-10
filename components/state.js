let cat = "";          // "" = no category chosen, "*" = every prompt, otherwise a category name
let cur = 0;           // which result row is highlighted
const MODES = ["card", "seeds", "vine"], MODEKEY = "promptlib.layout.v1";
let mode = MODES.includes(lsGet(MODEKEY)) ? lsGet(MODEKEY) : "seeds";   // how results appear on a computer: card, seeds or vine
const RS = [];         // result seeds (seeds layout)
let ctx = { n: 0, restrict: false };

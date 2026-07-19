/* DrivenQuest shared game state.
 *
 * Every app page loads this and reads/writes the same localStorage blob,
 * so gold and XP earned in one app (a slain boss, a finished quest) are
 * visible in all the others. App-specific data lives under state.apps.<id>
 * so apps never trample each other.
 */
const LifeGame = (() => {
  const KEY = 'drivenquest.state.v1';

  const defaults = () => ({
    version: 1,
    gold: 0,
    xp: 0,
    history: [],   // cross-app ledger: { at, app, msg, gold?, xp? }
    apps: {},
  });

  let state;
  try {
    state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY)) || {});
  } catch {
    state = defaults();
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  // Level curve: 50 XP for level 2, then quadratically steeper.
  function level() {
    return Math.floor(Math.sqrt(state.xp / 50)) + 1;
  }

  function award(app, msg, { gold = 0, xp = 0 } = {}) {
    state.gold += gold;
    state.xp += xp;
    state.history.unshift({ at: Date.now(), app, msg, gold, xp });
    state.history.length = Math.min(state.history.length, 200);
    save();
  }

  // Deducts gold if the purse can afford it; returns false otherwise.
  function spend(app, msg, gold) {
    if (gold > state.gold) return false;
    state.gold -= gold;
    state.history.unshift({ at: Date.now(), app, msg, gold: -gold, xp: 0 });
    state.history.length = Math.min(state.history.length, 200);
    save();
    return true;
  }

  // Returns the app's namespaced state, seeding it on first use.
  function app(id, seed) {
    if (!state.apps[id]) {
      state.apps[id] = typeof seed === 'function' ? seed() : (seed || {});
      save();
    }
    return state.apps[id];
  }

  return {
    save,
    award,
    spend,
    app,
    level,
    get gold() { return state.gold; },
    get xp() { return state.xp; },
    get history() { return state.history; },
  };
})();

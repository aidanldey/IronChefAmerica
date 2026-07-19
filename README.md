# DrivenQuest

Play life like a game. A collection of one-page HTML apps that share a single
fantasy board-game aesthetic and one common game economy, so together they feel
like chapters of one big game.

## Apps

| App | File | Status |
| --- | --- | --- |
| Boss Battle — render a big goal as a boss; each sub-task dealt as damage | `boss-battle.html` | ✅ |
| Quest Log — main/side/daily quests with bounties, deadlines, and streaks | `quest-log.html` | ✅ |
| Character Sheet — invent your own attributes, train them with logged deeds | `character-sheet.html` | ✅ |
| Skill Tree — branching milestone trees; master a node to unlock the next | `skill-tree.html` | ✅ |
| Loot Box, Habit Streaks, … | — | planned |

Open any app file directly in a browser — no build step, no server, no
dependencies. All progress is saved in the browser via `localStorage`.

## Shared foundation

Every app page links the same two files so the whole site plays as one game:

- **`assets/game.css`** — the design system: dark wood table background,
  parchment panels, gold-trim buttons, blood-red vitality bars, small-caps
  serif headings. New apps should build on these classes (`.panel`, `.btn`,
  `.hp-track`, `.overlay`, the `--gold`/`--blood`/`--parchment` tokens) and
  keep page-specific styles in a `<style>` block.
- **`assets/game-core.js`** — the shared economy. One `localStorage` blob
  (`drivenquest.state.v1`) holds gold, XP, and a cross-app history ledger.
  Apps call `LifeGame.award(appId, message, { gold, xp })` to grant rewards
  and `LifeGame.app(appId, seedFn)` for their own namespaced state, so gold
  earned slaying a boss is spendable in a future shop or loot box.

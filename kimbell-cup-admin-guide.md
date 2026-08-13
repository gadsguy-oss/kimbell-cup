# Kimbell Cup Invitational — Admin Guide

Everything the tournament host needs to run the app, in the order you'll actually need it.

---

## The one thing to understand first

There is no login and no server. The app runs off **shared storage** — every phone that opens the link reads and writes the same board. That means:

- Anything you type into Setup, the field sees.
- Anything a team posts, everybody sees.
- Anybody *can* open Setup and change things. There's no lock on it. Practically, this is a 24-man field of guys you know, so the fix is social: tell them Setup is yours and to stay out of it.

Each phone remembers which team it's keeping score for, per year. Nobody has to re-pick after switching tabs or closing the app.

---

## Four weeks out — set up the year

Open the app → **Setup** tab.

### 1. Event details
Date, first tee time, course, city, tees, yards, slope, and what the entry is. This is what shows in the header and on the Cup tab's format card.

Hit **Save event details**.

### 2. Scorecard
This is the most important screen in the app and the easiest to get wrong.

Enter **par, yards, and hole handicap** for all 18 holes off the course's actual scorecard — from the tees you're playing, not the tips.

Why it matters:
- **Par** drives every to-par number on the leaderboard.
- **Hole handicap** drives the tiebreaker. Regression runs hardest hole first, so if the 1-handicap hole is wrong, a tie could resolve to the wrong team.
- **Par 3s** are auto-detected — that's how the app knows which holes can carry closest-to-the-pin.

2026 is preloaded with River Forest's Gold tees (par 71, 6,280, slope 136) and the real handicap order, so if you're playing there you can skip this.

Hit **Save scorecard**.

### 3. Pairings
Enter both names per team, in seed order. Team 1 is the top seed.

- **Add a team** appends a new row.
- The **×** removes a team and its card.
- Teams renumber automatically when you save.

Hit **Save pairings**. Do this *before* the field starts picking teams — if you reorder teams after guys have already picked, they'll be pointed at the wrong card.

### 4. Prizes
Set the long drive hole and paste the prize list, one per line. The order matters:

| Line | Where it shows |
|---|---|
| 1–4 | The four closest-to-the-pin holes, in hole order |
| 5 | Long drive |
| 6 | Putting contest |

Hit **Save prizes**.

### 5. Contest holes
Go to the **Prizes** tab. Under the contest list, every par 3 on the card shows as a chip. Tap to turn holes on and off. Four is the norm, but the app won't stop you from running three or five if that's what the prizes support.

---

## The night before

1. **Setup → Clear all cards.** Wipes any test scores. Do this once, not on tournament morning when guys are already entering.
2. Walk the **Cup** tab and confirm the format card and pairings read correctly — that's the page guys will screenshot and pass around.
3. Send the link out with one line of instruction: *open it, pick your team, one guy per team keeps score.*

---

## Tournament morning

**Putting contest.** Prizes tab → putting contest → type the winner's name. Do it before the shotgun so it doesn't get forgotten.

**Set expectations on the tee.** One player per team enters scores. If both guys on a team enter, whoever saved last wins — the card doesn't merge, it overwrites. Say it out loud on the first tee.

---

## During the round

Your job is mostly watching. The board auto-refreshes every 45 seconds when the Board tab is open.

**Contest entries.** Anyone can put a name up on the Prizes tab — closest-to-the-pin takes a name and a distance, long drive takes a name and yardage. Guys will do this themselves. Spot-check that distances are actually getting shorter as the day goes; somebody will type over a better mark by accident.

**A team that fell behind.** If somebody forgot to enter for six holes, they can tap any hole in the 18-hole grid at the bottom of the Card tab and back-fill. No penalty for entering late.

**A team that lost their phone.** Any phone can pick up any team: Card tab → **Change team** → pick theirs. Their existing card loads with everything already entered.

**Reading a tie on the board.** Tied teams show `T2` and a red *card-off on hole handicap* line. The app has already resolved the order — the team listed higher won the card-off. It compares scores starting at the hardest hole and works down until somebody's better.

---

## When the last group comes in

1. **Board tab → Refresh board.** Make sure all 12 cards are in and each says *Signed* (18 holes entered). A team showing *Thru 16* will be scored on 16 holes and rank artificially low.
2. Fix anything broken now, while everyone's still standing there.
3. **Crown the champion.** This does four things at once:
   - Locks every card for the year — no more edits
   - Archives the final standings
   - Freezes the contest results
   - Engraves the winners on the Cup tab

If not every hole is in, it'll warn you and let you crown the leader anyway.

**Made a mistake?** Setup → **Reopen year** unlocks everything for edits. Fix it, then crown again — re-crowning replaces the old entry rather than adding a second one.

---

## After the round — the history

**Cup** tab. This is the part that makes it worth keeping year over year.

- **The plaque** lists every champion, newest first.
- **The record book** tracks cups on record, most titles by a player, and the low winning round.
- **Add a past champion** lets you back-fill the years before the app existed. Year and one name are the minimum; course, gross, and to-par fill out the record book.

Worth doing once, in an off-season sitting: get whoever remembers the old Cups on the phone and back-fill as far as you can toward '83. Names matching exactly matters — *Chip Johns* and *Chip* count as two different players in the "most titles" record.

---

## Opening next year

Setup → **Start a new Cup**.

Enter the year, then pick what carries over:

| Option | Use it when |
|---|---|
| **Field + course** | Same guys, same course. Fastest path. |
| **Field only** | Same guys, new course — you'll enter a new scorecard. |
| **Blank slate** | Rebuilding the field from scratch. |

The new year opens with an empty board. Last year stays locked, readable, and permanent — switch to it any time from the year dropdown in the header.

---

## Quick reference

| Task | Where |
|---|---|
| Change the course or tees | Setup → Event details |
| Fix a hole handicap | Setup → Scorecard |
| Add or swap a team | Setup → Pairings |
| Change which holes have CTP | Prizes tab → par 3 chips |
| Wipe all scores | Setup → Clear all cards |
| Lock the year, crown winners | Board → Crown the champion |
| Unlock a finished year | Setup → Reopen year |
| Back-fill old champions | Cup → Add a past champion |
| Open next December | Setup → Start a new Cup |

---

## Known gotchas

- **Both partners entering scores.** Last save wins, no merge. One scorekeeper per team.
- **Reordering pairings mid-round.** Team numbers shift and cards follow the number, not the names. Lock pairings before the first tee.
- **Editing the scorecard mid-round.** Changing a par recalculates every team's to-par instantly. Only do it if the par was genuinely wrong.
- **Nothing is private.** Setup, contests, and cards are all shared with the whole field.

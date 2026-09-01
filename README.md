# Piping Harmony 2026 — Jigsaw Puzzle Game (Flask)

A self-contained jigsaw puzzle web game branded for Piping Harmony 2026.

## Features
- Players only enter their name to play — the puzzle image and difficulty are fully controlled by the admin
- Each player gets an auto-generated registration number (e.g. `PH2026-0001`), shown on their puzzle page and in the admin panel
- Admin uploads the photo and sets the grid size (3x3 / 4x4 / 5x5) from the admin panel
- Puzzle pieces are cut from the admin's photo — tap one piece, then another, to swap them
- Live timer while playing
- On completion, the assembled photo and the final time are shown to the player
- **Admin panel is not linked anywhere on the player pages** — go directly to `/admin/login`
- Admin panel shows:
  - Every player's registration number and name **as soon as they register and start** (before they finish)
  - The completed-games leaderboard (reg no, name, grid size, time, completion date, image)
  - Totals: registered / completed / unique finishers
  - **Export to Excel** button — downloads a `.xlsx` with a "Registrations" sheet and a "Leaderboard" sheet
- Single full-cover branded background photo (not tiled) on the player-facing pages
- Wider puzzle board and registration panel

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the app:
   ```
   python app.py
   ```

3. Players go to:
   ```
   http://localhost:5000
   ```

4. Admin goes directly to (no link is shown to players):
   ```
   http://localhost:5000/admin/login
   ```
   Default password: `admin123` — **change `ADMIN_PASSWORD` in `app.py` before real use.**

## Notes / things you may want to customize

- `app.secret_key` in `app.py` should be changed to a long random string before deploying anywhere public.
- Uploaded images are stored in `static/uploads/`; all data (registrations + completions) is stored in a local SQLite file `leaderboard.db`, created automatically on first run.
- Max upload size is capped at 8 MB (`MAX_CONTENT_LENGTH` in `app.py`).
- The puzzle board renders at a fixed 400x400px — change `BOARD_SIZE` in `static/js/puzzle.js` if you want it bigger/smaller.
- The background is a single generated JPEG (`static/img/background.jpg`), shown full-cover (not tiled) on the player-facing pages via `.brand-bg` in `static/css/style.css`. Replace that file with your own event photo (same filename) to swap it, or point the `background-image` rule at a different file.
- Note: upgrading from an older copy of this app? Delete `leaderboard.db` once so the new `reg_number` columns get created — otherwise you'll get a "no such column" error.
- If the admin changes the image/difficulty while someone is mid-puzzle, that player's current game is unaffected (it's snapshotted at start) — only new starts pick up the change.

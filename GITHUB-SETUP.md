# Putting this on GitHub

Two routes. Pick based on whether you want to touch a terminal.

---

## Route A — browser only, no terminal

Fastest way in. About three minutes.

**1. Make the repo.**
[github.com/new](https://github.com/new) → name it `kimbell-cup` → Private is fine → **don't** check "Add a README," you already have one → Create repository.

**2. Upload the files.**
On the empty repo page, click **uploading an existing file**. Drag in all four:

```
index.html
README.md
ADMIN-GUIDE.md
GITHUB-SETUP.md
```

**3. Commit.**
Scroll down, message it `Kimbell Cup app`, click **Commit changes**.

Done. The repo is live.

**4. Connect Vercel.**
[vercel.com/new](https://vercel.com/new) → Import Git Repository → pick `kimbell-cup` → Deploy.

Leave every build setting blank. Vercel will detect it as a static site. There's no framework, no build command, no output directory.

You'll get a URL like `kimbell-cup.vercel.app` in under a minute. Every future push to `main` redeploys automatically.

---

## Route B — command line

If you'd rather have git set up properly on your machine.

**1. Make an empty repo on GitHub** — same as step 1 above.

**2. In Terminal**, from the folder holding these files:

```bash
cd path/to/kimbell-cup

git init
git add .
git commit -m "Kimbell Cup app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kimbell-cup.git
git push -u origin main
```

Replace `YOUR-USERNAME`. GitHub will ask you to authenticate — it wants a personal access token, not your password. If you don't have one: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate, give it repo access, paste it when prompted.

**3. Connect Vercel** — same as step 4 above.

---

## Updating it later

**Browser:** open `index.html` in the repo, click the pencil icon, edit, commit. Vercel redeploys on its own.

**Terminal:**

```bash
git add .
git commit -m "what you changed"
git push
```

---

## Custom domain

Once it's on Vercel: project → Settings → Domains → add `kimbellcup.com` (or whatever you buy). Vercel gives you the DNS records to paste at your registrar. Ten minutes, mostly waiting on DNS.

---

## About the shared leaderboard

Hosting this on GitHub and Vercel gets you a real URL. It does **not** get you the live multi-phone scoreboard — that needs a database behind it. The Board tab says so on screen so nobody's surprised on tournament morning.

`README.md` has the technical details: it's one `store` object with a `get` and a `set`, and swapping its device branch for API calls is the whole job.

Until that's built, the Claude artifact version is the one to use on December 4 — it has shared storage already.

# Playwright Form Bot

Automatically fills and submits a Microsoft Forms visitor registration form using [Playwright](https://playwright.dev/).

## What it does

[tests/submit-form.spec.ts](tests/submit-form.spec.ts) opens the form URL, fills in the fields (name, floor/access level, purpose, company, phone number), and submits it. The test passes if the page shows the "Registration is successful" confirmation message.

⚠️ **This submits a real entry to a live form every time it runs.** A visitor pass will actually be issued (via SMS/email). Don't run it repeatedly without reason.

## Running it locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

To watch the browser while it runs:

```bash
npx playwright test --headed
```

### Editing the submitted values

Open [tests/submit-form.spec.ts](tests/submit-form.spec.ts) and edit the values being filled in — name, company, floor number, purpose, phone number, etc. Each field is commented with the question it corresponds to.

### Viewing results after a run

- On failure, a screenshot and video are saved under `test-results/`.
- Run `npx playwright show-report` after a run to open the full HTML report (requires a `playwright-report/` folder, produced in CI — see below).

## Running it on GitHub Actions

The workflow at [.github/workflows/playwright.yml](.github/workflows/playwright.yml) only runs when triggered manually — it does **not** run on push or pull request, since every run submits a real form entry. Trigger it either:

- From the **Actions** tab → "Playwright Tests" → **Run workflow**, or
- From your iPhone, using the Shortcut below

After a run finishes, open the run in the **Actions** tab and download the `playwright-report` artifact to see the HTML report (useful if it failed and you want the screenshot/video).

## Triggering a run from your iPhone (Shortcuts)

You can kick off the GitHub Actions workflow from an iPhone Shortcut using GitHub's API, without opening GitHub at all.

### 1. Create a GitHub token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Limit it to this repository only
3. Under **Repository permissions**, set **Actions** to **Read and write**
4. Generate the token and copy it somewhere safe — you can't view it again later

### 2. Build the Shortcut

In the Shortcuts app, create a new shortcut with one action: **Get Contents of URL**.

| Field | Value |
|---|---|
| URL | `https://api.github.com/repos/Yipjunwei/playwrightformfiller/actions/workflows/playwright.yml/dispatches` |
| Method | `POST` |
| Headers → `Authorization` | `Bearer <your token>` (capital B, one space, then the token) |
| Headers → `Accept` | `application/vnd.github+json` |
| Request Body | **Text** → `{"ref": "main"}` |
| Headers → `Content-Type` | `application/json` |

> The JSON body type in Shortcuts' dictionary editor can be fiddly to fill in on iOS. Using **Text** mode with the raw string `{"ref": "main"}`, plus a manual `Content-Type: application/json` header, is more reliable and sends the exact same request.

### 3. Run it

Tap the shortcut (or add it to your Home Screen / ask Siri). GitHub queues the workflow run — check progress and results in the **Actions** tab of this repo, or in the GitHub mobile app.

### Troubleshooting "Requires authentication"

- Double check the `Authorization` header value is exactly `Bearer <token>` — capital `B`, one space, token immediately after, no quotes.
- Confirm the token hasn't expired and has **Actions: Read and write** permission for this repo.
- Test the token outside Shortcuts first:
  ```bash
  curl -X POST \
    -H "Authorization: Bearer <your token>" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/repos/Yipjunwei/playwrightformfiller/actions/workflows/playwright.yml/dispatches \
    -d '{"ref":"main"}'
  ```
  No output / an empty response means it worked. An error message means the token or header is wrong.

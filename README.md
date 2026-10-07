# Playwright Form Filler Template

This repository is a template for automatically filling and submitting a Microsoft Forms visitor registration form with [Playwright](https://playwright.dev/).

You can run it from your computer, trigger it manually from GitHub Actions, or create an iPhone Shortcut that starts the GitHub Actions workflow.

> [!WARNING]
> Every successful run submits a real form response. This may issue a real visitor pass by SMS or email. Do not run the test repeatedly unless you intend to create those entries.

## 1. Create your own repository

Click **Use this template** at the top of this GitHub repository, then select **Create a new repository**.

Alternatively, clone the project and connect it to a new repository:

```bash
git clone https://github.com/Yipjunwei/NexusEntryFormFiller.git
cd NexusEntryFormFiller
git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Replace:

- `YOUR_GITHUB_USERNAME` with your GitHub username.
- `YOUR_REPOSITORY_NAME` with the name of your new repository.

## 2. Enter your name and phone number

Open [`tests/submit-form.spec.ts`](tests/submit-form.spec.ts). Find these two lines and replace the placeholder text:

```ts
await page.locator('input[data-automation-id="textInput"]').nth(0).fill('YOUR NAME');
```

```ts
await page.locator('input[data-automation-id="textInput"]').nth(2).fill('YOUR NUMBER');
```

For example:

```ts
.fill('Alex Tan');
.fill('91234567');
```

Also check the other template values in the same file:

- Access level/floor: currently `5`
- Purpose: currently `Staff`
- Company: currently `Cognizant`
- Locally registered number: currently `Yes | 有`
- `FORM_URL`: replace this if you want to automate a different Microsoft Form

The options and element selectors are specific to the form. If the form owner changes its questions or options, you may need to update the test.

> [!IMPORTANT]
> Your name and phone number are committed to the repository if you put them directly in the test. Make the repository **private** if you do not want them to be public.

## 3. Install and run it locally

Install [Node.js](https://nodejs.org/) 18 or newer, then run:

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

To watch Playwright fill the form in a visible browser:

```bash
npx playwright test --headed
```

After a run:

- Failure screenshots and videos are stored in `test-results/`.
- Run `npx playwright show-report` to open the HTML test report.

## 4. Run it from GitHub Actions

The workflow in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) is manual. It does not run automatically after a push because each test run submits a real form entry.

1. Push your edited files to GitHub.
2. Open your repository on GitHub.
3. Select **Actions**.
4. Select **Playwright Tests**.
5. Select **Run workflow**, then confirm **Run workflow**.

When the workflow finishes, open the run to see whether it passed. The `playwright-report` artifact can be downloaded from the run summary and contains the HTML report, screenshots, and videos produced on failure.

## 5. Create a GitHub key for an iPhone Shortcut

The key used by the Shortcut is a **fine-grained GitHub personal access token**. It allows the Shortcut to start the workflow through the GitHub API.

Create it here:

1. Sign in to GitHub and open [Create a new fine-grained personal access token](https://github.com/settings/personal-access-tokens/new). You can also reach this page from your profile picture → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Give it a name such as `Form Filler Shortcut` and choose an expiration date.
3. Under **Resource owner**, select the account that owns your form-filler repository.
4. Under **Repository access**, select **Only select repositories**, then choose your form-filler repository.
5. Under **Repository permissions**, set **Actions** to **Read and write**.
6. Generate the token and copy it immediately. GitHub will not show the full token again.

Keep this token private. Do not add it to the test, commit it to Git, place it in the README, or share a screenshot containing it. If it is exposed, revoke it in GitHub and create a new one.

## 6. Create the iPhone Shortcut

In the Apple **Shortcuts** app:

1. Create a new shortcut.
2. Add the **Get Contents of URL** action.
3. Enter the following URL, replacing both placeholders:

   ```text
   https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/actions/workflows/playwright.yml/dispatches
   ```

4. Set **Method** to `POST`.
5. Add these headers:

   | Header | Value |
   |---|---|
   | `Authorization` | `Bearer YOUR_GITHUB_TOKEN` |
   | `Accept` | `application/vnd.github+json` |
   | `Content-Type` | `application/json` |

6. Set **Request Body** to **Text** and enter:

   ```json
   {"ref":"main"}
   ```

7. Give the Shortcut a name and run it.

The `Authorization` value must contain the word `Bearer`, one space, and then your token. Do not include quotation marks around it.

If your repository uses a default branch other than `main`, replace `main` in the request body with that branch name.

## Troubleshooting

### The Shortcut says “Requires authentication”

- Check that the header is exactly `Bearer YOUR_GITHUB_TOKEN`.
- Check that the token has not expired or been revoked.
- Confirm that the token has access to the correct repository.
- Confirm that **Actions** permission is set to **Read and write**.

### The workflow does not appear in GitHub Actions

- Confirm that `.github/workflows/playwright.yml` exists on the repository's default branch.
- Open the **Actions** tab and enable workflows if GitHub asks you to do so.

### The test cannot find a field or option

The Microsoft Form may have changed. Run the test with `--headed`, inspect the current questions and options, and update [`tests/submit-form.spec.ts`](tests/submit-form.spec.ts).

## Files in this template

| File | Purpose |
|---|---|
| `tests/submit-form.spec.ts` | Form URL, personal details, form selections, and submission test |
| `playwright.config.ts` | Playwright browser, timeout, screenshot, and video settings |
| `.github/workflows/playwright.yml` | Manually triggered GitHub Actions workflow |
| `package.json` | Node.js dependencies and test command |

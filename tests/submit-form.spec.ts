import { test, expect } from '@playwright/test';

const FORM_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=WGeXB8aT70uz3FOGA9yRbsbr_tTOC29AvupnhyEvx8FUNlFMQlVGMFNQUjJNUFZOTUJTMlk0SElTWSQlQCN0PWcu&origin=QRCode';

test('submit Microsoft Form', async ({ page }) => {
  await page.goto(FORM_URL, { waitUntil: 'networkidle' });

  await page.waitForSelector('input[data-automation-id="textInput"]', { timeout: 30_000 });

  // Q1 — Name | 姓名
  await page.locator('input[data-automation-id="textInput"]').nth(0).fill('Yip Jun Wei');

  // Q2 — Access Levels # | 楼层 (custom dropdown)
  await page.locator('div[aria-describedby="re558e0e544da4a85bf49b674ee74439b_placeholder_content"]').click();
  await page.getByRole('option', { name: '5' }).click(); // replace with an actual option

  // Q3 — Purpose | 参观目的 (custom dropdown)
  await page.locator('div[aria-describedby="r531850efbc704d2cabb1f836157cd57a_placeholder_content"]').click();
  await page.getByRole('option', { name: 'Staff' }).click(); // replace with an actual option

  // Q4 — Company | 公司
  await page.locator('input[data-automation-id="textInput"]').nth(1).fill('Cognizant');

  // Q5 — Do you have a locally registered number? | 你有本地注册号码吗?
  await page.getByRole('radio', { name: 'Yes | 有' }).click();
  // Q6 — Mobile | 手机号码 (only visible after selecting Yes on Q5)
  await page.locator('input[data-automation-id="textInput"]').nth(2).fill('96480659');

  // Submit
  await page.locator('button[data-automation-id="submitButton"]').click();

  await expect(
    page.getByText(/registration is successful/i)
  ).toBeVisible({ timeout: 15_000 });
});

import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
export async function verifyForms(browser, base) {
  const context = await browser.newContext();
  let mode = 'success', requests = [], pending;
  // Intercept the entire provider origin before opening any form.
  await context.route('https://formsubmit.co/**', async route => {
    requests.push({ url: route.request().url(), body: route.request().postData() });
    if (mode === 'network') return route.abort('failed');
    if (mode === 'pending') { pending = route; return; }
    if (mode === 'http') return route.fulfill({ status: 500, body: 'Service unavailable' });
    if (mode === 'malformed') return route.fulfill({ status: 200, body: 'not json' });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: mode === 'success' ? 'true' : false }) });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(10000);
  await page.clock.install();
  const fill = async (path = '/contact-us/', advance = true) => {
    await page.goto(base + path);

    await page.locator('[name=name]').fill('QA Visitor');
    await page.locator('[name=email]').fill('visitor@example.com');
    await page.locator('[name=phone]').fill('9876543210');
    if (await page.locator('[name=location]').count()) await page.locator('[name=location]').fill('Siliguri');
    await page.locator('[name=building]').selectOption('Residential');
    await page.locator('[name=interest]').selectOption('Home Lifts');
    await page.locator('[name=message]').fill('Mock-only enquiry. Please do not deliver.');
    await page.locator('[name=consent]').check();
    if (advance) await page.clock.fastForward(2000);
  };
  const send = () => page.getByRole('button', { name: 'Send Enquiry', exact: true }).click();
  await page.goto(base + '/request-a-quote/?interest=Home%20Lifts&service=Maintenance');
  assert.equal(await page.locator('[name=interest]').inputValue(), 'Home Lifts');
  assert.equal(await page.locator('[name=service]').inputValue(), 'Maintenance');
  await page.goto(base + '/contact-us/?door=Half%20Vision%20Door');
  assert.match(await page.locator('[name=message]').inputValue(), /Half Vision Door/);
  await page.goto(base + '/contact-us/?request=callback');
  assert.match(await page.locator('[name=message]').inputValue(), /call me back/);
  for (const path of ['/', '/contact-us/', '/request-a-quote/']) {
    console.log('Mock form success', path);
    mode = 'success'; await fill(path);
    await send(); await page.waitForURL('**/thank-you/');
    const request = requests.at(-1);
    assert.equal(request.url, 'https://formsubmit.co/ajax/liftsbazar2025@gmail.com');
    for (const key of ['name','email','phone','message','consent','form-type','source-page','submission-time','_replyto','_subject']) assert.ok(request.body.includes(`name="${key}"`), `Payload ${key}`);
    assert.ok(request.body.includes('Asia/Kolkata'));
    assert.ok(request.body.includes('visitor@example.com'));
    await page.goBack();
    assert.equal(await page.getByRole('button', { name: 'Send Enquiry', exact: true }).isEnabled(), true);
    assert.equal(await page.locator('[name=name]').inputValue(), 'QA Visitor');
  }
  console.log('Mock validation, consent and honeypot');
  await fill();
  const before = requests.length;
  await page.locator('[name=name]').fill('A');
  await page.locator('[name=email]').fill('invalid');
  await page.locator('[name=phone]').fill('123');
  await page.locator('[name=message]').fill('short');
  await page.locator('[name=consent]').uncheck();
  await send();
  assert.equal(await page.locator('[aria-invalid=true]').count(), 5);
  assert.equal(await page.locator('[name=name]').evaluate(e => e === document.activeElement), true);
  assert.equal(requests.length, before);
  assert.match(await page.locator('.form-status').textContent(), /correct/);
  const invalidState = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  if (invalidState.violations.length) console.log(JSON.stringify(invalidState.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), null, 2));
  assert.deepEqual(invalidState.violations.map(v => v.id), [], 'Accessible field error state');
  // Manually assigned values must still obey minimum/maximum lengths.
  await fill();
  await page.locator('[name=message]').evaluate(el => el.value = 'x'.repeat(3001));
  await send(); assert.equal(requests.length, before);
  await fill();
  await page.locator('[name=_honey]').evaluate(el => el.value = 'bot');
  await send(); assert.equal(requests.length, before);
  await fill();
  await context.setOffline(true);
  await send(); assert.match(await page.locator('.form-status').textContent(), /offline/);
  assert.equal(requests.length, before);
  await context.setOffline(false);
  console.log('Mock delivery failures');
  for (mode of ['network', 'http', 'malformed', 'rejected']) {
    await fill(); await send();
    await page.waitForFunction(() => document.querySelector('.form-status')?.textContent.includes('Delivery could not be confirmed'));
    assert.equal(await page.locator('[name=message]').inputValue(), 'Mock-only enquiry. Please do not deliver.');
    assert.equal(await page.getByRole('button', { name: 'Send Enquiry', exact: true }).isEnabled(), true);
  }
  console.log('Mock timeout and pageshow');
  mode = 'pending'; await fill(); await send();
  await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
  assert.equal(await page.getByRole('button', { name: 'Send Enquiry', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Send via WhatsApp' }).isDisabled(), true);
  await page.clock.fastForward(20001);
  await page.waitForFunction(() => document.querySelector('.form-status')?.textContent.includes('timed out'));
  assert.equal(await page.locator('[name=name]').inputValue(), 'QA Visitor');
  await pending?.abort().catch(() => {});
  await page.evaluate(() => { document.querySelectorAll('button[type=submit]').forEach(b => b.disabled = true); window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
  assert.equal(await page.getByRole('button', { name: 'Send Enquiry', exact: true }).isEnabled(), true);
  await page.clock.setFixedTime(new Date('2026-10-31T12:00:00Z'));
  await fill('/contact-us/?door=Half%20Vision%20Door', false);
  await send();
  assert.match(await page.locator('.form-status').textContent(), /take a moment/);
  let opened;
  await page.evaluate(() => { window.open = url => { window.__qaWhatsapp = url; return null; }; });
  await page.getByRole('button', { name: 'Send via WhatsApp' }).click();
  opened = await page.evaluate(() => window.__qaWhatsapp);
  assert.match(opened, /^https:\/\/wa.me\/919679112375\?text=/);
  assert.ok(decodeURIComponent(opened).includes('QA Visitor'));
  await context.close();

  console.log('Mock native POST fallback');
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  let normalPost;
  await nojs.route('https://formsubmit.co/**', async route => {
    normalPost = { url: route.request().url(), body: route.request().postData() };
    await route.fulfill({ status: 302, headers: { location: base + '/thank-you/' }, body: '' });
  });
  const plain = await nojs.newPage();
  for (const path of ['/', '/contact-us/', '/request-a-quote/']) {
    await plain.goto(base + path);
    const form = plain.locator('form[data-enquiry]');
    assert.equal(await form.getAttribute('action'), 'https://formsubmit.co/liftsbazar2025@gmail.com');
    assert.equal(await form.getAttribute('method'), 'POST');
    await form.locator('[name=name]').fill('QA Visitor');
    await form.locator('[name=email]').fill('visitor@example.com');
    await form.locator('[name=phone]').fill('9876543210');
    if (await form.locator('[name=location]').count()) await form.locator('[name=location]').fill('Siliguri');
    await form.locator('[name=building]').selectOption('Residential');
    await form.locator('[name=interest]').selectOption('Home Lifts');
    await form.locator('[name=message]').fill('Mock fallback submission without sending an email.');
    assert.equal(await form.evaluate(f => f.checkValidity()), false);
    await form.locator('[name=consent]').check();
    await form.locator('[name=phone]').fill('123456789');
    assert.equal(await form.evaluate(f => f.checkValidity()), false);
    await form.locator('[name=phone]').fill('+91 9679112375');
    assert.equal(await form.evaluate(f => f.checkValidity()), true);
    await form.locator('[name=phone]').fill('(91) 9679112375');
    assert.equal(await form.evaluate(f => f.checkValidity()), true);
    await plain.getByRole('button', { name: 'Send Enquiry', exact: true }).click();
    await plain.waitForURL('**/thank-you/');
    assert.equal(normalPost.url, 'https://formsubmit.co/liftsbazar2025@gmail.com');
    const body = new URLSearchParams(normalPost.body);
    assert.equal(body.get('_next'), 'https://www.lbelevators.com/thank-you/');
    assert.equal(body.get('email'), 'visitor@example.com');
    assert.ok(body.get('consent'));
  }
  await nojs.close();
  return 'All three forms: mocked success, payload, Back/pageshow, validation, consent, honeypot, offline, HTTP/network/JSON/provider failure, 20s timeout, WhatsApp and no-JS POST fallback passed; no real requests sent.';
}

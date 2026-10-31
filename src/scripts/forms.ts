import { fieldError } from './form-validation';

const params = new URLSearchParams(location.search);
document.querySelectorAll<HTMLFormElement>('[data-enquiry]').forEach((form) => {
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  for (const name of ['interest', 'service']) {
    const control = field(name) as HTMLSelectElement | null;
    const value = params.get(name);
    if (control && value && [...control.options].some(o => o.value === value)) control.value = value;
  }
  const message = field('message');
  if (message && params.has('door')) message.value = `I would like to enquire about the ${params.get('door')?.slice(0, 150)}.`;
  if (message && params.get('request') === 'callback') message.value = 'Please call me back to discuss my elevator requirements.';
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const buttons = [...form.querySelectorAll<HTMLButtonElement>('button[type=submit]')];
  form.querySelector<HTMLElement>('[data-whatsapp-button]')!.hidden = false;
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([type=hidden]):not([name=_honey]), textarea, select')];
  for (const control of fields) {
    const error = document.createElement('span');
    error.id = `${control.id}-error`;
    error.className = 'field-error';
    error.hidden = true;
    control.setAttribute('aria-describedby', error.id);
    control.insertAdjacentElement('afterend', error);
  }
  form.noValidate = true;
  const started = Date.now();
  let sending = false;
  const idle = () => { sending = false; buttons.forEach(b => b.disabled = false); form.removeAttribute('aria-busy'); };
  window.addEventListener('pageshow', () => { idle(); status.textContent = ''; });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    let first: HTMLElement | undefined;
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    for (const control of fields) {
      const error = fieldError({ name: control.name, value: control.value, type: control.type, required: control.required,
        checked: control instanceof HTMLInputElement ? control.checked : undefined,
        minLength: 'minLength' in control ? control.minLength : undefined,
        maxLength: 'maxLength' in control ? control.maxLength : undefined,
        allowedValues: control instanceof HTMLSelectElement ? [...control.options].map(o => o.value) : undefined,
      }, today);
      const node = document.getElementById(`${control.id}-error`)!;
      node.textContent = error;
      node.hidden = !error;
      control.setAttribute('aria-invalid', String(Boolean(error)));
      if (error && !first) first = control;
    }
    if (first) { status.textContent = 'Please correct the highlighted fields before sending your enquiry.'; first.focus(); return; }
    if (field('_honey')?.value) { status.textContent = 'Your enquiry could not be sent. Please call or email our team.'; return; }
    const data = new FormData(form);
    for (const [key, value] of data) if (typeof value === 'string') data.set(key, value.trim());
    const summary = [...data].filter(([key]) => !key.startsWith('_')).map(([key, value]) => `${key}: ${value}`).join('\n');
    if ((event as SubmitEvent).submitter?.getAttribute('data-channel') === 'whatsapp') {
      window.open(`https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(`Hello LB Elevators, I have an enquiry.\n\n${summary}`)}`, '_blank', 'noopener');
      status.textContent = 'WhatsApp has opened with your enquiry. Review the message and press send.';
      return;
    }
    if (Date.now() - started < 1500) { status.textContent = 'Please take a moment to review your details, then send again.'; return; }
    if (!navigator.onLine) { status.textContent = 'You appear to be offline. Reconnect and try again. Your details are still here.'; return; }
    data.set('_subject', `New enquiry from ${String(data.get('name')).replace(/[\r\n]/g, ' ')}: ${data.get('interest')}`);
    data.set('_replyto', String(data.get('email')));
    data.set('source-page', location.href);
    data.set('submission-time', `${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST (Asia/Kolkata)`);
    sending = true;
    buttons.forEach(b => b.disabled = true);
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.dataset.endpoint!, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('Delivery rejected');
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Delivery unconfirmed');
      location.assign('/thank-you/');
    } catch {
      status.textContent = controller.signal.aborted
        ? 'The request timed out. Delivery is unconfirmed; your details are still here. Please call +91 9679112375 or email liftsbazar2025@gmail.com before retrying to avoid duplicates.'
        : 'Delivery could not be confirmed. Your details are still here. Please try again, call +91 9679112375 or email liftsbazar2025@gmail.com.';
    } finally { window.clearTimeout(timeout); idle(); }
  });
});

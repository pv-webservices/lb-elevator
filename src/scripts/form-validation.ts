export function fieldError(field: { name: string; value: string; type: string; required: boolean; checked?: boolean; minLength?: number; maxLength?: number; allowedValues?: string[] }, today: string): string {
  const value = field.value.trim();
  if (field.type === 'checkbox') return field.required && !field.checked ? 'Please agree to the privacy policy to continue.' : '';
  if (!value) return field.required ? 'Please complete this field.' : '';
  if (field.minLength && field.minLength > 0 && value.length < field.minLength) return `Please enter at least ${field.minLength} characters.`;
  if (field.maxLength && field.maxLength > 0 && value.length > field.maxLength) return `Please use no more than ${field.maxLength} characters.`;
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  if (field.name === 'phone' && (!/^\+?[\d\s()-]+$/.test(value) || !/^\d{10,15}$/.test(value.replace(/\D/g, '')))) return 'Enter a phone number with 10–15 digits.';
  if (field.type === 'date' && value < today) return 'Please choose today or a future date.';
  if (field.allowedValues && !field.allowedValues.includes(value)) return 'Please choose one of the listed options.';
  return '';
}

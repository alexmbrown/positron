export function isDefined(value: any) {
  return typeof value !== 'undefined'
}

export function isUndefined(value: any) {
  return typeof value === 'undefined'
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function isInteger(value: any) {
  return Number.isInteger(value);
}

export function isNumberArray(value: any) {
  return Array.isArray(value) &&
    value.reduce((v: any, acc: boolean) => acc && typeof v === 'number', true);
}

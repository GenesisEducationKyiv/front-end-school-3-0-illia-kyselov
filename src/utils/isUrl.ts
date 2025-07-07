export const isUrl = (v = ''): true | string =>
    /^https?:\/\/[^\s]+?\.[^\s]+$/i.test(v) || 'Must be valid URL';

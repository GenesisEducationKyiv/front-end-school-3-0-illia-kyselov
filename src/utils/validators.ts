export const isUrl = (v = ''): true | string =>
    v.startsWith('https://') || 'Must start with https://';

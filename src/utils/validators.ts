export const isUrl = (v = ''): true | string =>
    /^https?:\/\/.+\..+/.test(v) || 'Must be valid URL'

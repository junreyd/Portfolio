export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
export const cn = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ')

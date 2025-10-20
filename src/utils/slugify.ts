import slugify from 'slugify'

export const convertToSlug = (text: string) => {
  return slugify(text, { lower: true, strict: true, locale: 'vi' })
}

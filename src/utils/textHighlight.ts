import React from 'react'

/**
 * Highlights search terms in text with yellow background
 * @param text - The text to highlight
 * @param searchTerm - The term to highlight (case insensitive)
 * @returns React elements with highlighted terms
 */
export const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Split text by search term (case insensitive)
  const parts = text.split(new RegExp(`(${escapedSearchTerm})`, 'gi'))

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase()
      ? React.createElement(
          'span',
          {
            key: index,
            className: 'bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded'
          },
          part
        )
      : part
  )
}

/**
 * Highlights search terms in HTML content safely
 * @param htmlContent - HTML content as string
 * @param searchTerm - The term to highlight (case insensitive)
 * @returns HTML string with highlighted terms
 */
export const highlightHtmlContent = (htmlContent: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return htmlContent

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Only highlight text content, not inside HTML tags
  // This regex finds the search term only when it's not inside HTML tags
  const regex = new RegExp(`(${escapedSearchTerm})(?![^<]*>)`, 'gi')

  return htmlContent.replace(
    regex,
    '<span class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">$1</span>'
  )
}

/**
 * Removes HTML tags and highlights search terms in plain text
 * @param htmlContent - HTML content as string
 * @param searchTerm - The term to highlight (case insensitive)
 * @returns React elements with highlighted terms (HTML stripped)
 */
export const highlightTextFromHtml = (htmlContent: string, searchTerm: string): React.ReactNode => {
  // Strip HTML tags to get plain text
  const plainText = htmlContent.replace(/<[^>]*>/g, '')

  return highlightText(plainText, searchTerm)
}

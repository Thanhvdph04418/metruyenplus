// TypeScript declarations for Cloudflare Turnstile API
// Documentation: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

declare global {
  interface Window {
    turnstile?: {
      /**
       * Renders a Turnstile widget in the specified container
       * @param element - CSS selector or HTMLElement where the widget will be rendered
       * @param options - Configuration options for the widget
       * @returns Widget ID that can be used for subsequent operations
       */
      render: (
        element: string | HTMLElement,
        options: {
          /** Site key from Cloudflare dashboard */
          sitekey: string
          /** Callback function called when verification succeeds */
          callback?: (token: string) => void
          /** Callback function called when verification fails */
          'error-callback'?: () => void
          /** Callback function called when token expires */
          'expired-callback'?: () => void
          /** Theme for the widget */
          theme?: 'light' | 'dark' | 'auto'
          /** Size of the widget */
          size?: 'normal' | 'compact'
          /** Action name for this widget (max 32 characters) */
          action?: string
          /** Custom data to be passed to the backend */
          cData?: string
          /** Tab index for accessibility */
          tabindex?: number
          /** Response field name (default: 'cf-turnstile-response') */
          'response-field'?: boolean
          /** Response field name (default: 'cf-turnstile-response') */
          'response-field-name'?: string
          /** Retry behavior on failure */
          retry?: 'auto' | 'never'
          /** Retry interval in milliseconds (default: 8000) */
          'retry-interval'?: number
          /** Refresh token expiration behavior */
          'refresh-expired'?: 'auto' | 'manual' | 'never'
          /** Language code (default: auto-detect) */
          language?: string
          /** Execution mode */
          execution?: 'render' | 'execute'
          /** Appearance mode */
          appearance?: 'always' | 'execute' | 'interaction-only'
        }
      ) => string

      /**
       * Resets a Turnstile widget
       * @param widgetId - Widget ID returned from render()
       */
      reset: (widgetId: string) => void

      /**
       * Removes a Turnstile widget from the DOM
       * @param widgetId - Widget ID returned from render()
       */
      remove: (widgetId: string) => void

      /**
       * Gets the response token from a Turnstile widget
       * @param widgetId - Widget ID returned from render()
       * @returns Token string if available, undefined otherwise
       */
      getResponse: (widgetId: string) => string | undefined

      /**
       * Check if a Turnstile widget is expired
       * @param widgetId - Widget ID returned from render()
       * @returns true if expired, false otherwise
       */
      isExpired: (widgetId: string) => boolean
    }
  }
}

export {}

import toast from 'react-hot-toast'
import { ComicMessage } from '@/components/ComicMessage'
import type { ComicMessageType } from '@/components/ComicMessage'

const DEFAULT_DURATION = 2500

type ComicToastOptions = { duration?: number; title?: string }

export interface ComicToastApi {
  success: (message: string, options?: ComicToastOptions) => string
  error: (message: string, options?: ComicToastOptions) => string
  info: (message: string, options?: ComicToastOptions) => string
  warning: (message: string, options?: ComicToastOptions) => string
  show: (type: ComicMessageType, message: string, options?: ComicToastOptions) => string
  dismiss: (id?: string) => void
  dismissAll: () => void
}

/**
 * Show a comic-style message using react-hot-toast.
 * Use these instead of plain toast.success/error for a consistent manga/comic look.
 */
export const comicToast: ComicToastApi = {
  success: (message: string, options?: { duration?: number; title?: string }) => {
    return toast.custom(
      (t) => (
        <ComicMessage
          type='success'
          message={message}
          title={options?.title}
          visible={t.visible}
          duration={options?.duration ?? DEFAULT_DURATION}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: options?.duration ?? DEFAULT_DURATION }
    )
  },

  error: (message: string, options?: { duration?: number; title?: string }) => {
    return toast.custom(
      (t) => (
        <ComicMessage
          type='error'
          message={message}
          title={options?.title}
          visible={t.visible}
          duration={options?.duration ?? DEFAULT_DURATION}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: options?.duration ?? DEFAULT_DURATION }
    )
  },

  info: (message: string, options?: { duration?: number; title?: string }) => {
    return toast.custom(
      (t) => (
        <ComicMessage
          type='info'
          message={message}
          title={options?.title}
          visible={t.visible}
          duration={options?.duration ?? DEFAULT_DURATION}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: options?.duration ?? DEFAULT_DURATION }
    )
  },

  warning: (message: string, options?: { duration?: number; title?: string }) => {
    return toast.custom(
      (t) => (
        <ComicMessage
          type='warning'
          message={message}
          title={options?.title}
          visible={t.visible}
          duration={options?.duration ?? DEFAULT_DURATION}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: options?.duration ?? DEFAULT_DURATION }
    )
  },

  /** Show message with custom type (e.g. from API response) */
  show: (
    type: ComicMessageType,
    message: string,
    options?: { duration?: number; title?: string }
  ) => {
    return toast.custom(
      (t) => (
        <ComicMessage
          type={type}
          message={message}
          title={options?.title}
          visible={t.visible}
          duration={options?.duration ?? DEFAULT_DURATION}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: options?.duration ?? DEFAULT_DURATION }
    )
  },

  dismiss: (id?: string) => toast.dismiss(id),
  dismissAll: () => toast.dismiss()
}

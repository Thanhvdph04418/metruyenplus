export interface FileValidationError {
  type: 'size' | 'type' | 'unknown'
  message: string
}

export interface FileValidationResult {
  valid: boolean
  error?: FileValidationError
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 2MB based on existing CustomerInfo.tsx)
 * @returns Validation result
 */
export const validateFileSize = (file: File, maxSizeMB: number = 2): FileValidationResult => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: {
        type: 'size',
        message: `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`
      }
    }
  }

  return { valid: true }
}

/**
 * Validate file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types (default: image types)
 * @returns Validation result
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
): FileValidationResult => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: {
        type: 'type',
        message: `Định dạng file không hợp lệ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
      }
    }
  }

  return { valid: true }
}

/**
 * Validate file (combines size and type validation)
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  options?: {
    maxSizeMB?: number
    allowedTypes?: string[]
  }
): FileValidationResult => {
  const sizeValidation = validateFileSize(file, options?.maxSizeMB)
  if (!sizeValidation.valid) return sizeValidation

  const typeValidation = validateFileType(file, options?.allowedTypes)
  if (!typeValidation.valid) return typeValidation

  return { valid: true }
}

/**
 * Create preview URL for image file
 * @param file - File to create preview for
 * @returns Object URL string
 */
export const createFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revoke preview URL to free memory
 * @param url - Object URL to revoke
 */
export const revokeFilePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}

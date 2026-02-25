export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Validation result
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { valid: false, error: 'Email không được để trống' }
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email không hợp lệ' }
  }

  return { valid: true }
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message (default: 'Trường')
 * @returns Validation result
 */
export const validateRequired = (
  value: string | null | undefined,
  fieldName: string = 'Trường'
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} không được để trống` }
  }

  return { valid: true }
}

/**
 * Validate min length
 * @param value - Value to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error message (default: 'Trường')
 * @returns Validation result
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'Trường'
): ValidationResult => {
  if (value.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} phải có ít nhất ${minLength} ký tự`,
    }
  }

  return { valid: true }
}

/**
 * Validate max length
 * @param value - Value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error message (default: 'Trường')
 * @returns Validation result
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'Trường'
): ValidationResult => {
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} không được vượt quá ${maxLength} ký tự`,
    }
  }

  return { valid: true }
}

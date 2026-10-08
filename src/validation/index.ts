export function validateRequired(value: string, label: string): string {
  if (!value || !value.trim()) {
    return `${label} is required`
  }
  return ''
}

export function validateEmail(value: string): string {
  if (!value || !value.trim()) {
    return 'Email is required'
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value)) {
    return 'Enter a valid email address'
  }
  return ''
}

export function validatePassword(value: string): string {
  if (!value) {
    return 'Password is required'
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must contain at least one letter and one digit'
  }
  return ''
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
  if (!confirmPassword) {
    return 'Please confirm your password'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return ''
}

export function validateMaxLength(value: string, max: number, label: string): string {
  if (value.length > max) {
    return `${label} must be ${max} characters or fewer`
  }
  return ''
}

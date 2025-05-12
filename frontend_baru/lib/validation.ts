export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, with at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return passwordRegex.test(password)
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - can be enhanced based on specific requirements
  const phoneRegex = /^[0-9]{10,15}$/
  return phoneRegex.test(phone)
}

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5
}

export function validateNonEmptyString(str: string): boolean {
  if (str.trim() === '') {
    return false
  }
  return true
}

export function validateSameStringValue(str1: String, str2: String): boolean {
  return str1 === str2 && str1 !== '' && str2 !== ''
}

export function validatePassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-]).{6,}$/
  return passwordRegex.test(password)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[+]?[0-9]{1,4}?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}
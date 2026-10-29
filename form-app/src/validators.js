// Each validator returns an error message, or '' when the value is valid.
export const validators = {
  name: (v) => {
    if (!v.trim()) return 'Name is required.'
    if (v.trim().length < 2) return 'Name must be at least 2 characters.'
    return ''
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.'
    return ''
  },
  age: (v) => {
    if (v === '') return 'Age is required.'
    const n = Number(v)
    if (!Number.isInteger(n)) return 'Age must be a whole number.'
    if (n < 18 || n > 120) return 'Age must be between 18 and 120.'
    return ''
  },
  password: (v) => {
    if (!v) return 'Password is required.'
    if (v.length < 8) return 'Password must be at least 8 characters.'
    if (!/\d/.test(v) || !/[a-zA-Z]/.test(v)) return 'Use both letters and numbers.'
    return ''
  },
  confirm: (v, values) => {
    if (!v) return 'Please confirm your password.'
    if (v !== values.password) return 'Passwords do not match.'
    return ''
  },
}

export const validateField = (name, values) => validators[name](values[name], values)

export const validateAll = (values) =>
  Object.fromEntries(Object.keys(validators).map((k) => [k, validateField(k, values)]))

import { useState } from 'react'
import { validateField, validateAll } from './validators.js'

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  { name: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
]

const initial = { name: '', email: '', age: '', password: '', confirm: '' }

export default function App() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value }
    setValues(next)
    setSubmitted(false)
    // Re-validate live; confirm depends on password.
    setErrors((prev) => {
      const updated = { ...prev, [name]: validateField(name, next) }
      if (name === 'password' && touched.confirm) updated.confirm = validateField('confirm', next)
      return updated
    })
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const all = validateAll(values)
    setErrors(all)
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])))
    if (Object.values(all).every((m) => !m)) {
      setSubmitted(true)
      setValues(initial)
      setTouched({})
      setErrors({})
    }
  }

  return (
    <main className="card">
      <h1>Create account</h1>
      {submitted && (
        <p className="banner" role="status">
          ✓ Form submitted successfully!
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map(({ name, label, type, autoComplete }) => {
          const error = errors[name]
          const state = !touched[name] ? '' : error ? 'invalid' : 'valid'
          return (
            <div className={`field ${state}`} key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={values[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={state === 'invalid'}
                aria-describedby={`${name}-msg`}
              />
              <small id={`${name}-msg`} role={state === 'invalid' ? 'alert' : undefined}>
                {state === 'invalid' && error}
                {state === 'valid' && '✓ Looks good'}
              </small>
            </div>
          )
        })}
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'toean-secret-key'

const encrypt = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
const decrypt = (data) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch {
    return null
  }
}

export const setAuth = (data) => {
  localStorage.setItem('auth', encrypt(data))
}

export const getAuth = () => {
  const data = localStorage.getItem('auth')
  return data ? decrypt(data) : null
}

export const clearAuth = () => {
  localStorage.removeItem('auth')
}

export const setRemembered = (credentials) => {
  localStorage.setItem('remembered', encrypt(credentials))
}

export const getRemembered = () => {
  const data = localStorage.getItem('remembered')
  return data ? decrypt(data) : null
}

export const clearRemembered = () => {
  localStorage.removeItem('remembered')
}

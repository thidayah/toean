import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'my_secret_key_123'

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Failed to decrypt auth data:', error)
    return null
  }
}

export const setAuth = (data) => {
  const encrypted = encrypt(data)
  localStorage.setItem('auth', encrypted)
}

export const getAuth = () => {
  const encrypted = localStorage.getItem('auth')
  if (!encrypted) return null
  return decrypt(encrypted)
}

export const clearAuth = () => {
  localStorage.removeItem('auth')
}

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, redirecting to login...')
      // contoh: redirect atau hapus token
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const getData = async (url, params = {}) => {
  const response = await api.get(url, { params })
  return response.data
}

export const postData = async (url, body = {}) => {
  const response = await api.post(url, body)
  return response.data
}

export const postFormData = async (url, formObj = {}) => {
  const formData = new FormData()
  Object.keys(formObj).forEach((key) => {
    formData.append(key, formObj[key])
  })

  const response = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const putData = async (url, body = {}) => {
  const response = await api.put(url, body)
  return response.data
}

export const patchData = async (url, body = {}) => {
  const response = await api.patch(url, body)
  return response.data
}

export const deleteData = async (url, body = null) => {
  const response = await api.delete(url, { data: body })
  return response.data
}

export default api

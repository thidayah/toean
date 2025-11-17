import axios from 'axios'
import { clearAuth, getAuth } from "@/utils/auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const auth = getAuth()
    if (auth) {
      config.headers["Authorization"] = `Bearer ${auth?.token}`;
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 500;

    if (status === 401) {
      clearAuth()
      setTimeout(() => {
        window.location.href = '/'
      }, 1500);
    }

    const err = {
      status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      data: error.response?.data || null,
    };
    return Promise.reject(err);
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

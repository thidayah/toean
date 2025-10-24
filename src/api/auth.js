// src/api/user.js
import api from './axios'

export const login = (data) => api.post('/cms/v1/login', data)
export const getProfile = () => api.get(`/cms/v1/profile/${id}`)


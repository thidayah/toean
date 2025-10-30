import { getData, postData } from './axios'

export const apiLogin = (data) => postData('/cms/v1/login', data)
export const apiGetProfile = (id) => getData(`/cms/v1/profile/${id}`)


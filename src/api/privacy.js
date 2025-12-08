import { deleteData, getData, postData, putData } from './axios'

export const apiGetPrivacy = (data) => getData(`/cms/v1/privacy/sections`, data )
export const apiPostPrivacy = (data) => postData(`/cms/v1/privacy/sections`, data)
export const apiPutPrivacy = (id, data) => putData(`/cms/v1/privacy/sections/${id}`, data)
export const apiDelPrivacy = (id) => deleteData(`/cms/v1/privacy/sections/${id}`)
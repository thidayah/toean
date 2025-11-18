import { deleteData, getData, postData, putData } from './axios'

export const apiGetRoles = (data) => getData(`/cms/v1/roles`, data )
export const apiPostRole = (data) => postData(`/cms/v1/roles`, data)
export const apiPutRole = (id, data) => putData(`/cms/v1/roles/${id}`, data)
export const apiDelRole = (id) => deleteData(`/cms/v1/roles/${id}`)
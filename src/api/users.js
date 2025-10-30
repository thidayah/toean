import { deleteData, getData, postData, putData } from './axios'

export const apiGetUsers = (data) => getData(`/cms/v1/users`, data)
export const apiPostUser = (data) => postData(`/cms/v1/users`, data)
export const apiPutUser = (id, data) => putData(`/cms/v1/users/${id}`, data)
export const apiDelUser = (id) => deleteData(`/cms/v1/users/${id}`)
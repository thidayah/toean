import { deleteData, getData, postData, putData } from './axios'

export const apiGetTerms = (data) => getData(`/cms/v1/tnc/sections`, data )
export const apiPostTerm = (data) => postData(`/cms/v1/tnc/sections`, data)
export const apiPutTerm = (id, data) => putData(`/cms/v1/tnc/sections/${id}`, data)
// export const apiPostTerm = (params, data) => postData(`/cms/v1/tnc/sections?${params}`, data)
// export const apiPutTerm = (id, params, data) => putData(`/cms/v1/tnc/sections/${id}?${params}`, data)
export const apiDelTerm = (id) => deleteData(`/cms/v1/tnc/sections/${id}`)
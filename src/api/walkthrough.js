import { deleteData, getData, postFormData, putFormData } from './axios'

export const apiGetWalkthroughs = (data) => getData(`/cms/v1/walkthroughs`, data)
export const apiPostWalkthrough = (data) => postFormData(`/cms/v1/walkthroughs`, data)
export const apiPutWalkthrough = (id, data) => putFormData(`/cms/v1/walkthroughs/${id}`, data)
export const apiDelWalkthrough = (id) => deleteData(`/cms/v1/walkthroughs/${id}`)
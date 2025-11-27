import { deleteData, getData, postFormData, putFormData } from './axios'

export const apiGetBanners = (data) => getData(`/cms/v1/banners`, data)
export const apiPostBanner = (data) => postFormData(`/cms/v1/banners`, data)
export const apiPutBanner = (id, data) => putFormData(`/cms/v1/banners/${id}`, data)
export const apiDelBanner = (id) => deleteData(`/cms/v1/banners/${id}`)
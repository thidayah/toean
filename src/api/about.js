import { deleteData, getData, postData, putData } from './axios'

export const apiGetAbouts = (data) => getData(`/cms/v1/about-us/sections`, data )
export const apiPostAbout = (data) => postData(`/cms/v1/about-us/sections`, data)
export const apiPutAbout = (id, data) => putData(`/cms/v1/about-us/sections/${id}`, data)
export const apiDelAbout = (id) => deleteData(`/cms/v1/about-us/sections/${id}`)
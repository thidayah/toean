import { getData } from './axios'

export const apiGetRoles = (data) => getData(`/cms/v1/roles`, data )
import { getData, postData } from './axios'

export const apiGetDriverRegistrations = (data) => getData(`/cms/v1/driver-registrations`, data)
export const apiPostDriverApprove = (id, data) => postData(`/cms/v1/driver-registrations/${id}/approve`, data)
export const apiPostDriverReject = (id, data) => postData(`/cms/v1/driver-registrations/${id}/reject`, data)
import { toast } from "vue-sonner";

export function handleError(error) {
  if (error?.code === "ERR_NETWORK") {
    return toast.error(error?.message)
  }
  const { errors, message } = error?.data
  if (error.status === 422) {
    if (errors.length > 0) {
      return errors.forEach((el) => toast.warning(`${el?.message} ${el.key}`))
    }else{
      toast.warning(message)
    }
  } else {
    return toast.error(message || 'Api gateway error')
  }
}
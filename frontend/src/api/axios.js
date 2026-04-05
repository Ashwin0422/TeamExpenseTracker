import axios from 'axios'
import Cookies from 'js-cookie'

const API = axios.create({
  baseURL: 'https://teamexpensetracker.onrender.com/api', 
})

API.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token')
      window.location.href = '/login-signup'
    }
    return Promise.reject(err)
  }
)

export default API
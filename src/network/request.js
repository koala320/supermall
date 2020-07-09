import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3',
    timeout: 5000
  })

  //2、axios的拦截器
  //全局拦截：axios.interceptors
  //2.1实例的请求拦截
  instance.interceptors.request.use(config => {
    return config
  },err => {
    //console.log(err);
  })

  //2.2、实例的响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data
  },err => {
    // console.log(err);
  })

  return instance(config)
}

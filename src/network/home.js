import {request} from "./request";
//导出函数getHomeMultidata
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
//获取首页TabControl的商品数据
//需要传两个参数（类型type：pop/new/sell和页码page）
export function getHomeGoods(type,page) {
  return request({
    url: 'home/data',
    params: {
      type,
      page
    }
  })
}


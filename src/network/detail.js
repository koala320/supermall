import {request} from "./request";

//请求详情页的接口
export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid
    }
  })
}
//商品推荐的信息不在详情页detail里面，需要重新请求一个接口
export function getRecommend() {
  return request({
    url: '/recommend'
  })
}



//单独抽取商品基本信息的数据，封装到一个类里面
//创建对应这个类的对象，让商品基本信息的子组件面向这个对象开发
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.lowNowPrice
  }
}

export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods;
  }
}

export class GoodsParam {
  constructor(info, rule) {
    //注：images可能没有值
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}
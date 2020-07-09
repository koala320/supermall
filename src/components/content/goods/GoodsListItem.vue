<template>
  <div class="goods-item">
        <img :src="goodsItem.show.img" alt="">
        <div class="goods-info">
          <p class="title">{{goodsItem.title}}</p>
          <span class="price">¥{{goodsItem.price}}</span>
          <img src="~assets/img/common/collect.svg" alt="">
          <span class="collect">{{goodsItem.cfav}}人收藏</span>
        </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      goodsItem: {
        type:Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    width: 48%;
  }
  ul li{
    display:inline
  }
  .goods-item img{
    width: 100%;
  }
  .goods-info {
    font-size: 14px;
    text-align: left;
    padding:4px;
    margin-bottom: 10px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    position: relative;
  }
  .goods-info .title {
    height: 32px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .goods-info .price {
    color: var(--color-high-text);
    font-size: 18px;
  }
  .goods-info .collect {
    color: #cccccc;
    margin-left: 28px;
    font-size: 12px;
    height: 14px;
    line-height: 14px;
  }
  .goods-info img {
    position: absolute;
    margin-left: 10px;
    bottom: 6px;
    width: 14px;
    height: 14px;
  }
</style>
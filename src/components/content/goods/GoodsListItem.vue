<template>
  <div class="goods-item" @click="itemClick">
        <img :src="showImage" alt="" @load="imageLoad">
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
    },
    computed: {
      //当图片存放的数据结构存在不同时，为了组件可以复用，需要加一个判断：表达式1||表达式2
      //当表达式1为空时，执行表达式2
      showImage() {
        return this.goodsItem.image || this.goodsItem.show.img
      }
    },
    methods: {
      imageLoad(){
        //因为组件的复用，需要通过路由判断当前是哪个页面，需要监听图片之后刷新
        if (this.$route.path.indexOf('/home')) {
          this.$bus.$emit('homeItemImageLoad')
        }else if (this.$route.path.indexOf('/detail')) {
          this.$bus.$emit('detailItemImageLoad')
        }
      },
      itemClick() {
        this.$router.push('/detail/' + this.goodsItem.iid)
      }
    }

  }
</script>

<style scoped>
  .goods-item {
    width: 48%;
    background-color: #fff;
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
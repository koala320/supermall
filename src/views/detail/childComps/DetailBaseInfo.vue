<template>
  <!-- 判断对象是否为空 -->
  <div class="base-info" v-if="Object.keys(goods).length !== 0">
    <div class="info-title">{{goods.title}}</div>
    <div class="info-price">
      <span class="n-price">{{goods.newPrice}}</span>
      <span class="o-price">{{goods.oldPrice}}</span>
      <span class="discount" v-if="goods.discount">{{goods.discount}}</span>
    </div>
    <div class="info-other">
      <span>{{goods.columns[0]}}</span>
      <span>{{goods.columns[1]}}</span>
      <span>{{goods.services[goods.services.length - 1].name }}</span>
    </div>
    <div class="info-service">
      <span class="info-service-item"
            :key="index"
            v-for="index in goods.services.length-1">
        <img :src="goods.services[index - 1].icon" alt="">
        <span>{{goods.services[index - 1].name}}</span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailBaseInfo",
    props: {
      goods: {
        type:Object,
        default() {
          return {};
        }
      }
    }
  }
</script>

<style scoped>
  .base-info {
    width: 100%;
    margin-top: 14px;
    padding: 0 12px;
    color: #999999;
    border-bottom: 4px solid #f2f5f8;
  }
  .info-title {
    text-align: justify;
    color: #222222;
  }
  .info-price {
    margin-top: 10px;
  }
  .info-price .n-price {
    font-size: 24px;
    color: #ff5777
  }
  .info-price .o-price {
    font-size: 14px;
    margin-left: 8px;
    text-decoration: line-through;
  }
  .info-price .discount {
    font-size: 12px;
    color: #ffffff;
    border-radius: 20px;
    background-color: #ff5777;
    position: relative;
    top: -4px;
    margin-left: 12px;
    padding: 4px 10px;
  }
  .info-other {
    font-size: 14px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    border-bottom: 1px solid rgba(100, 100, 100, 0.1);
  }
  .info-service {
    line-height: 60px;
    display: flex;
    justify-content: space-between;
  }
  .info-service-item img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 2px;
  }
  .info-service-item span {
    font-size: 14px;
    margin-left: 4px;
    color: #666666;
  }
</style>
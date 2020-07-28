<template>
  <div class="detail-goods-info">
    <div class="info-desc">
      <div class="start"></div>
      <div class="desc">{{ detailInfo.desc }}</div>
      <div class="end"></div>
    </div>
    <div :key="index" v-for="(item,index) in detailInfo.detailImage">
      <div class="info-key">{{ item.key }}</div>
      <div class="info-list">
        <img :key="imageIndex"
             :src="image"
             @load="imgLoad"
             alt=""
             v-for="(image,imageIndex) in item.list">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailGoodsInfo",
    props: {
      detailInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        counter: 0,
        imagesLength: 0
      }
    },
    methods: {
      imgLoad() {
        //先this.counter += 1，再与imagesLength做对比
        //判断所有的图片都加载完了，进行一次回调就可以了
        if (++this.counter === this.imagesLength) {
          this.$emit("imageLoad");
        }
      }
    },
    watch: {
      //使用此方法监听detailInfo的属性变化，获取图片的个数
      detailInfo() {
        this.imagesLength = this.detailInfo.detailImage[0].list.length;
      }
    }
  }
</script>

<style scoped>
  .detail-goods-info {
    padding: 20px 0;
    border-bottom: 4px solid #f2f5f8;
    background-color: #fff;
  }
  .info-desc {
    padding: 0 15px;
  }
  .info-desc .start, .info-desc .end {
    position: relative;
    width: 90px;
    height: 1px;
    background-color: #a3a3a5;
  }
  .info-desc .start {
    float: left;
  }
  .info-desc .end {
    float: right;
  }
  .info-desc .start::before,
  .info-desc .end::after {
    position: absolute;
    bottom: 0;
    width: 5px;
    height: 5px;
    content: "";
    background-color: #333333;
  }
  .info-desc .end::after {
    right: 0;
  }
  .info-desc .desc {
    font-size: 14px;
    padding: 15px 0;
  }
  .info-key {
    font-size: 14px;
    margin: 10px 0 10px 14px;
    color: #333333;
  }
  .info-list img {
    width: 100%;
  }
</style>
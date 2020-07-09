<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecommendView",
    //1、首先获取数据，因为数据在Home.vue，需要用props的父传子
    props: {
      recommends: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .recommend {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 12px;
    padding: 10px 0 20px;
    border-bottom: 8px solid #f0f0f0;
  }
  .recommend-item {
    flex: 1;

  }
  .recommend-item img{
    width: 70px;
    height: 70px;
    margin-bottom: 8px;
  }
</style>
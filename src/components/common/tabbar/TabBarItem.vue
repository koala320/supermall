<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
<!--    <img src="../../assets/img/tabbar/home.svg" alt="">-->
<!--    <div>首页</div>-->
  </div>

</template>

<script>
    export default {
      name: "TabBarItem",
      props: {
        path: String,
        activeColor: {
          type: String,
          default: 'red'
        }
      },
      data() {
        return {
          // isActive:true
        }
      },
      computed: {
        isActive() {
          // /home -> item1(/home) = true
          // /home -> item1(/category) = false
          //indexOf方法：检索this.$route.path字符串中，是否含有this.path，没有则返回-1;
          // 即检测当前path是否是活跃路由（$route.path）,是则isActive为true
          return this.$route.path.indexOf(this.path) !== -1
        },
        activeStyle() {
          //先去isActive()里找当前项是否为活跃路由，是则color:this.activeColor，否则使用默认颜色{}
          return this.isActive ? {color:this.activeColor} :{}
        }
      },
      methods: {
        itemClick() {
          this.$router.push(this.path)
        }
      }
    }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
    color: #8a8a8a;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top:3px;
    margin-bottom: 2px;
    vertical-align: middle;
  }
</style>

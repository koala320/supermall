<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles"
         class="tab-control-item"
         :class="{active: index === currentIndex}" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        //当对象类型是数组或对象是default必须是一个函数
        default() {
          return []
        }
      }
    },
    data() {
      return {
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        //内部点击切换效果
        this.currentIndex = index;
        //把点击事件传出去，告诉外面点击了哪个(参数index)
        this.$emit('tabClick',index)
      }
    }
  }

</script>

<style scoped>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 16px;
    background-color: #ffffff;
    z-index: 4;
  }
  .tab-control-item {
    flex: 1;
    height: 40px;
    line-height: 40px;
  }
  .tab-control-item span{
    padding-bottom: 5px;
  }
  .active {
    color: var(--color-high-text);
  }
  .active span{
    border-bottom: 3px solid var(--color-tint);
  }
</style>


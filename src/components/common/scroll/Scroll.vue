<template>
<!--  ref/children -->
<!--  ref如果是绑定在组件中的，那么通过this.$refs.refname获取到的是一个组件对象-->
<!--  ref如果是绑定在普通的元素中，那么通过this.$refs.refname获取到的是一个元素对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default() {
          return 0;
        }
      },
      pullUpLoad: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //1、创建BScroll对象
      //使用ref属性，可以在class重名的情况下，保证拿到的是组件内的这个wrapper
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        //因为有的页面不需要实时监听，所以需要实时传入probeType的值
        probeType: this.probeType,
        //不是所有页面都需要上拉加载更多，所以不要直接设置为pullUpLoad:true
        pullUpLoad: this.pullUpLoad
      })
      //2、监听滚动的位置
      this.scroll.on('scroll',(position => {
        // console.log(position);
        //在子组件中自定义一个事件把position发出去
        this.$emit('scroll',position)
      }))
      //3、监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp',() => {
          // console.log('监听滚动到底部');
          //子组件往父组件回调
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      //封装ScrollTo方法
      scrollTo(x,y,time=300) {
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      //上拉加载更多，请求多次数据,利用&&多做一层判断，当this.scroll有值时，继续下一步表达式
      finishPullUp(){
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      //记录当前滚动的y值
      getScrollY() {
        //这里多做一层判断，当this.scroll.y有值的情况下取出，没有值的时候为0
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
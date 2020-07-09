<template>
    <div id="home">
      <!--Home页的导航栏-->
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <!--Home页的轮播图-->
        <home-swiper :banners="banners"/>
        <!--Home页的推荐信息-->
        <recommend-view :recommends="recommends"/>
        <!--Home页的本周流行-->
        <feature-view/>
        <!--Home页的流行、新款、精选-->
        <tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"/>
        <!--Home页的tab-control商品数据展示-->
        <goods-list :goods="showGoods" />
      </scroll>

      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
  // Home页组件
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  // 公共的业务组件
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import { getHomeMultidata, getHomeGoods } from "network/home";


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      //因为函数被调用之后，里面所有的东西都会被内存回收消失，所以需要在data中存放请求来的数据,
      return {
        //result这个变量属于这个组件，不会被内存回收
        // result:null
        banners: [],
        recommends: [],
        goods: {
          'pop': {page:0, list:[]},
          'new': {page:0, list:[]},
          'sell': {page:0, list:[]}
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //在created里面只写主要逻辑,只负责调用执行，具体的方法在methods里面写
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods: {
      /**
       *事件请求相关的方法
       * **/
      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      //回到顶部
      backClick() {
        // this.$refs.scroll.scroll.scrollTo(0,0,200)
        this.$refs.scroll.scrollTo(0,0)
      },
      //监听滚动的位置
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 800
      },
      //监听上拉加载更多
      loadMore(){
        this.getHomeGoods(this.currentType)
      },

      /**
       *网络请求相关的方法
       * **/
      //1、当Home页被创建出来时，请求多个数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          //因为变量result指向res,所以res被保存下来
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      //2、请求TabControl的商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //上拉加载更多，必须调用此方法才能请求多次数据
          this.$refs.scroll.finishPullUp()

        })
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
    padding-top: 44px;
    padding-bottom: 49px;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
  }
  .tab-control {
    /*滚动时当top值未达到规定值时，position：sticky；当达到规定值时，position:fixed；此属性在PC端有兼容问题，移动端可用*/
    position: sticky;
    top: 44px;
    z-index: 6;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content {*/
  /*  height: calc(100%-93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

</style>

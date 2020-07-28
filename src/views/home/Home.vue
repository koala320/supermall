<template>
    <div id="home">
      <!--Home页的导航栏-->
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <!--Home页的流行、新款、精选-->
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl1"
                   class="tab-control"
                   v-show="isTabControlFixed"/>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <!--Home页的轮播图-->
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <!--Home页的推荐信息-->
        <recommend-view :recommends="recommends"/>
        <!--Home页的本周流行-->
        <feature-view/>
        <!--Home页的流行、新款、精选-->
        <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl2"/>
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
  import { debounce } from "common/utils";


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
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabControlFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('Home_destroyed');
    },
    //进入Home页时，滚动到之前保存的saveY的位置，并进行一次刷新
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1、离开Home页时，把滚动的y值赋值给saveY
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      //在created里面只写主要逻辑,只负责调用执行，具体的方法在methods里面写
      //1、在首页组件创建完成后调用多个数据请求的方法
      this.getHomeMultidata()
      //2、在首页组件创建完成后调用商品数据请求的方法
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,200)
      //监听GoodsListItem中图片加载完成
      this.$bus.$on('homeItemImageLoad',() => {
        // this.$refs.scroll.refresh()
        refresh()
      })
    },
    methods: {
      /**
       *事件请求相关的方法
       * **/
      //切换标签
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
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      //回到顶部
      backClick() {
        // this.$refs.scroll.scroll.scrollTo(0,0,200)
        this.$refs.scroll.scrollTo(0,0)
      },
      //监听滚动的位置,控制BackTop组件的显示和隐藏
      contentScroll(position){
        //1、判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 800
        //2、决定tabControl是否显示
        this.isTabControlFixed = (-position.y) > this.tabOffsetTop
      },
      //上拉加载更多
      loadMore() {
        // console.log('加载更多的方法');
        this.getHomeGoods(this.currentType)
      },
      //监听轮播图是否加载完成
      swiperImageLoad() {
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       *网络请求相关的方法
       * **/
      //1、当Home页被创建出来时，请求多个数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          //因为变量result指向res,所以res被保存下来
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      //2、请求TabControl的商品数据
      getHomeGoods(type) {
        //page不能写死，要根据type类型取出当前的page
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //完成上拉加载更多，必须调用此方法才能请求多次数据,否则只有一次
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
    /*padding-top: 44px;*/
    /*padding-bottom: 49px;*/
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #ffffff;
    /*以下属性是在使用浏览器原生滚动时,为了使导航不跟随滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 1000;*/
  }
  /*.tab-control {*/
  /*  !*滚动时当top值未达到规定值时，position：sticky；当达到规定值时，position:fixed；此属性在PC端有兼容问题，移动端可用*!*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 6;*/
  /*}*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  /*.content {*/
  /*  height: calc(100%-93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

</style>

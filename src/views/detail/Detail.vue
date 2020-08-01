<template>
  <div id="detail">

    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--属性使用驼峰：topImages 传入值应该用-分隔 top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll"
  import GoodsList from "components/content/goods/GoodsList";
  import {debounce} from "common/utils";

  import {getDetail, Goods, Shop, GoodsParam} from "network/detail";
  import {getRecommend} from "network/detail";
  import {backTopMixin} from "common/mixin";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      Scroll,
      GoodsList,
      DetailBottomBar
    },
    mixins: [backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      //1、获取iid
      this.iid = this.$route.params.iid
      //2、根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        const data = res.result;
        //2、获取顶部的图片数据
        this.topImages = data.itemInfo.topImages
        //3、获取商品基本信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //4、获取店铺信息
        this.shop = new Shop(data.shopInfo)
        //5、获取商品详细信息
        this.detailInfo = data.detailInfo
        //6、获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //7、获取商品评论信息(有的商品没有评论，所以需要先做一个判断)
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //nextTick这个函数，是根据最新的数据，对应的DOM已经被渲染出来了，但是图片依然没有加载完
        //所以获取到的offsetTop的值是不包括图片的，有错误
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //
        //   this.themeTopYs.push(0);
        //   //参数的offsetTop
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   //评论的offsetTop
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   //推荐的offsetTop
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //
        //   console.log(this.themeTopYs);
        // })

      })
      //3、请求商品推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })
      //4、给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        //参数的offsetTop，减去顶部导航的高度44px
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
        //评论的offsetTop
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        //推荐的offsetTop
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
        //给数组添加一个最大值
        this.themeTopYs.push(Number.MAX_VALUE)

        // console.log(this.themeTopYs);
      },100)
    },
    mounted() {
      //图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,200)
      //监听GoodsListItem中图片加载完成
      this.$bus.$on('detailItemImageLoad',() => {
        refresh()
      })
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position) {
        // console.log(position);
        //1、获取滚动的Y值
        const positionY = -position.y
        //2、positionY和主题中值进行对比，决定当前应该显示哪个index
        // 如果当前主题的值为[0, 6211, 7029, 7244]
        // console.log(Number.MAX_VALUE);
        // positionY 大于等于0 和 小于6211 之间，index = 0
        // positionY 大于等于6211 和 小于7029 之间，index = 1
        // positionY 大于等于7029 和 小于7244 之间，index = 2
        // positionY 大于等于7244 值，index = 3
        let length = this.themeTopYs.length
        //因为额外添加了一个最大值，最后一个值没有意义，所以只要遍历前四个值即可
        for(let i=0; i < length-1; i++) {
          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
          if (this.currentIndex !==i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1] )) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
          //判断BackTop是否显示
          this.isShowBackTop = (-position.y) > 800
        }
      },
      addToCart() {
        //1、先获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        //2、用commit调用index.js里mutations的addCart方法
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product)
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 58px);
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
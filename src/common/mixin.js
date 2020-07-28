import BackTop from "components/content/backTop/BackTop";

//回到顶部
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      //回到顶部按钮的显示和隐藏
      isShowBackTop: false
    }
  },
  methods: {
    //点击回到顶部的方法
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0,0,200)
      this.$refs.scroll.scrollTo(0,0)
    }
  }
}
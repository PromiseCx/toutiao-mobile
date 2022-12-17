<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search',text)"
    >
    <!--
        不用属性来渲染搜索联想建议，这样无法使用v-html绑定text，
        使用slot插槽来渲染联想建议的文本，可用v-html来绑定text
     -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestionsAPI } from '@/api/search.js'
// 按需加载只会把使用到的成员进行打包
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [],
      /**
       * 插值表达式会默认渲染html标签
       * 也可以用v-html指令
       */
      htmlStr: ''
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // handler(value) {
      //   this.loadSearchSuggestions(value);
      // },
      immediate: true,
      // debounce函数：
      // 第一个参数： 一个函数  第二个参数：延迟时间 ms
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 300)
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestionsAPI(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取失败！')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式，//中间的内容都会当作匹配字符来使用，而不是变量
      // 如果需要根据数据变量动态的创建正则表达式，需要手动new RegExp
      // regexp:第一个参数为 要匹配的字符串，根据这个字符串创建正则对象
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  // 注意作用域scoped会导致父组件对子组件产生影响，样式不生效添加/deep/
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>

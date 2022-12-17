<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error="error"
      error-text="加载失败，请点击重试"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      try {
        const { data } = await getSearchResultAPI({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 关键字
        })
        // 将数据添加到数组当中
        const { results } = data.data
        this.list.push(...results)
        // 将本次加载的loading关闭
        this.loading = false
        // 判断是否还有数据，有则获取，没有结束finished
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
        this.$toast('shibaihuoqushuju')
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>

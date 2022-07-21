<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-druation="1500"
    >
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleListAPI } from "@/api/article";
import ArticleItem from "@/components/article-item";

export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中的loading效果
      finished: false, // 控制加载完成的finish效果，true-》没有更多了
      timestamp: null, // 控制获取下一页数据的时间戳
      error: false, // 控制失败的提示状态
      isreFreshLoading: false,
      refreshSuccessText: "success",
    };
  },
  methods: {
    // 初始化或者加载到底部的时候会触发调用onload事件，并将loading自动设置为true
    // onLoad() {
    //   // 1. 请求数据
    //   setTimeout(() => {
    //     // 2.把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 本次数据加载完成之后要把加载状态设置为结束
    //     // 加载状态结束，loading关闭以后才会触发下一次的加载更多
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了 将finish设置为true，之后不在触发加载更多
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
    async onLoad() {
      // 1. 请求数据
      try {
        const { data } = await getArticleListAPI({
          channel_id: this.channel.id,
          // timestamp:简单理解就是请求数据的页码
          // 请求第一页数据：当前数据的时间戳
          // 请求之后数据的时间戳会在当前结果返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });
        // 2.把请求结果数据放到list数组中
        const { results } = data.data;
        this.list.push(...results);

        // 本次数据加载完成之后要把加载状态设置为结束
        // 加载状态结束，loading关闭以后才会触发下一次的加载更多
        this.loading = false;

        // 数据全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳(在本次结果的属性当中)
          this.timestamp = data.data.pre_timestamp;
        } else {
          // 没有数据将finished设置为true
          this.finished = true;
        }
      } catch (error) {
        // 展示错误的提示状态
        this.error = true;
        this.loading = false;
      }

      this.loading = false;
    },

    // 下拉刷新时触发的函数
    async onRefresh() {
      // 请求获取数据
      try {
        const { data } = await getArticleListAPI({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        });
        // 将数据渲染到列表的顶部
        const { results } = data.data;
        this.list.unshift(...results);

        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false;

        this.refreshSuccessText = `刷新成功，更新了 ${results.length}条数据`;
      } catch (error) {
        this.isreFreshLoading = false;
        this.refreshSuccessText = "刷新失败！";
      }
    },
  },
};
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>

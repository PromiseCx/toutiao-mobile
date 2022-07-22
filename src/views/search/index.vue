<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 
        van-search 外层使用form，且action不为空，在ios中可以显示搜索按钮
     -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        v-fofo
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>

    <!-- 搜索建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchResult from "./components/search-result.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import { setItem, getItem } from "@/utils/storage";

export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false,
      searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || [],
    };
  },
  watch: {
    searchHistories(newVal) {
      setItem("TOUTIAO_SEARCH_HISTORIES", newVal);
    },
  },
  methods: {
    onSearch(val) {
      // 更新文本框
      this.searchText = val;
      // 搜索历史记录
      // 不要有重复搜索历史记录,最新的排在最前面
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);
      // 渲染搜索结果
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;

  .van-search__action {
    color: #fff;
  }

  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>

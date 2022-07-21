<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <template #left>
        <van-icon name="arrow-left" size="18" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            :loading="followLoading"
            icon="plus"
            @click="onFollow"
            >关注</van-button -->

          <!-- 
               在模板当中，$event是事件参数
             -->

          <!-- 
              当我们传给子组件的数据，既要使用还要修改
              传递：props
              :is-followed="article.is_followed"
              修改：自定义事件
              @update-is_followed="article.is_followed = $event"

              简写：在组件上使用v-model
                  它会给子组件传递一个 value的数据    value="article.is_followed"
                  而且会自动监听一个input事件         @input="article.is_followed = $event"

                  如果修改v-model的规则名称，可以通过子组件的model属性来配置修改

                  一个组件上只能有一个v-model

                  如果有多个数据需要实现v-model的效果，要使用 .sync修饰符
              -->
          <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          ></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        ></comment-list>

        <!-- 

          应该将文章底部放在，加载成功模板之后，
          因为，在页面渲染时，文章底部绑定数据会优先于页面发送请求来请求数据，
          因此，此时绑定数据并未请求到页面中，会报错，所以要等数据请求成功之后，在渲染文章底部

         -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >

          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />

          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          ></collect-article>

          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>

          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 

  弹出层是懒渲染，只有在第一次展示的时候才会渲染里面的内容
  之后他的关闭和显示都是在切换内容的显示和隐藏
  
 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <!-- 
        使用v-if来解决，弹出层懒加载的问题,
        让他重新渲染，关闭之后销毁组件即可，就会重新渲染
       -->
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article";
import CommentList from "./components/comment-list.vue";
import CommentPost from "./components/comment-post.vue";
import CommentReply from "./components/comment-reply.vue";

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  //  给所有的后代组件提供数据,  依赖注入
  provide: function() {
    return {
      articleId:this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false,
      commentList: [],
      isReplyShow: false,
      currentComment: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);
        // 数据驱动视图不是立即的
        this.article = data.data;
        setTimeout(() => {
          this.previewImage();
        }, 0);

        this.loading = false;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404;
        }
        this.$toast("getArticleById fail");
      }
      this.loading = false;
    },

    previewImage() {
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
          });
        };
      });
    },
    onPostSuccess(data) {
      this.isPostShow = false;
      this.commentList.unshift(data.new_obj);
    },

    onReplyClick(comment) {
      this.currentComment = comment;
      this.isReplyShow = true;
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
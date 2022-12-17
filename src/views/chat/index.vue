<template>
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>

    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image
            fit="cover"
            round
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          ></van-image>
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image
            fit="cover"
            round
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          ></van-image>
        </div>
      </div>
    </div>

    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么......" v-model="word">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getItem } from '@/utils/storage'

export default {
  name: 'Chat',
  data () {
    return {
      word: '',
      list: [
        { name: 'xz', msg: 'hi,你好!我是小智' },
        { name: 'me', msg: '我是编程小王子' }
      ],
      socket: null
    }
  },
  created () {
    this.socket = io('ws://toutiao.itheima.net', {
      query: {
        token: getItem('TOUTIAO_USER').token
      },
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('login success')
    })

    this.socket.on('message', (obj) => {
      this.list.push({
        name: 'xz',
        msg: obj.msg
      })
    })
    // dom更新是异步的，所以不能直接获取，获取道德是上一次的列表数据
  },
  methods: {
    sendFn () {
      if (this.word.trim().length === 0) return
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })

      this.list.push({
        msg: this.word,
        name: 'me'
      })

      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
      this.word = ''
    }
  },
  destroyed () {
    this.socket.close()
    this.socket = null
  },
  watch: {}
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    margin-top: 50px;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      /deep/.chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        /deep/&::before {
          content: "";
          width: 10px;
          height: 10px;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background-color: #e0effb;
        }
      }
    }
  }

  /deep/.van-nav-bar__content {
    background-color: #3b86e8;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-nav-bar__left {
      .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
        color: #fff;
      }
    }
  }
  /deep/ .chat-item.right {
    text-align: right;
    .chat-pao {
      margin-left: 0;
      margin-right: 15px;
      /deep/&::before {
        right: -6px;
        transform: rotate(45deg);
      }
    }
  }
  /deep/.chat-item.left {
    text-align: left;
    .chat-pao {
      margin-left: 15px;
      margin-right: 0;
      /deep/ &::before {
        left: -5px;
        transform: rotate(-135deg);
      }
    }
  }
  .reply-container {
    position: fixed;
    left: 0;
    bottom: 25px;
    height: 44px;
    width: 100%;
    background: #f5f5f5;
    z-index: 9999;
  }
}
</style>

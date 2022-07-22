<template>
  <div class="login-container">
    <!-- nav bar -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon name="cross" slot="left" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[
          {
            require: true,
            message: '请输入正确得手机号',
            pattern: /^1[3-9]\d{9}$/,
          },
        ]"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="[
          { require: true, message: '请输入验证码', pattern: /^\d{6}$/ },
        ]"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 10"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            round
            size="small"
            native-type="button"
            type="default"
            class="send-sms-btn"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI, sendSmsAPI } from "@/api/user";

export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      isCountDownShow: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user;

      // 2.表单验证 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true, // 禁用背景点击
        duration: 0, // 0 表示持续展示
      });
      // 3.提交表单请求登录
      try {
        const { data } = await loginAPI(user);
        this.$store.commit("setUser", data.data);
        this.$toast.success("登录成功！");

        // localStorage.setItem('refresh_token',data.data.refresh_token);

        // this.$router.back();
        this.$router.replace({
          path:"/layout/home"
        })
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或者是验证码错误！");
        } else {
          this.$toast.fail("登陆失败，稍后重试！");
        }
      }
      // 4.根据请求结果进行后续操作
    },
    async onSendSms() {
      // 1. 校验手机号码
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("fail", err);
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true;
      // 3. 请求发送验证码
      try {
        await sendSmsAPI(this.user.mobile);
        this.$toast("发送验证码成功！");
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast("发送验证码太频繁了。稍后再试！");
        } else {
          this.$toast("发送验证码失败！");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    background-color: #ededed;
    width: 165px;
    height: 46px;
    line-height: 46px;
    font-size: 20px;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>

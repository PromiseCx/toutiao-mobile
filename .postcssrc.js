// postCss不能修改行内样式的px，postCss基于node.js
module.exports = {
  plugins: {
    /**
     * autoperfixer 用于生成css样式规则的前缀，兼容不同版本的浏览器
     * vuecli 天生支持postcss，且默认开启了autoprefixer，所以在配置一次，会产生冲突，会报警告
     */

    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 将px转为rem
    'postcss-pxtorem': {
      // lib-fiexible 把一行分为十份，每份为1/10，
      // 所以rootValue 应该设置为设计稿宽度的十分之一，
      // 设计稿为750px，但是不能设置为75，因为vant是基于375来设计的
      // 所以必须设计为37.5，唯一的缺点就是使用设计稿的尺寸必须都得除2
      // 如果是vant得样式 就需要用 37.5 来进行换算
      //通过函数可以实现  如果是自己的样式 就可以按照 75 来进行换算
      // rootValue: 37.5,


      /**
      * rootValue 支持两种参数类型：
          数字：固定值（上面得写法）
          函数：动态计算返回
                postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
                它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
       */
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转化的css属性，
      propList: ['*'],
      // 排除该文件进行适配
      exclude:'github-markdown'
    }
  }
}
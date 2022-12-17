import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

import Vue from 'vue'

dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

// 定义一个全局可用的过滤器，仅供模板使用
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// dayjs().format('YYYY-MM-DD');

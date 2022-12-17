import request from '@/utils/request'

export const getArticleListAPI = params => request({
  url: '/v1_0/articles',
  method: 'GET',
  params
})

export const getArticleById = articleId => request({
  url: `/v1_0/articles/${articleId}`,
  method: 'get'
})

export const addCollectAPI = target => request({
  url: '/v1_0/article/collections',
  method: 'post',
  data: {
    target
  }
})

export const deleteCollectAPI = target => request({
  url: `/v1_0/article/collections/${target}`,
  method: 'delete'
})

export const addLikeAPI = target => request({
  url: '/v1_0/article/likings',
  method: 'post',
  data: {
    target
  }
})

export const deleteLikeAPI = target => request({
  url: `/v1_0/article/likings/${target}`,
  method: 'delete'
})

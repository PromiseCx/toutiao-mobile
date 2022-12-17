import request from '@/utils/request'

export const getCommentsAPI = params => request({
  url: '/v1_0/comments',
  method: 'get',
  params
})

export const addCommentLikeAPI = target => request({
  url: '/v1_0/comment/likings',
  method: 'post',
  data: {
    target
  }
})
export const deleteCommentLikeAPI = target => request({
  url: '/v1_0/comment/likings/:target',
  method: 'delete'
})

export const addCommentAPI = data => request({
  url: '/v1_0/comments',
  method: 'post',
  data
})

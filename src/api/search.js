import request from "@/utils/request";

export const getSearchSuggestionsAPI = q => request({
    url: "/v1_0/suggestion",
    method: "get",
    params:{
        q
    }
})

export const getSearchResultAPI = params =>request({
    method:"get",
    url:"/v1_0/search",
    params
})
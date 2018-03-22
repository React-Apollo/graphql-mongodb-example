'use strict'
/**
 使用Prisma服务器，从ReactScript网站抓取信息，并存放到服务器数据库
 
 **/

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
import mediumData from '../dist/mediumData'// 导入的数据
import { GraphQLClient } from 'graphql-request'
const mediumUrl = 'https://medium.com/search?q=React-native'

const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const api = ' https://us1.prisma.sh/public-shellduck-987/movie/dev'
// graphql模板
const dataArray = []
const mu = `mutation createReactScript(
    $title: String! 
    $url: String,
    $funcCat: String,
    $platformCat: String,
    $dateUpdate: String,
    $comments: String,
    $img: String,
    $excerpt: String,
    $demoUrl: String,
    $tag1: String,
    $tag2: String,
    $tag3: String

){
   createReactScript(
    data:{title:$title,
    url: $url,
    funcCat:$funcCat,
    platformCat:$platformCat,
    dateUpdate:$dateUpdate ,
    comments:$comments ,
    img:$img ,
    excerpt:$excerpt ,
    demoUrl:$demoUrl ,
    tag1:$tag1 ,
    tag2:$tag2 ,
    tag3:$tag3 
   }){
      id,
      title
   }

}`

const que = `query getReactScript($url:String!){
    page(url: $url) {
       items: query(selector:"div #content article") {
           title: text(selector:"h2 a")
           url: attr(selector:"h2 a" name:"href")
           funcCat:text(selector:".adt span a:first-child")
           platformCat:text(selector:".adt  span  a:last-child")
           dateUpdate:text(selector:".adt .date")
           comments:text(selector:".below-title-meta .link-comments")
           img: attr(selector:".wp-post-image",name:"src")
           excerpt:text(selector:".entry-summary p")
           demoUrl: attr(selector:".download-btn" name:"href")
           tag1:text(selector:".entry-meta span a:first-child")
           tag2:text(selector:".entry-meta span a:nth-child(2)")
           tag3:text(selector:".entry-meta span a:nth-child(3)")
         
         } 
    }
}`

export const start = async () => {
  try {
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    await app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    const start = Date.now()

    for (var i = 1; i <= 2; i++) {
      const sliceData = await getSingePageDataFromUrl(i)
      dataArray.push(sliceData)
           }

    const flattenData = R.flatten(dataArray)
    const res = await insertDataWaitForData(flattenData)
    console.log(res)
    const end = Date.now()
    const elpase = end - start
    console.log('操作花费时间:', elpase)
  } catch (e) {
    console.log(e)
  };
}

// 获取数据 ,现在添加token 下面的api 就该给

/** graphql-request文章中使用client的方法
 *  const client = new GraphQLClient(endpoint, { headers: {} })
    client.request(query, variables).then(data => console.log(data))
 */
const client = new GraphQLClient(api, {
  headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJtb3ZpZUBkZXYiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTE3MDIyMzczLCJleHAiOjE1MTc2MjcxNzN9.RPBK_i2BpTvOsmoQnsfF1dbfDIyMJQU4UpG4pH3LpYE'
    }
})
const handleGrqphcoolDataTemplate = R.curry((template, variables) => (
 client.request(template, variables).then(data => {
   // console.log(data.page.items);
   return data
 })
))
// 柯理化  等待抓取的数据

const graphqlRequestMethodWaitForData = handleGrqphcoolDataTemplate(mu)

const insertDataWaitForData = R.map(graphqlRequestMethodWaitForData)
// 从Medium 网站获取数据的方法是一样的的，柯理化是处理参数不同,抓取是变量是网站地址
// 抓取后的数据作为insertDataWaitForData的数据
const gDomDataTemplate = R.curry((api, template, variables) => (
    request(api, template, variables).then(data => {
      // console.log(data.page.items);
      return data
    })
   ))
const getDataReactScriptWaitForUrl = gDomDataTemplate(gDomApi, que)

const getArray = (obj) => {
  console.log(obj.page.items)
  return obj.page.items
}

const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const variablesTemp = (num) => (`{"url":"http://reactscript.com/page/${num}/"}`)

//
const Resolvevar = (variaTemp) => JSON.parse(variaTemp)  // 格式化模板
// const queryPage = (queryStr) => getDataFromReactScriptWaitForUrl(queryStr)  // 查询数据

// const getDataFromReactScript = compose(getArray, queryPage, variables, variablesTemp)

const getSingePageDataFromUrl = compose(getArray, getDataReactScriptWaitForUrl, Resolvevar, variablesTemp)

/*****************
 *  从medium抓取一下感兴趣的内容，放到app中
 * 改在getDataFromMediumWaitForUrl函数中执行插入操作
 * 流式方法不通过
 * *******************/
'use strict'
import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
import mediumData from '../dist/mediumData'// 导入的数据
// import new_hotel from '../dist/new_hotel'
// var fs = require('fs')
// var path = require('path')
const mediumUrl='https://medium.com/search?q=React-native';
const variables = {
  url: 'https://medium.com/search?q=React-native',
}
const gDomApi='http://gdom.graphene-python.org/graphql';
const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const api = 'https://api.graph.cool/simple/v1/cjcrwz0tg3jyf0153l824cpyh'
var _ = require('lodash');
// graphql模板
const mu = `mutation getMediumList(
   $title:String!,
   $subTitle:String!,
   $authorName:String!,
   $avatarImage: String!,
   $shortPassage:String!,
   $url: String!,
   $clap: String!

){
   createMedium(
   title:$title,
   subTitle:$subTitle,
   authorName:$authorName,
   avatarImage:$avatarImage,
   shortPassage:$shortPassage,
   url: $url,
   clap:$clap,
   ){
      id,
      title
   }

}`

const que =`query getMedium($url:String!){
     page(url: $url) {
         items: query(selector: "div.js-postListHandle .js-block"){
         title: text(selector: "div h3")
         subTitle: text(selector: "div h4")
         url:attr(selector:"div .postArticle-content a",name:"href")
         shortPassage: text(selector: "div p")
         avatarImage:attr(selector:".postMetaInline-avatar img"name:"src")
         authorName: text(selector: "div .postMetaInline:first-child")
         clap: text(selector: "div .js-actionMultirecommendCount  ")
         }  
     }
}`

export const start = async () => {
  try {
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    
    insertData(variables);
  } catch (e) {
    console.log(e)
  };
}

// 获取数据的方法
const handleGrqphcoolDataTemplate = R.curry((api, template, variables) => (
 request(api, template, variables).then(data => {
   console.log(data)
 })
))
// 柯理化  等待抓取的数据
const graphqlRequestMethodWaitForData = handleGrqphcoolDataTemplate(api, mu);

const insertDataWaitForData = R.map(graphqlRequestMethodWaitForData);
// 从Medium 网站获取数据的方法是一样的的，柯理化是处理参数不同,抓取是变量是网站地址
//抓取后的数据作为insertDataWaitForData的数据

const getDataFromMediumWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que);

const xHeadYLens = R.lensPath(['page', 'items']);
const getArray = R.view(xHeadYLens);
// 这是从reddit中找的异步执行的方法
const _wrapFlowAsync = (fn) => (arg) => Promise
  .try(() => arg)
  .then(fn);

const flowAsync = (...fns) => {
  const rfns = R.reverse(fns);
  const wrappedFns = rfns.map(fn => _wrapFlowAsync(fn))
  return _.flow(wrappedFns)
}
const insertData = flowAsync(insertDataWaitForData, getArray, getDataFromMediumWaitForUrl);

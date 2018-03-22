'use strict'
/************************************************
 *  从medium抓取一下感兴趣的内容，放到app中
 * 这个版本改用从meduium中找到的一个方法来实现多个异步流程的
 * compose方法。 网址是 https://medium.com/@jperasmus11/roll-your-own-async-compose-pipe-functions-658cafe4c46f
 * gist代码是 https://gist.githubusercontent.com/jperasmus/fbbcccb387896ff7db2c58797ebb76da/raw/c995e3c34bb6d5b566f3289107b267b8fa6e28d8/compose.js
 *
 * const compose = (…functions) => input => functions.reduceRight((chain, func) => chain.then(func),     Promise.resolve(input));

// Functions fn1, fn2, fn3 can be standard synchronous functions or return a Promise
compose(fn3, fn2, fn1)(input).then(result => console.log(`Do with the ${result} as you please`))
}

这个版本添加map方法，对多组关键字进行遍历和添加操作 http://reactivex.io/learnrx/ 这篇文章第一个例子引发的

可以工作，但是map还是同步的，刚开始会报错，为undefine ,但是数据是插进数据库了
下个版本彩专用rxjs来实施
observable的版本可以工作了。但是会报错， 继续排错，不知道问题出在哪里
 * *******************/

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
//import mediumData from '../dist/mediumData'// 导入的数据
// import new_hotel from '../dist/new_hotel'
// var fs = require('fs')
// var path = require('path')
const mediumUrl = 'https://medium.com/search?q=React-native-web'
const variablesArr = [{
  url: 'https://medium.com/search?q=sketch'}, {
    url: 'https://medium.com/search?q=typescript'},
{
  url: 'https://medium.com/search?q=node.js'}
]
const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const api = 'https://api.graph.cool/simple/v1/cjcrwz0tg3jyf0153l824cpyh'
var _ = require('lodash')
var flow = require('nimble')
var Promise = require('bluebird')
var Rx = require('rx')
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

const que = `query getMedium($url:String!){
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
    await app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    const start = Date.now()

    const source = Rx.Observable.from(variablesArr)

    const example = source.map(insertData)

    const subscribe = example.subscribe(val => console.log(val))

    const end = Date.now()
    const elpase = end - start
    console.log('操作花费时间:', elpase)
  } catch (e) {
    console.log(e)
  };
}

// 获取数据的方法
const handleGrqphcoolDataTemplate = R.curry((api, template, variables) => (
 request(api, template, variables).then(data => {
   // console.log(data.page.items);
   return data
 })
))
// 柯理化  等待抓取的数据
const graphqlRequestMethodWaitForData = handleGrqphcoolDataTemplate(api, mu)

const insertDataWaitForData = R.map(graphqlRequestMethodWaitForData)
// 从Medium 网站获取数据的方法是一样的的，柯理化是处理参数不同,抓取是变量是网站地址
// 抓取后的数据作为insertDataWaitForData的数据

const getDataFromMediumWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)

// const xHeadYLens = R.lensPath(['page', 'items']);
// const getArray = R.view(xHeadYLens);
// 这是从reddit中找的异步执行的方法
// Async compose

const getArray = (obj) => obj.page.items

// Functions fn1, fn2, fn3 can be standard synchronous functions or return a Promise
// compose(insertDataWaitForData, getArray, getDataFromMediumWaitForUrl)(input).then(result => console.log(`Do with the ${result} as you please`));
const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const insertData = compose(insertDataWaitForData, getArray, getDataFromMediumWaitForUrl)
// const insertData = flowAsync( getDataFromMediumWaitForUrl, getArray , insertDataWaitForData);
// const insertData= R.compose( insertDataWaitForData , getArray, getDataFromMediumWaitForUrl);

// const compose = (...functions) => input =>

//    functions.reduceRight((chain, func) =>

//       chain.then(func), Promise.resolve(input))

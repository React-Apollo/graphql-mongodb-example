'use strict'
/*****************
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
 * *******************/

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
// import mediumData from '../dist/mediumData'// 导入的数据
// import new_hotel from '../dist/new_hotel'
// var fs = require('fs')
// var path = require('path')
const ReactScriptUrl = 'http://reactscript.com/page/2/'
const dataArray=[];
const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const variables = {
    url: 'http://reactscript.com/page/2'
  }
const api = 'https://api.graph.cool/simple/v1/cjcwa8kae0o120100qdemvp9y'

// graphql模板
const mu = `mutation  creactReactScript(
    $title: String!
    $url: String!
    $funcCat: String
    $platformCat: String
    $dateUpdate: String
    $comments: String
    $img: String!
    $excerpt: String
    $demoUrl: String
    $tag1: String
    $tag2: String
    $tag3: String

){
    createReactScript(
    title: $title
    url: $url
    funcCat: $funcCat
    platformCat: $platformCat
    dateUpdate: $dataUpdate
    comments: $comments
    img: $img
    excerpt: $excerpt
    demoUrl: $demoUrl
    tag1: $tag1
    tag2: $tag2
    tag3: $tag3
    )
   ){
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
    const begin = Date.now()
    // for (var i =1; i <=2; i++) {
    //     const singlePageData = await getDataFromReactScript(i)
    //     dataArray.push(singlePageData)
    //   }
    //const url=variablesTemp(1) 
    //   const flattenData = await R.flatten(dataArray);
    //   console.log(flattenData);
    //   const log=(data)=>console.log(data)
      //const insertData = compose(R.map(insertDataWaitForData));
      //await  insertData(flattenData);
     const  va={title: "Custom React Native Media Controls3",
      url: "http://reactscript.com/custom-react-native-media-controls/",
      funcCat: "Audio & Video",
      platformCat: "React Native",
      dateUpdate: "January 20, 2018",
      comments: "0 Comment",
      img: "https://i2.wp.com/reactscript.com/wp-content/uploads/2018/01/Custom-React-Native-Media-Controls.png?resize=200%2C140",
      excerpt: "A sweet UI component to manipulate your media such as videos.",
      demoUrl: "http://reactscript.com/custom-react-native-media-controls/",
      tag1: "",
      tag2: "",
      tag3: ""};

      await graphqlRequestMethodWaitForData(va)
      //await   insertData(variables);
    const end = Date.now()
    const elpase = end - begin
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

const getDataFromReactScriptWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)

const getArray = (obj) =>{
console.log(obj)
return obj.page.items

}

const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

//const insertData = compose(insertDataWaitForData, getArray, getDataFromReactScriptWaitForUrl)

//const variablesTemp = (num) => (`{"url":"http://reactscript.com/page/${num}/"}`)

//
//const variables = (variaTemp) => JSON.parse(variaTemp)  // 格式化模板
//const queryPage = (queryStr) => getDataFromReactScriptWaitForUrl(queryStr)  // 查询数据

//const getDataFromReactScript = compose(getArray, queryPage, variables, variablesTemp)

//const insertData=compose(insertDataWaitForData, getArray, getDataFromReactScriptWaitForUrl)
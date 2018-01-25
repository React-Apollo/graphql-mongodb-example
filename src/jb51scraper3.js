'use strict'

/**
 * Filename: /Users/apple/Public/Git_Bank/graphql-mongodb-example/src/jb51scraper1.js
 * Path: /Users/apple/Public/Git_Bank/graphql-mongodb-example
 * Created Date: Wednesday, January 24th 2018, 6:32:08 pm
 * Author: apple
 * item 1：抓取jb51的页面数据
 * item 2：函数式重构获取方法
 * Copyright (c) 2018 Your Company
 */
import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = 'mongodb://php-smarter:phpsmarter@ds239097.mlab.com:39097/recompose'
const dataArray = []
// graphql模板
const qu2 = `query getLastPage($url:String!){
    page(url: $url) {
        query(selector:".dxypage  a:last-child") {
            herf:attr(name:"href")
        }
    }  
}`
const qu3 = `query getPage($url:String!){
    page(url:$url) {
      items: query(selector:"div.artlist dt ") { 
         title:text(selector:"a")
          url: attr(selector:"a", name:"href")
          time: text(selector:"span")
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

    // const res = await getJb51Page(variables)
    // const getStr=str=> str.page.query[0];
    // const ls=await getStr(res)
    // const  lss=str=>str.herf
    // const  lsss=await lss(ls)

    for (var i = 1; i <= 3; i++) {
      const singlePageData = await getDataFromJB51(i)  
      dataArray.push(singlePageData)
    }
    const flattenData = R.flatten(dataArray)
    console.log(flattenData)

    const end = Date.now()
    const elpase = end - start
    console.log('操作花费时间:', elpase)
    console.log(flattenData.length)
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
// const graphqlRequestMethodWaitForData = handleGrqphcoolDataTemplate(api, mu)

// handle str to get the last page number
const s1 = str => R.split('_', str)
const s2 = arr => R.split('.', arr)
const s3 = arr => arr[0]
const getLastPage = R.compose(s3, s2, s1)
// getLastpage

//const getJb51Page = handleGrqphcoolDataTemplate(gDomApi, qu2)
// #############################################################################
const pageFactory = handleGrqphcoolDataTemplate(gDomApi, qu3)

// #############################################################################

// const queryPageWaitForData = R.map(pageFactory)

// const getDataFromMediumWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)
const getArray = (obj) => obj.page.items
const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const queryData = compose(getArray, pageFactory)

// #############################################################################

// #############################################################################

const variablesTemp = (num) => (`{"url":"http://www.jb51.net/list/list_243_${num}.htm"}`)

// const varia = (num)=> variablesTemp(num)  //获取模板
const variables = (variaTemp) => JSON.parse(variaTemp)  // 格式化模板
const queryPage = (queryStr) => queryData(queryStr)  // 查询数据

const getDataFromJB51 = compose(queryPage, variables , variablesTemp) // 异步的compose函数

'use strict'
/*****************
 *  科学美国人Mind文章的抓取
 * *******************/

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
const SAMindUrl = 'https://www.scientificamerican.com/cognition/?page=1'
const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const api = 'https://api.graph.cool/simple/v1/cjdcrl3sl351201460qwi1f1w'
// graphql模板
const dataArray = []
const mu = `mutation getSAMindList(
    $title: String! 
    $cat: String,
    $url: String,
    $img: String,
    $brief: String,
    $meta: String
){
   createMind(
    title:$title,
    cat:$cat,
    url: $url,
    img:$img,
    brief:$brief,
    meta:$meta
){
      
      title
   }

}`

const que = `query getMindList($url:String!){
    page(url: $url) {
        items: query(selector:".section-latest article") {
            title: text(selector:".listing-wide__inner h2 a")
            cat:text(selector:".listing-wide__thumb__category")
            img: attr(selector:".listing-wide__thumb img",name:"src")
            url: attr(selector:".listing-wide__thumb a",name:"href")
            brief:text(selector:".listing-wide__inner p")
            meta:text(selector:".listing-wide__inner .t_meta")
        
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
     // await compose(insertDataWaitForData, getArray, getDataFromMediumWaitForUrl)(variables).then(result => console.log(`Do with the ${result} as you please`));

    const Data = await getSingePageDataFromUrl(10, "cognition")

    const res = await insertDataWaitForData(Data)
    console.log(res)
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

const getDataReactMindListWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)
// 去毛处理
const getArray = (obj) => {
  console.log(obj.page.items)
  return obj.page.items
}

const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const variablesTemp = (page = 1, category = 'cognition') => (`{"url":"https://www.scientificamerican.com/${category}/?page=${page}"}`)

//
const Resolvevar = (variaTemp) => JSON.parse(variaTemp)  // 格式化模板
// const queryPage = (queryStr) => getDataFromReactScriptWaitForUrl(queryStr)  // 查询数据

// const getDataFromReactScript = compose(getArray, queryPage, variables, variablesTemp)

const getSingePageDataFromUrl = compose(getArray, getDataReactMindListWaitForUrl, Resolvevar, variablesTemp)

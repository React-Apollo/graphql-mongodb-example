'use strict'

/**
 * Filename: /Users/apple/Public/Git_Bank/graphql-mongodb-example/src/jb51scraper1.js
 * Path: /Users/apple/Public/Git_Bank/graphql-mongodb-example
 * Created Date: Wednesday, January 24th 2018, 6:32:08 pm
 * Author: apple
 * item：抓取jb51的页面数据
 * Copyright (c) 2018 Your Company
 */

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
import mediumData from '../dist/mediumData'// 导入的数据
// import new_hotel from '../dist/new_hotel'
// var fs = require('fs')
// var path = require('path')
const mediumUrl = 'https://medium.com/search?q=React-native'

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

const variablesTemp =(num)=>(`{"url":"http://www.jb51.net/list/list_243_${num}.htm"}`)


export const start = async () => {
  try {
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    await app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    const start = Date.now()
    const varia= await variablesTemp(2);
    const variables = await JSON.parse(varia);
    console.log(variables)
    const res = await getJb51Page(variables)
    const getStr=str=> str.page.query[0];
    const ls=await getStr(res)
    const  lss=str=>str.herf
    const  lsss=await lss(ls)
    const  queryPage=await queryData(variables);
    console.log(queryPage);
    

    //const ls=str.href
    //console.log(ls);
    //const lastPage=await getLastPage(str)
    //const  page = await getLastPage(res.page.query[0]);
    //console.log(lastPage);  
   
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

// handle str to get the last page number
const s1 = str => R.split('_',str);
const s2 = arr => R.split('.',arr);
const s3 = arr => arr[0];
const getLastPage = R.compose(s3,s2,s1);
//getLastpage

const getJb51Page= handleGrqphcoolDataTemplate(gDomApi , qu2)
// #############################################################################
const pageFactory= handleGrqphcoolDataTemplate(gDomApi , qu3)

// #############################################################################

//const queryPageWaitForData = R.map(pageFactory)

const getDataFromMediumWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)
const getArray = (obj) => obj.page.items
const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const queryData = compose(getArray, pageFactory)

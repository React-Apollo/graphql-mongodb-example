
'use strict'
// 从hotel 文件获取json数据然后写入到graphcool数据库
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
var fs = require('fs')
var path = require('path')
require('es6-promise').polyfill()
require('isomorphic-fetch')
import fetch from 'node-fetch'
import { request } from 'graphql-request'
import cnodeData from '../cnodeData'// 导入的数据

const URL = 'http://localhost'
const PORT = 3001
const api = 'https://api.graph.cool/simple/v1/cjearwrd40zes01671xikrsnh' // graphcool API
// graphql模板
const mu = `mutation createTopics(
  $authorid:String!,
  $content:String!,
  $createAt: String!,
  $lastReplyAt:String!,
  $replyCount:String,
  $tab: String!,
  $title: String!,
  $top:Boolean!,
  $visitCount:Int!,
  $authorName:String!
  $avatarUrl: String!
){
 createTopics(
    authorid:$authorid,
    content: $content,
    createAt: $createAt,
    lastReplyAt: $lastReplyAt,
    replyCount: $replyCount,
    tab:$tab,
    title:$title,
    top:$top,
    visitCount:$visitCount.
    author:{authorName:$authorName, 
            avatarUrl: $avatarUrl}){
            id
            author {
            authorName
            avatarUrl
            }
}
}`
var t = require('transducers-js')// 导入transducers-js执行tranducer操作
export const start = async () => {
  try {
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    const startTime = Date.now()
    const data = await InsertData(cnodeData)
    const endTime = Date.now()
    const spend = endTime - startTime
    console.log('spending time:', spend)
  } catch (e) {
    console.log(e)
  };
}

var InsertData = (data) => {
  //console.log(data)
  // 请求方法的柯理化，首先传入api和template，等待变量

  const func = R.curry((api, template, variables) => (
        request(api, template, variables).then(data => {
          console.log(data)
        })
    ))

  var flattenData = function (n) {
      return {
          authorid: n.author_id,
          content: n.content,
          createAt: n.create_at,
          lastReplyAt: n.last_reply_at,
          replyCount: n.reply_count,
          tab: n.tab,
          title: n.title,
          top: n.top,
          visitCount: n.visit_count,
          authorName: n.author.loginname,
          avatarUrl: n.author.avatar_url

        }
    }

  const waitForData = func(api, mu)
  var xf = t.comp(R.map(flattenData), R.map(waitForData))

  const mediateFunc = R.curry((xf, data) => (t.into([], xf, data)))
  const getFinalRes = mediateFunc(xf)
  getFinalRes(data)
}

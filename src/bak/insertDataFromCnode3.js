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
import cnodeData from '../cnodeData4' // 导入的数据
const dataArray = []
const URL = 'http://localhost'
const PORT = 3001
const api = 'https://api.graph.cool/simple/v1/cjearwrd40zes01671xikrsnh' // graphcool API
// graphql模板
const mu = `mutation createList(
  $tab: String!,
  $content:String!,
  $title: String!
){
 createList(
    content: $content,
    tab:$tab,
    title:$title,
   ){
        id
    }

}`
var t = require('transducers-js') // 导入transducers-js执行tranducer操作
export const start = async () => {
  try {
  const app = express()

		app.use(cors())
		app.use(express.static(__dirname))
		app.listen(PORT, () => {
  console.log(`Visit ${URL}:${PORT}`)
		})
		const startTime = Date.now()
		// const data = await InsertData(cnodeData)

		//  await fetch("https://cnodejs.org/api/v1/topics?page=4").then(res=>res.json()).then(data=> console.log(data));
		// console.log(data);

		for (var i =1; i <=2; i++) {
  const pageData = await singlePageData(i)
			dataArray.push(pageData)
		}

  const flattenData = R.flatten(dataArray.reverse())
  console.log(flattenData);
		const getData = compose(R.map(insertData), flattenData)
		await getData(dataArray);
		const endTime = Date.now()
		const spend = endTime - startTime
		console.log('spending time:', spend)
	} catch (e) {
  console.log(e)
	}
}

const insertData = data => {
  var flattenData = function (n) {
  return {
  content: n.content,
  tab: n.tab,
  title: n.title
}
	};

  const func = R.curry((api, template, variables) =>
		request(api, template, variables).then(data => {
  console.log('data:', data)
		})
	)

	const waitForData = func(api, mu)
	var xf = t.comp(R.map(flattenData), R.map(waitForData))

	const mediateFunc = R.curry((xf, data) => t.into([], xf, data))
	const getFinalRes = mediateFunc(xf)
	getFinalRes(data)
};

const compose = (...functions) => input =>
	functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const variablesTemp = num => `https://cnodejs.org/api/v1/topics?page=${num}`

const Resolvevar = variaTemp => JSON.parse(variaTemp)

const fetchData = url => fetch(url).then(res => res.json()).then(data => data.data)
const singlePageData = compose(fetchData, variablesTemp)




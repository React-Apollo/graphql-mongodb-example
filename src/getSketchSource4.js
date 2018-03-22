'use strict'
/*****************
 *  getSketchSource
 * *******************/

import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import {request as superRequest} from 'graphql-request'
const SAMindUrl = 'https://www.scientificamerican.com/cognition/?page=1'
const gDomApi = 'http://gdom.graphene-python.org/graphql'
const URL = 'http://localhost'
const PORT = 3001
const request = require('superagent')
const fs = require('fs-extra')
const path = require('path')
// graphcool endpoin
const api = 'https://api.graph.cool/simple/v1/cjdcrl3sl351201460qwi1f1w'
// graphql模板
const dataArray = []

const dir = 'mobile'
const que = `query getSketchList($url:String!){
    
        page(url:$url) {
          items: query(selector:" article ol li ") {
            title: text(selector:"a span")
            img: attr(selector:"a img", name:"src")
            url:attr(selector:"a ",name:"href")
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

    for (var i = 1; i <= 2; i++) {
      const sliceData = await getSingePageDataFromUrl(i)
      dataArray.push(sliceData)
    }
    console.log(`创建${dir}文件夹`)
    await fs.mkdir(path.join(__dirname, '/sketchSource/'))
    const flattenData = R.flatten(dataArray)
    await getPic(flattenData)
    // const res = await insertDataWaitForData(Data)
    // console.log(flattenData.length);
    const end = Date.now()
    const elpase = end - start
    console.log('操作花费时间:', elpase)
  } catch (e) {
    console.log(e)
  };
}

// 获取数据的方法
const handleGrqphcoolDataTemplate = R.curry((api, template, variables) => (
  superRequest(api, template, variables).then(data => {
   // console.log(data.page.items);
    return data
  })
))
const getDataSketchListWaitForUrl = handleGrqphcoolDataTemplate(gDomApi, que)
// 去毛处理
const getArray = (obj) => {
  // console.log(obj.page.items)
  return obj.page.items
}

const compose = (...functions) => input => functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(input))

const variablesTemp = (page = 1, category = 'mobile') => (`{"url":"https://www.sketchappsources.com/category/${category}.html?${page}"}`)

//
const Resolvevar = (variaTemp) => JSON.parse(variaTemp)  // 格式化模板
// const queryPage = (queryStr) => getDataFromReactScriptWaitForUrl(queryStr)  // 查询数据

// const getDataFromReactScript = compose(getArray, queryPage, variables, variablesTemp)

const getSingePageDataFromUrl = compose(getArray, getDataSketchListWaitForUrl, Resolvevar, variablesTemp)

function random (min, max) {
  let range = max - min
  let rand = Math.random()
  let num = min + Math.round(rand * range)
  return num
}


function sleep (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
};

const getImageUrl = (item) => (
   item.img
)

async function init (urls) {
  await fs.mkdir(path.join(__dirname, '/mm'))
  for (let url of urls) {
      await getPic(url)
    }
}

async function getPic (url) {
      // 获取图片的真实地址
    download(url)
    await sleep(random(1000, 5000))

  }

  function download( imgUrl) {
    console.log(`正在下载${imgUrl}`)
    const filename = imgUrl.split('/').pop()  
    const req = request.get(imgUrl)
      .set({ 'Referer': 'http://www.mmjpg.com' })
    req.pipe(fs.createWriteStream(path.join(__dirname, 'mm', dir, filename)))
  }
    

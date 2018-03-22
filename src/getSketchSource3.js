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
  
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    await app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
    const start = Date.now()
     // await compose(insertDataWaitForData, getArray, getDataFromMediumWaitForUrl)(variables).then(result => console.log(`Do with the ${result} as you please`));

     const Url='/resources/source-image/carbon-design-kit-8.0.0.jpg'
     async function download (dir, imgUrl) {
      console.log(`正在下载${imgUrl}${dir}`)
      const filename = imgUrl.split('/').pop()
      const  req =request.get(imgUrl)
        .set({ 'Referer': 'https://www.sketchappsources.com' })
      console.log(req);
      req.pipe(fs.createWriteStream(path.join(__dirname, 'sketchSource',filename)))
     await  sleep(1000);
      
    };

    const res=await download('image',Url)
    
}


function sleep(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, time)
    })
  };
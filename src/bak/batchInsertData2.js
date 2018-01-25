
'use strict'
// 从hotel 文件获取json数据然后写入到graphcool数据库
// 解决执行时间打印问题
import express from 'express'
// import bodyParser from 'body-parser'
import cors from 'cors'
import * as R from 'ramda'
import { request } from 'graphql-request'
import hotelData from '../dist/hotelData'// 导入的数据
// import new_hotel from '../dist/new_hotel'
// var fs = require('fs')
// var path = require('path')

const URL = 'http://localhost'
const PORT = 3001
// graphcool endpoint
const api = 'https://api.graph.cool/simple/v1/rest-endpoint'
// graphql模板
const mu = `mutation createOneHotel(
 $name:String!,
 $ratingStars:Int!,
 $streetAddress:String!,
 $postalCode: String!,
 $cityLocalized:String!,
 $longitude: Float!,
 $latitude: Float!

){
createHotel(
name:$name,
ratingStars:$ratingStars,
streetAddress:$streetAddress,
postalCode:$postalCode,
cityLocalized:$cityLocalized,
geolocation:{latitude:$latitude, 
longitude: $longitude}){
id
geolocation{
 longitude
 latitude
}
}
}`;

var t = require('transducers-js')// 导入transducers-js执行tranducer操作
export const start = async () => {
  try {
    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })

    insertDataWaitForData(hotelData);
  } catch (e) {
    console.log(e)
  };
}

const flattenData = function (n) {
  return {
    name: n.name,
    ratingStars: n.ratingStars,
    streetAddress: n.streetAddress,
    postalCode: n.postalCode,
    cityLocalized: n.cityLocalized,
    latitude: n.geolocation.latitude,
    longitude: n.geolocation.longitude

  }
}
 // 获取数据的方法
const handleGrqphcoolDataTemplate = R.curry((api, template, variables) => (
 request(api, template, variables).then(data => {
   console.log(data)
 })
))
// 柯理化
const graphqlRequestMethodWaitForData = handleGrqphcoolDataTemplate(api, mu)
const combineTowMethodToHanleObject = t.comp(R.map(flattenData), R.map(graphqlRequestMethodWaitForData))

const mediateFunc = R.curry((xf, arrayNeedforHandle) => (t.into([], xf, arrayNeedforHandle)))
const getFinalResOfMethod = mediateFunc(combineTowMethodToHanleObject)

const insertDataNeedMethodAndData = R.curry((method, data) => {
  method(data)
})
const insertDataWaitForData = insertDataNeedMethodAndData(getFinalResOfMethod)

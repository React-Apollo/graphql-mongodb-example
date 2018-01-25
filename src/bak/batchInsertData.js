
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
import hotelData from '../dist/hotelData'//导入的数据
import new_hotel from '../dist/new_hotel'

const URL = 'http://localhost'
const PORT = 3001
const api = 'https://api.graph.cool/simple/v1/rest-endpoint'; //graphcool API
//graphql模板
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
}`
var t = require('transducers-js');//导入transducers-js执行tranducer操作
export const start = async () => {
   try{
     const app = express()

    app.use(cors())
    app.use(express.static(__dirname))
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    });
    //直接从文件读取，不成功，但是导入是可以的,说明数据的操作是没有问题的，继续再试s
   // fs.readFile(path.resolve(__dirname,'hotel.json'), function(err,data){
   //   if(err) throw err;
   //      //console.log(data.toString());
   //      const hotelData=data.toString();
   //     //console.log(typeof(data);
   //      //const Data=data.toString();
   //      //InsertData(Data);
   //      console.log(typeof(hotelData));
   //  });
   const startTime=Date.now();   
   //const  data =await InsertData(new_hotel);
   const endTime=Date.now();
   const spend=endTime-startTime;
   console.log("spending time:",spend);
  } catch (e) {
    console.log(e)
  };
};


var InsertData =(data) => {
  // console.log(data);
  //请求方法的柯理化，首先传入api和template，等待变量
  
  const func = R.curry((api, template, variables) => (
    request(api, template, variables).then(data => {
      console.log(data)
    })
  ))
  
  var flattenData = function (n) {
  return {
    name: n.name,
    ratingStars: n.ratingStars,
    streetAddress: n.streetAddress,
    postalCode: n.postalCode,
    cityLocalized: n.cityLocalized,
    latitude:  n.geolocation.latitude,
    longitude: n.geolocation.longitude,

  }
};

const waitForData = func(api, mu);
var xf = t.comp(R.map(flattenData), R.map(waitForData));

 const mediateFunc=R.curry((xf,data)=>(t.into([], xf, data)));
const  getFinalRes=mediateFunc(xf);
getFinalRes(data);
};

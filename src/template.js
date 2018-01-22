
'use strict'
// 从hotel 文件获取json数据然后写入到graphcool数据库

import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import * as R from 'ramda'
var fs = require('fs')
var path = require('path')
require('es6-promise').polyfill()
require('isomorphic-fetch')
import fetch from 'node-fetch'
import { request } from 'graphql-request'
import hotelData from '../dist/hotelData'
const URL = 'http://localhost'
const PORT = 3001
const api = 'https://api.graph.cool/simple/v1/cjaxudkum2ugf0127kok921bc'
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
var t = require('transducers-js')
export const start = async () => {
  try {
    const typeDefs = [`
    type  geoData{
       longitude: Float!,
       latitude: Float!,
    }
    type Hotel{
      id: ID!  
      ratingStars: Int!
      name: String!
      streetAddress: String!
      postalCode: String!,
      cityLocalized: String!,
      geolocation:[geoData!]!
    }
    
    type Mutation {
      insertData(
       name: String
      ): Hotel
    }

    type Query{
       getHotels: [Hotel]
       geoDatas: geoData
       
    }
  `]

    const resolvers = {
      Mutation: {
       insertData: async (parent, args, context) => {
         const query = `{
          allHotels(name:$name,
          streetAddress: $streetAddress,
          postalCode: $postalCode,
          cityLocalized: $cityLocalized,
          geolocation:{$longitude:longitude,$latitude:latitude}){
           name,
           geolocation{
             longitude,
             latitude
           }
         }
       }`
         const variables = {
           ratingStars: 8,
           name: 'vvafo',
           streetAddress: 'Hruggerstrasse 56',
           postalCode: '8400',
           cityLocalized: 'Paden',
           geolocation: {latitude: 47.343960, longitude: 7.304224}
         }
         request('https://api.graph.cool/simple/v1/cjaxudkum2ugf0127kok921bc', query, variables).then(data => {
           console.log(data)
           return data
         })
       }

     },

      Query: {
       getHotels: async (parent, args, context) => {
         const query = `{
           allHotels{
            id,
            name,
            geolocation{
              longitude,
              latitude
            }
          }
        }`

         request('https://api.graph.cool/simple/v1/cjaxudkum2ugf0127kok921bc', query).then(data => {
          console.log(data)
          return data
        })
       }

     }

    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    app.use(cors())
    app.use(express.static(__dirname))

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema: schema}))

    const homePath = '/graphiql'

    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })
     //console.log(hotelData)
     InsertData(hotelData)
  } catch (e) {
    console.log(e)
  }
}

var InsertData =(data) => {
  // console.log(hotelData);

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
    latitude: n.geolocation.latitude,
    longitude: n.geolocation.longitude

  }  };
const waitForData = func(api, mu)
var xf = t.comp(R.map(flattenData), R.map(waitForData));

 const mediateFunc=R.curry((xf,data)=>(t.into([], xf, data)));
const  getFinalRes=mediateFunc(xf);
getFinalRes(data);
};

//使用graphql-request方法插入数据

import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import * as R from 'ramda'
var fs= require('fs');
var path=require('path')
require('es6-promise').polyfill();
require('isomorphic-fetch');
import fetch from 'node-fetch';
import { request } from 'graphql-request'
const URL = 'http://localhost'
const PORT = 3001
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
       name: String!
      ): Hotel
    }

    type Query{
       getHotels: [Hotel]
       geoDatas: geoData
       
    }
    
    `];

   const resolvers ={
     Mutation: {
       insertData:async (parent,args,context)=>{
         fs.readFile(path.resolve(__dirname,'hotel.json'), function(err,data){
          if (err) throw err;
          
          console.log(data);
          
         
        });

     }

     },
     Query:{
      getHotels:async (parent,args,context)=>{
          
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
          
        request('https://api.graph.cool/simple/v1/cjaxudkum2ugf0127kok921bc', query).then(data =>
        {
          //console.log(data);
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

  } catch (e) {
    console.log(e)
  }

}

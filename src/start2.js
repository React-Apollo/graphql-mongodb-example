import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
require('es6-promise').polyfill();
require('isomorphic-fetch');
const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = 'mongodb://php-smarter:phpsmarter@ds239097.mlab.com:39097/recompose'
const api = 'https://cnodejs.org/api/v1/topic_collect/collect'
const request = require('superagent');
import fetch from 'node-fetch';
export const start = async () => {
  try {
    
     
    //const context=await db.collection('books')
    //console.log(context);

    const typeDefs = [`
    type collectTopic {
      topic_id: String
      accesstoken: String
      success: Boolean
      
    }
    
    type Query {
      
      getCollectionTopic(topic_id: String!, accesstoken: String!): collectTopic,
      createCollectionTopic(topic_id: String!, accesstoken: String!): collectTopic
    },
    schema {
      query: Query
      
    }
      
    `];

  //   const resolvers = {
  //     Query: {
  //       createCollectionTopic: async (parent, args, context) => {
          
  //          fetch(api, {
  //           method: 'post',
  //           headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({'topic_id': args.topic_id, 'accesstoken': args.accesstoken}),
  //         }).then(res=>res.json()).then(
              
  //           (json )=> {
              
              
  //            json
  //           }
  //         )
 
          
  //       }
     
  //   }
  // }
   const resolvers ={
     Query :{

    createCollectionTopic : async (parent, args, context) => {
      const {accesstoken, topic_id}= args
      const body={accesstoken: accesstoken, topic_id: topic_id}
      const ress=await fetch(api, { 
        method: 'POST',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.json())
      .then(json =>json);
       console.log(ress);
       const success={"success":ress.success}
       return success;  
      }
     }

   }
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    app.use(cors())

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

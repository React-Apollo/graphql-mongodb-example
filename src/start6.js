import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
var fs = require('fs');
var path=require('path')
require('es6-promise').polyfill();
require('isomorphic-fetch');
import fetch from 'node-fetch';


const URL = 'http://localhost'
const PORT = 3001
export const start = async () => {
  try {

    const typeDefs = [`
    type AuthenticateUserPayload {
      id: ID!
      token: String!
    }
    
    type Query {
      getGithubUser(githubCode: String!): AuthenticateUserPayload
    }
    schema {
      query: Query
    }
    `];


   const resolvers ={
     Query :{
      getGithubUser:async (parent,args,context)=>{
        fs.readFile(path.resolve(__dirname,'book.json'), function(err,data){
          if(err) throw err;

         
         console.log(data.toString());
        });
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

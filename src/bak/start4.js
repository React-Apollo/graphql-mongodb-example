import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
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
      getGithubToken(githubCode: String!): AuthenticateUserPayload
    }
    schema {
      query: Query
    }
    `];

  
   const resolvers ={
     Query :{
    /*test start area*/  
     getGithubToken:async (parent,args,context)=>{
      console.log(args);
      const endpoint = 'https://github.com/login/oauth/access_token'
      const {githubCode} =args;
      const client_id= '842e83a0329b156b0a5b'
      const client_secret = '0a25a9f3c5cb3d47eece0b54e58163a188834bf9'
      const data = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          code: githubCode,
        })
      })
        .then(response => response.json())
    
      if (data.error) {
        throw new Error(JSON.stringify(data.error))
      }
      console.log("data,",data);
      const  res=await getGithubUser(data.access_token)
      console.log(res);
      return {token:data.access_token,id:res.id};
    }
    /*test end area*/   
     }

   }

   const getGithubUser=async (githubToken)=>{
    const endpoint = `https://api.github.com/user?access_token=${githubToken}` 
    const data = await fetch(endpoint).then(response => response.json())
    if (data.error) {
      throw new Error(JSON.stringify(data.error))
    }
  
    return data
  }
   
   const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    //app.use(cors())

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

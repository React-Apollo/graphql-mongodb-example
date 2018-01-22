import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'

const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = 'mongodb://php-smarter:phpsmarter@ds239097.mlab.com:39097/recompose'

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

function fromMongo(item) {
  item.id=(item._id).toString();
  return  item
  
}

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    //const context=await db.collection('books')
    //console.log(context);

    const typeDefs = [`
    type Book {
      id: ID!
      isbn: String!
      title: String!
      author: Author!
    }
    type Author {
      id: ID!
      name: String!
    }
    type Query {
      books(keyword:String): [Book]
      book(id: ID!): Book
    }

      schema {
        query: Query
        
      }
    `];

    const resolvers = {
      Query: {
        books: async (root,args, context) => {
          let findParams = {};
          
          console.log(args);
          if (args.keyword) {
            findParams.title = new RegExp(args.keyword, 'i')
            
          }
          //console.log('2:',db);
          const res=await context.db.collection('books').find(findParams).map(fromMongo).toArray();
          //console.log(context);
          return res;

       },
        book: async (root,{id, title}, context) => {
          //console.log(id);
          const result = await context.db.collection('books')
          .findOne({_id: new ObjectId(id) })
          return fromMongo(result)
        }
      }
     
    }


    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    app.use(cors())

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema: schema, context: {
      db: db
    }}))

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

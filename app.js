const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema}= require('graphql');

const app = express();

app.use(bodyParser.json());

// for testing express only - delete later
// app.get('/', (req,res, next)=>{
//     res.send('Hello World');
// })

app.use(
    "/graphql",
    graphqlHttp({
      schema: buildSchema(`
      type RootQuery {
            items:[String!]!
      }
  
      type RootMutation {
            createItem(name:String): String
      }
  
      schema{
          query: RootQuery
          mutation: RootMutation
      }
      `),
      rootValue: {
          items: ()=>{
              return ['black jeans','white t-shirt', 'blue t-shirt'];
          },
          createItem: (args)=>{
              const itemName = args.name;
              return itemName;
          }
      },
      graphiql:true 
    })
  );
  

app.listen(3001);
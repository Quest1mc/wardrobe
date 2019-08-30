const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Item = require('./models/item');

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
      type Item{
        _id:ID!
        title:String!
        description:String!
        photo: String!
        price:Float
        date:String!
    }
    input ItemInput{
        title:String!
        description:String!
        photo: String!
        price:Float
        date:String!
    }
      type RootQuery {
            items:[Item!]!
      }
  
      type RootMutation {
            createItem(itemInput:ItemInput): Item
      }
  
      schema{
          query: RootQuery
          mutation: RootMutation
      }
      `),
    rootValue: {
      items: () => {
        return Item.find().then(items=>{
          return items.map(item=>{
            return {...item._doc}
          })
        }).catch(err=>{
          throw err;
        })
      },
      createItem: args => {
        // prototype of object creation delete before shipping
        // const item = {
        //   _id: Math.random().toString(),
        //   title: args.itemInput.title,
        //   description: args.itemInput.description,
        //   photo: args.itemInput.photo,
        //   price: +args.itemInput.price,
        //   date: args.itemInput.date
        // };

        const item = new Item({
          title: args.itemInput.title,
          description: args.itemInput.description,
          photo: args.itemInput.photo,
          price: +args.itemInput.price,
          date:new Date(args.itemInput.date)
        });
        return item
        .save().then(result =>{
          console.log(result);
          return {...result._doc};
        }).catch(err =>{
          console.log(err);
          throw err;
        }); 
        
       
      }
    },
    graphiql: true
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-oyzl5.mongodb.net/${process.env.MONGO_PASSWORD}?retryWrites=true&w=majority`
).then(()=>{
    app.listen(3001);
})
.catch(err => {
  console.log(err);
});

// app.listen(3001);

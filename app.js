const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const { schema } = require('./schema/schema');

require('dotenv').config();

const app = express();

// Allow cross-origin requests
app.use(cors());

const db = require('./config/db').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connection Successful'))
    .catch(err => console.log(err));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('http://localhost:4000');
});

const graphql = require('graphql');

const Product = require('../models/product');
const Category = require('../models/category');

const { buildSchema } = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    brandName: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLFloat },
    category: {
      type: CategoryType,
      resolve (parent, args) {
        return Category.findById(parent.categoryId);
      }
    }
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
      _id: { type: GraphQLString },
      name: { type: GraphQLString },
      })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: {
        _id: { type: GraphQLString },
      },
      resolve (parent, args) {
        return Product.findById(args._id);
      }
    },
    category: {
      type: CategoryType,
      args: {
        _id: { type: GraphQLString },
      },
      resolve (parent, args) {
        return Category.findById(args._id)
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve (parent, args) {
        return Product.find({});
      }
    },
    category: {
      type: new GraphQLList(CategoryType),
      resolve (parent, args) {
        return Category.find({});
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        brandName: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        category: { type: new GraphQLList(GraphQLString) },
      },
      resolve (parent, args) {
        const { name, brandName, description, image, price } = args;
        const product = new Product({ name, brandName, description, image, price, categoryId });
        return product.save();
      }
    },
    updateProduct: {
      type: ProductType,
      args: {
          _id: {type: new GraphQLNonNull(GraphQLString)},
          name: {type: new GraphQLNonNull(GraphQLString)},
          brandName: { type: new GraphQLNonNull(GraphQLString) },
          description: { type: new GraphQLNonNull(GraphQLString) },
          image: { type: new GraphQLNonNull(GraphQLString) },
          price: { type: new GraphQLNonNull(GraphQLFloat) },
          category: { type: new GraphQLList(GraphQLString)},
      },
      resolve(parent, args){
          return new Promise((resolve, reject) => {
              const date = Date().toString()
              Product.findOneAndUpdate(
                  {"_id": args._id},
                  { "name":{name: args.name, dateUpdated: date}},
                  { "brand":{brandName: args.brandName, dateUpdated: date}},
                  { "description":{description: args.description, dateUpdated: date}},
                  { "image":{image: args.image, dateUpdated: date}},
                  { "price":{price: args.price, dateUpdated: date}},
                  { "price":{price: args.price, dateUpdated: date}},
                  { "category":{category: args.categoryId, dateUpdated: date}},
                  {"new": true}
              ).exec((err, res) => {
                  console.log('test', res)
                  if(err) reject(err)
                  else resolve(res)
              })
          })
      }
    },
    deleteProduct: {
      type: ProductType,
      args: {
          _id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parent, args) {
          return Product.findByIdAndDelete(args._id)
      }
    },
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve (parent, args) {
        const { name } = args;
        const category = new Category({ name });
        return category.save();
      }
    },
    updateCategory: {
      type: CategoryType,
      args: {
          _id: {type: new GraphQLNonNull(GraphQLString)},
          name: {type: new GraphQLNonNull(GraphQLString)},
          
      },
      resolve(parent, args){
          return new Promise((resolve, reject) => {
              const date = Date().toString()
              Category.findOneAndUpdate(
                  {"_id": args._id},
                  { "name":{name: args.name, dateUpdated: date}},
                  {"new": true} //returns new document
              ).exec((err, res) => {
                  console.log('test', res)
                  if(err) reject(err)
                  else resolve(res)
              })
          })
      }
    },
    deleteCategory: {
      type: CategoryType,
      args: {
          _id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parent, args) {
          return Category.findByIdAndDelete(args._id)
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

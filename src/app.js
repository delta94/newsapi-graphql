const {
  ApolloServer
} = require('apollo-server');
const NewsAPI = require('./NewsAPI');
const IFramelyAPI = require('./IFramelyAPI');
const {typeDefinitions: typeDefs} = require('./typeDefinitions');

const resolvers = {
  Query: {
    async getHeadlinesByCountryAndCategory(source, {country, category}, {dataSources}) {
      return dataSources.newsAPI.getHeadlinesByCountryAndCategory(country, category)
    },
    async getHeadlinesByCountry(source, {country}, {dataSources}) {
      return dataSources.newsAPI.getHeadlinesByCountry(country)
    },
    async getHeadlinesByCategory(source, {category}, {dataSources}) {
      return dataSources.newsAPI.getHeadlinesByCategory(category)
    },
    async getSources(source, args, {dataSources}) {
      return dataSources.newsAPI.getSources().sources;
    },
    async getSourcesByCountry(source, {country}, {dataSources}) {
      return dataSources.newsAPI.getSourcesByCountry(country);
    },
    async getSourcesByCategory(source, {category}, {dataSources}) {
      return dataSources.newsAPI.getSourcesByCategory(category);
    },
    async getIFramelyData(source, {url}, {dataSources}) {
      return dataSources.IFramelyAPI.getData(url)
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      newsAPI: new NewsAPI(),
      IFramelyAPI: new IFramelyAPI()
    }
  },
  context: () => {
    return {
      token: 'prabhu',
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
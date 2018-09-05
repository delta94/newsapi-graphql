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
    async getSourcesByLanguage(source, {lang}, {dataSources}) {
      return dataSources.newsAPI.getSourcesByLanguage(lang);
    },
    async getSourcesByCountry(source, {country}, {dataSources}) {
      return dataSources.newsAPI.getSourcesByCountry(country);
    },
    async getSourcesByCategory(source, {category}, {dataSources}) {
      return dataSources.newsAPI.getSourcesByCategory(category);
    },
    async getIFramelyData(source, {url}, {dataSources}) {
      return dataSources.IFramelyAPI.getData(url)
    },
    async search(source, {query, from, to, page, pageSize}, {dataSources}) {
      return dataSources.newsAPI.search(query, from, to, page, pageSize)
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
  },
  engine: {
    apiKey: "service:prabhuignoto-3209:TfmrgQuQjH_5YoE_W1SK6w"
  },
  formatError: error => {
    console.log(error);
    return {
      message: error.message,
    }
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
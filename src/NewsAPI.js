const {RESTDataSource} = require('apollo-datasource-rest');
const config = require('config');
const {ApolloError} = require('apollo-server')

class NewsAPI extends RESTDataSource {

  constructor() {
    try {
      super();
      this.baseURL = config.get('newsapi.url');
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getHeadlinesByCountryAndCategory(country, category) {
    try {
      const response = await this.get('top-headlines', {
        apiKey: config.get('newsapi.apiKey'),
        country,
        category
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getHeadlinesByCategory(category) {
    try {
      const response = await this.get('top-headlines', {
        apiKey: config.get('newsapi.apiKey'),
        category
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getHeadlinesByCountry(country) {
    try {
      const response = await this.get('top-headlines', {
        apiKey: config.get('newsapi.apiKey'),
        country
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getSources() {
    try {
      const response = await this.get('sources', {
        apiKey: config.get('newsapi.apiKey')
      });
      return response.sources;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getSourcesByCountry(country) {
    try {
      const response = await this.get('sources', {
        apiKey: config.get('newsapi.apiKey'),
        country,
      });
      return response;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async getSourcesByCategory(category) {
    try {
      const response = await this.get('sources', {
        apiKey: config.get('newsapi.apiKey'),
        category,
      })
      return response;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }
  
  async getSourcesByLanguage(lang) {
    try {
      const response = await this.get('sources', {
        apiKey: config.get('newsapi.apiKey'),
        lang
      })
      return response.sources;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }

  async search(query, from, to, page, pageSize) {
    try {
      const response = await this.get('everything', {
        q: query,
        from,
        to,
        page,
        pageSize,
        apiKey: config.get('newsapi.apiKey'),
        language: 'en'
      })
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, 404)
    }
  }
  
}

module.exports = NewsAPI;
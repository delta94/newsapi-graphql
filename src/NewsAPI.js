const {RESTDataSource} = require('apollo-datasource-rest');
const config = require('config');

class NewsAPI extends RESTDataSource {

  constructor() {
    try {
      super();
      this.baseURL = config.get('newsapi.url');
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    }
  }

  async getSources() {
    try {
      const response = await this.get('sources', {
        apiKey: config.get('newsapi.apiKey')
      });
      return response.sources;
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      console.error(error);
    }
  }
  
}

module.exports = NewsAPI;
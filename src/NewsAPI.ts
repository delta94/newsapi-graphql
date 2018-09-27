import {RESTDataSource} from "apollo-datasource-rest";
import {ApolloError} from "apollo-server";
import * as Config from "config";

export default class NewsAPI extends RESTDataSource {
  public baseURL: string = Config.get("newsapi.url");

  public async getHeadlinesByCountryAndCategory(country: string, category: string) {
    try {
      const response = await this.get("top-headlines", {
        apiKey: Config.get("newsapi.apiKey"),
        category,
        country,
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getHeadlinesByCategory(category: string) {
    try {
      const response = await this.get("top-headlines", {
        apiKey: Config.get("newsapi.apiKey"),
        category,
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getHeadlinesByCountry(country: string) {
    try {
      const response = await this.get("top-headlines", {
        apiKey: Config.get("newsapi.apiKey"),
        country,
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getSources() {
    try {
      const response = await this.get("sources", {
        apiKey: Config.get("newsapi.apiKey"),
      });
      return response.sources;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getSourcesByCountry(country: string) {
    try {
      const response = await this.get("sources", {
        apiKey: Config.get("newsapi.apiKey"),
        country,
      });
      return response;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getSourcesByCategory(category: string) {
    try {
      const response = await this.get("sources", {
        apiKey: Config.get("newsapi.apiKey"),
        category,
      });
      return response;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async getSourcesByLanguage(lang: string) {
    try {
      const response = await this.get("sources", {
        apiKey: Config.get("newsapi.apiKey"),
        lang,
      });
      return response.sources;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

  public async search(query: string, from: string, to: string, page: number, pageSize: number) {
    try {
      const response = await this.get("everything", {
        apiKey: Config.get("newsapi.apiKey"),
        from,
        language: "en",
        page,
        pageSize,
        q: query,
        to,
      });
      return response.articles;
    } catch (error) {
      throw new ApolloError(error.message, "404");
    }
  }

}

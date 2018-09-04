const {RESTDataSource} = require('apollo-datasource-rest');
const config = require('config');


class IFramelyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = config.get('iframely.url');
  }

  async getData(url) {
    try {
      const response = await this.get('api/iframely', {
        url,
        'api_key': config.get('iframely.apiKey')
      });
      const {meta: {date, description, site, title}, links:{logo, thumbnail}} = response;
      const sanitize = (val) => val ? val: '';

      return {
        date: sanitize(date),
        description,
        logoUrl: logo && logo.length > 0 ? logo[0].href: '',
        site,
        thumbnailUrl: thumbnail && thumbnail.length > 0 ? thumbnail[0].href : '',
        title,
        url: response.url,
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = IFramelyAPI;
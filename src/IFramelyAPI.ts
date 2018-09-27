import { RESTDataSource } from "apollo-datasource-rest";
import * as Config from "config";
import * as Winston from "winston";

export default class IFramelyAPI extends RESTDataSource {
  public baseURL: string = Config.get("iframely.url");
  private infoLogger: Winston.Logger;
  private errorLogger: Winston.Logger;

  constructor() {
    super();
    this.infoLogger = Winston.createLogger({
      level: "info",
      transports: [
        new Winston.transports.Console({
          level: "info",
        }),
      ],
    });
    this.errorLogger = Winston.createLogger({
      level: "error",
      transports: [
        new Winston.transports.Console({
          level: "error",
        }),
      ],
    });
  }

  public async getData(url: string) {
    try {
      this.infoLogger.log({
        level: "info",
        message: "Fetching iFramely data",
      });
      const response = await this.get("api/iframely", {
        api_key: Config.get("iframely.apiKey"),
        url,
      });
      this.infoLogger.log({
        level: "info",
        message: "Recvd iFramely data",
      });

      const {
        meta: { date, description, site, title },
        links: { logo, thumbnail },
      } = response;
      const sanitize = (val: string) => (val ? val : "");

      return {
        date: sanitize(date),
        description,
        logoUrl: logo && logo.length > 0 ? logo[0].href : "",
        site,
        thumbnailUrl:
          thumbnail && thumbnail.length > 0 ? thumbnail[0].href : "",
        title,
        url: response.url,
      };
    } catch (error) {
      this.errorLogger.log({
        level: "error",
        message: error.toString(),
      });
      return {
        error: "Failed to retrieve data",
      };
    }
  }
}

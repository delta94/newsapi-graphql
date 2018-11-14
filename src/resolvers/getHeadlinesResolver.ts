// resolver for headlines
// this resolver handles the caching mechanism as well as
// retrieving fresh headline once the data is too old

import { first, pick, size } from "lodash";
import { DateTime, Interval } from "luxon";
import { MongoClient } from "mongodb";

interface IArticle {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

interface ICacheResponse {
  timeStamp: string;
  id: string;
}

interface IResponse {
  articles: IArticle[];
}

// checks if the cache data has gone stale
const dataIsStale = (timeStamp: string) => {
  const cacheTimestamp = DateTime.fromISO(timeStamp);
  const currentTimestamp = DateTime.local();
  const cacheInterval = Interval.fromDateTimes(
    cacheTimestamp,
    currentTimestamp,
  );
  return cacheInterval.length("hours") > 1;
};

export default {
  getHeadlines: async (
    source: any,
    { country, category }: { country: string; category: string },
    { dataSources, prisma }: { dataSources: any; prisma: any },
  ) => {
    try {
      const name = `${country}_${category}`;

      // connect to mongodb
      const mongo = await MongoClient.connect(
        process.env.MONGO_DB as string,
        {
          useNewUrlParser: true,
        },
      );

      // check if the collection is already present.
      const mainCollection = await mongo
        .db("newsquirrel")
        .collection(`${country}`)
        .find({})
        .toArray();

      // create the collection if its not already present.
      if (mainCollection.length < 1) {
        await mongo.db("newsquirrel").createCollection(`${country}`);
      }

      // get the cache document
      const cacheDocumentResult = await mongo
        .db("newsquirrel")
        .collection(`${country}`)
        .findOne({
          name: `${country}_${category}`,
        });

      // check if the cache for the country with that category already exists
      if (!cacheDocumentResult) {
        // get the data from API
        const newsAPIResponse = await dataSources.newsAPI.getHeadlinesByCountryAndCategory(
          country,
          category,
        );
        await mongo
          .db("newsquirrel")
          .collection(`${country}`)
          .insertOne({
            articles: newsAPIResponse,
            name: `${country}_${category}`,
            timeStamp: new Date().toISOString(),
          });
        return newsAPIResponse;
      } else {
        // we are here if the cache is present
        // check if the cache is still not stale
        if (dataIsStale(cacheDocumentResult.timeStamp)) {
          const newsAPIResponse = await dataSources.newsAPI.getHeadlinesByCountryAndCategory(
            country,
            category,
          );
          await mongo
            .db("newsquirrel")
            .collection(`${country}`)
            .insertOne({
              articles: newsAPIResponse,
              name: `${country}_${category}`,
              timeStamp: new Date().toISOString(),
            });
          mongo.close();
          return newsAPIResponse;
        } else {
          mongo.close();
          return cacheDocumentResult.articles;
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};

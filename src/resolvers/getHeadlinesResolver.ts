// resolver for headlines
// this resolver handles the caching mechanism as well as
// retrieving fresh headline once the data is too old

import { first, pick, size } from "lodash";
import { DateTime, Interval } from "luxon";

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
      // check if the data is already present in cache and validate if its not stale
      const cacheResponse: ICacheResponse[] = await prisma.query.headlinesCaches(
        {
          where: {
            name,
          },
        },
        "{timeStamp, id}",
      );
      let apiResponse = [];

      if (
        size(cacheResponse) > 0 &&
        !dataIsStale(first(cacheResponse)!.timeStamp)
      ) {
        const response: IResponse[] = await prisma.query.headlinesCaches(
          {
            where: {
              name,
            },
          },
          `{
              id,
              articles {
                title,
                url,
                description,
                urlToImage,
                publishedAt,
                author
              }
					  }`,
        );
        return first(response)!.articles;
      } else if (
        size(cacheResponse) > 0 &&
        dataIsStale(first(cacheResponse)!.timeStamp)
      ) {
        apiResponse = await dataSources.newsAPI.getHeadlinesByCountryAndCategory(
          country,
          category,
        );
        await prisma.mutation.deleteManyArticles({
          where: {
            headlinesID: `${country}_${category}`,
          },
        });
        await prisma.mutation.deleteHeadlinesCache({
          where: {
            id: first(cacheResponse)!.id,
          },
        });
        await prisma.mutation.createHeadlinesCache({
          data: {
            articles: {
              create: apiResponse.map(
                ({
                  author,
                  title,
                  description,
                  url,
                  urlToImage,
                  publishedAt,
                }: IArticle) => ({
                  author,
                  description,
                  headlinesID: `${country}_${category}`,
                  publishedAt,
                  title,
                  url,
                  urlToImage,
                }),
              ),
            },
            name: `${country}_${category}`,
            timeStamp: new Date().toISOString(),
          },
        });
      } else {
        apiResponse = await dataSources.newsAPI.getHeadlinesByCountryAndCategory(
          country,
          category,
        );
        await prisma.mutation.createHeadlinesCache({
          data: {
            articles: {
              create: apiResponse.map(
                ({
                  author,
                  title,
                  description,
                  url,
                  urlToImage,
                  publishedAt,
                }: IArticle) => ({
                  author,
                  description,
                  headlinesID: `${country}_${category}`,
                  publishedAt,
                  title,
                  url,
                  urlToImage,
                }),
              ),
            },
            name: `${country}_${category}`,
            timeStamp: new Date().toISOString(),
          },
        });
      }
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  },
};

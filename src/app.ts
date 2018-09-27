import { ApolloServer } from "apollo-server";
import { merge } from "lodash";
import { Prisma } from "prisma-binding";
import IFramelyAPI from "./IFramelyAPI";
import NewsAPI from "./NewsAPI";
import { default as typeDefs } from "./typeDefinitions";

import { config } from "dotenv";
import HeadlinesResolver from "./resolvers/getHeadlinesResolver";
import ImageResizeResolver from "./resolvers/imageResizeResolver";

try {
  if (process.env.NODE_ENV !== "production") {
    config();
  }
  const resolvers = merge({
    Query: Object.assign(
      {},
      {
        async getIFramelyData(source: any, { url }: any, { dataSources }: any) {
          return dataSources.IFramelyAPI.getData(url);
        },
        async search(
          source: any,
          { query, from, to, page, pageSize }: any,
          { dataSources }: any,
        ) {
          return dataSources.newsAPI.search(query, from, to, page, pageSize);
        },
      },
      HeadlinesResolver,
      ImageResizeResolver,
    ),
  });

  const server = new ApolloServer({
    context: (req: {}) => ({
      ...req,
      prisma: new Prisma({
        endpoint: process.env.PRISMA_ENDPOINT,
        typeDefs: "./cache-db-schema/cache-db.graphql",
      }),
    }),
    dataSources: () => {
      return {
        IFramelyAPI: new IFramelyAPI(),
        newsAPI: new NewsAPI(),
      };
    },
    resolvers,
    tracing: true,
    typeDefs,
  });

  server.listen({
      port: process.env.PORT || 4000,
    }, () => console.log(`Server ready at ${process.env.PORT || 4000}`),
  );
} catch (error) {
  console.error(error);
}

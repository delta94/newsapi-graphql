import { gql } from "apollo-server";

const typeDefinitions = gql`
  type ArticleSource {
    id: String
    name: String
  }

  type Article {
    author: String
    title: String
    description: String
    url: String
    urlToImage: String
    publishedAt: String
    source: ArticleSource
  }

  type Headlines {
    status: String
    totalResults: Int
    articles: [Article]!
  }

  type Source {
    id: String
    name: String
    description: String
    url: String
    category: String
    language: String
    country: String
  }

  type SourceResult {
    status: String
    sources: [Source]!
  }

  type IFramely {
    date: String
    description: String
    logoUrl: String
    site: String
    thumbnailUrl: String
    url: String
    title: String
  }

  type ImageBase64 {
    data: String
  }

  type Query {
    getHeadlines(country: String!, category: String!): [Article]!
    getIFramelyData(url: String!): IFramely
    search(
      query: String!
      from: String!
      to: String!
      page: Int!
      pageSize: Int!
    ): [Article]!
    getBase64Img(url: String!): ImageBase64!
  }
`;

export default typeDefinitions;

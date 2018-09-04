const {
  gql
} = require('apollo-server');

const typeDefinitions = gql `

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
    site: String,
    thumbnailUrl: String,
    url: String,
    title: String
  }

  type Query {
    getHeadlinesByCountry(country: String!): [Article]!
    getHeadlinesByCategory(category: String!): [Article]!
    getHeadlinesByCountryAndCategory(country: String!, category: String!): [Article]!
    getSources: [Source]
    getSourcesByCountry(country: String!): SourceResult
    getSourcesByCategory(category: String!): SourceResult
    getIFramelyData(url: String!): IFramely
  }
  
`;

module.exports.typeDefinitions = typeDefinitions;
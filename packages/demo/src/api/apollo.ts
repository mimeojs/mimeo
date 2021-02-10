import { ApolloClient, ApolloError, InMemoryCache } from '@apollo/client/core';
import { Build } from '@stencil/core';
import { RestLink } from 'apollo-link-rest';
import { ArticleDocument } from './graphql';

const link = new RestLink({
  endpoints: {
    articles: {
      uri: '/assets/articles',
      responseTransformer: async (response: Response) => {
        if (response === null) {
          throw new ApolloError({
            errorMessage: 'not found',
          });
        }
        if (!response?.ok) {
          throw new ApolloError({ errorMessage: 'unknown' });
        }
        const url = new URL(response.url);
        const json = await response.json();
        return { ...json, url };
      },
    },
  },
  uri: '/assets',
});

export const cache = new InMemoryCache({});
export const client = new ApolloClient({
  ssrMode: Build.isServer,
  typeDefs: [ArticleDocument],
  cache,
  link,
});

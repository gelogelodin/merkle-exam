'use client';

import IndexPage from '../components/index/index';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.react-finland.fi/graphql',
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
      <ApolloProvider client={client}>
        <IndexPage />
      </ApolloProvider>
  );
}

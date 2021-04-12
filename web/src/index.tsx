import { createUploadLink } from "apollo-upload-client";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'handsontable/dist/handsontable.full.css';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/client';

const httpLink = createUploadLink({uri: `http://localhost:8080/graphql`});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink])
});

ReactDOM.render(
  <ApolloProvider client={ client }>
    <ApolloHooksProvider client={ client }>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

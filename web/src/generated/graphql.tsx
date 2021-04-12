import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Built-in java.math.BigDecimal */
  BigDecimal: any;
  Date: any;
  Upload: any;
};



export type Mutation = {
  __typename?: 'Mutation';
  uploadStatement?: Maybe<Scalars['String']>;
  updateTransaction?: Maybe<Transaction>;
  updateTransactions?: Maybe<Array<Maybe<Transaction>>>;
};


export type MutationUploadStatementArgs = {
  file: Scalars['Upload'];
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['ID'];
  date: Scalars['Date'];
};


export type MutationUpdateTransactionsArgs = {
  objects: Array<TransactionEditInput>;
};

export type PortfolioSummary = {
  __typename?: 'PortfolioSummary';
  totalRON?: Maybe<Scalars['BigDecimal']>;
};

export type Query = {
  __typename?: 'Query';
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  portfolioSummary?: Maybe<PortfolioSummary>;
};

export type Transaction = {
  __typename?: 'Transaction';
  id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['Date']>;
  reference?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
};

export type TransactionEditInput = {
  id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['Date']>;
  reference?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
};


export type TransactionListQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionListQuery = (
  { __typename?: 'Query' }
  & { transactions?: Maybe<Array<Maybe<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'date' | 'reference' | 'category' | 'amount' | 'currency' | 'account' | 'comment'>
  )>>> }
);

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['ID'];
  date: Scalars['Date'];
}>;


export type UpdateTransactionMutation = (
  { __typename?: 'Mutation' }
  & { updateTransaction?: Maybe<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'date' | 'reference' | 'category' | 'amount' | 'currency' | 'account' | 'comment'>
  )> }
);

export type UpdateTransactionsMutationVariables = Exact<{
  objects: Array<TransactionEditInput>;
}>;


export type UpdateTransactionsMutation = (
  { __typename?: 'Mutation' }
  & { updateTransactions?: Maybe<Array<Maybe<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'date' | 'reference' | 'category' | 'amount' | 'currency' | 'account' | 'comment'>
  )>>> }
);


export const TransactionListDocument = gql`
    query TransactionList {
  transactions {
    id
    date
    reference
    category
    amount
    currency
    account
    comment
  }
}
    `;

/**
 * __useTransactionListQuery__
 *
 * To run a query within a React component, call `useTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionListQuery({
 *   variables: {
 *   },
 * });
 */
export function useTransactionListQuery(baseOptions?: Apollo.QueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
        return Apollo.useQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, baseOptions);
      }
export function useTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
          return Apollo.useLazyQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, baseOptions);
        }
export type TransactionListQueryHookResult = ReturnType<typeof useTransactionListQuery>;
export type TransactionListLazyQueryHookResult = ReturnType<typeof useTransactionListLazyQuery>;
export type TransactionListQueryResult = Apollo.QueryResult<TransactionListQuery, TransactionListQueryVariables>;
export const UpdateTransactionDocument = gql`
    mutation updateTransaction($id: ID!, $date: Date!) {
  updateTransaction(id: $id, date: $date) {
    id
    date
    reference
    category
    amount
    currency
    account
    comment
  }
}
    `;
export type UpdateTransactionMutationFn = Apollo.MutationFunction<UpdateTransactionMutation, UpdateTransactionMutationVariables>;

/**
 * __useUpdateTransactionMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionMutation, { data, loading, error }] = useUpdateTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useUpdateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>) {
        return Apollo.useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(UpdateTransactionDocument, baseOptions);
      }
export type UpdateTransactionMutationHookResult = ReturnType<typeof useUpdateTransactionMutation>;
export type UpdateTransactionMutationResult = Apollo.MutationResult<UpdateTransactionMutation>;
export type UpdateTransactionMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const UpdateTransactionsDocument = gql`
    mutation updateTransactions($objects: [TransactionEditInput!]!) {
  updateTransactions(objects: $objects) {
    id
    date
    reference
    category
    amount
    currency
    account
    comment
  }
}
    `;
export type UpdateTransactionsMutationFn = Apollo.MutationFunction<UpdateTransactionsMutation, UpdateTransactionsMutationVariables>;

/**
 * __useUpdateTransactionsMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionsMutation, { data, loading, error }] = useUpdateTransactionsMutation({
 *   variables: {
 *      objects: // value for 'objects'
 *   },
 * });
 */
export function useUpdateTransactionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionsMutation, UpdateTransactionsMutationVariables>) {
        return Apollo.useMutation<UpdateTransactionsMutation, UpdateTransactionsMutationVariables>(UpdateTransactionsDocument, baseOptions);
      }
export type UpdateTransactionsMutationHookResult = ReturnType<typeof useUpdateTransactionsMutation>;
export type UpdateTransactionsMutationResult = Apollo.MutationResult<UpdateTransactionsMutation>;
export type UpdateTransactionsMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionsMutation, UpdateTransactionsMutationVariables>;
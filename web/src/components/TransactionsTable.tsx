import { gql, useMutation } from "@apollo/client";
import HotTable from "@handsontable/react";
import Handsontable from "handsontable";
import * as React from 'react';
import {
  useTransactionListQuery, useUpdateTransactionMutation
} from "../generated/graphql";

type CellChange = Handsontable.CellChange;
type ChangeSource = Handsontable.ChangeSource;

const QUERY_TRANSACTION_List = gql`
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

const MUTATION_TRANSACTION_UPDATE = gql`
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

const hotSettings = {
  columns: [
    { data: 'date', type: 'date', width: 150, dateFormat: 'YYYY-MM-DD' },
    { data: 'reference', width: 150, type: 'text' },
    { data: 'category', width: 150, type: 'text' },
    { data: 'amount', width: 150, type: 'numeric', numericFormat: { pattern: '0.00' } },
    { data: 'currency', width: 150, type: 'text' },
    { data: 'account', width: 150, type: 'text' },
    { data: 'comment', width: 150, type: 'text' },
  ],
  colHeaders: ['Date', 'Reference', 'Category', 'Amount', 'Currency', 'Account', 'Comment'],
}

const onValueChanged = (changes: CellChange[] | null, source: ChangeSource, mutation: Function, transactions: any) => {
  changes?.forEach(change => {
    const [rowIndex, columnKey, oldValue, newValue] = change;
    if (oldValue !== newValue) {
      const transaction = transactions[rowIndex];
      switch (columnKey) {
        case "date":
          console.log(source);
          mutation({ variables: { id: transaction.id, date: newValue } });
          break;
      }
    }
  });
}

const TransactionTable: React.FC = () => {
  const { data, error, loading } = useTransactionListQuery();
  const [updateTransaction] = useUpdateTransactionMutation();

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>ERROR loading from API. Is the server started?</div>;
  if (!data.transactions) return <div>No transactions.</div>

  const tableData = [
    ...data.transactions?.map(transaction => { return { ...transaction }} )
  ];

  return (
    <div>
      <div id="hot-app">
        <HotTable
          data={ tableData }
          afterChange={ (cellChanges, source) => onValueChanged(cellChanges, source, updateTransaction, data.transactions) }
          licenseKey="non-commercial-and-evaluation"
          settings={ hotSettings } />
      </div>
    </div>
  );
}

export default TransactionTable;
import { gql, useMutation } from "@apollo/client";
import HotTable from "@handsontable/react";
import Handsontable from "handsontable";
import * as React from 'react';
import {
  useTransactionListQuery, useUpdateTransactionsMutation
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

const MUTATION_TRANSACTIONS_UPDATE = gql`
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
  minSpareRows: 1
}

const onValueChanged = (changes: CellChange[] | null, source: ChangeSource, mutation: Function, transactions: any) => {
  if (source === 'loadData') return

  let editedRows: any[] = [];

  changes?.forEach(change => {
    const [rowIndex, columnKey, oldValue, newValue] = change;
    if (oldValue !== newValue) {
      const transaction = transactions[rowIndex];
      let editedRow: any = {};
      // If there is a transaction associated with this row (i.e. is not new)...
      if (transaction) {
        // ... check if a row was already edited (i.e. another column)
        editedRow = editedRows.find(o => o.id === transaction.id);
        if (!editedRow) {
          // If this is the first time we're touching this row, push it and associated transaction ID.
          editedRow = {id: transaction.id};
          editedRows.push(editedRow);
        }
      } else {
        // This is called for brand new transactions with no ID
        editedRows.push(editedRow);
      }
      editedRow[columnKey] = newValue;
    }
  });

  if (editedRows)
    mutation({ variables: { objects: editedRows }});
}

const TransactionTable: React.FC = () => {
  const { data, error, loading } = useTransactionListQuery();
  const [updateTransaction] = useUpdateTransactionsMutation();
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
          settings={ hotSettings }
          stretchH="all" />
      </div>
    </div>
  );
}

export default TransactionTable;
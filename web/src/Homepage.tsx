import { gql, useMutation, useQuery } from "@apollo/client";
import { AppBar, Box, Container, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from "react";
import TransactionTable from "./components/TransactionsTable";
import { useTransactionListQuery } from "./generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const UPLOAD_STATEMENT_MUTATION = gql`
    mutation ($file: Upload!) {
        uploadStatement(file: $file)
    }
`;

const QUERY_PORTFOLIO_SUMMARY = gql`  
    query PortfolioSummary {
        portfolioSummary {
            totalRON
        }
    }
`;

const onFileUpload = (files: FileList | null, uploadStatementMutation: any) => {
  console.log(files);
  !!files && uploadStatementMutation({variables: {file: files[0]}});
};

const Homepage = () => {
  const classes = useStyles();
  const [uploadStatement] = useMutation(UPLOAD_STATEMENT_MUTATION);
  const { data, loading, error } = useQuery(QUERY_PORTFOLIO_SUMMARY);
  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>ERROR loading from API. Is the server started?</div>;

  const totalRON = data.portfolioSummary.totalRON;

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            VISTER
          </Typography>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Box my={4}>
          {totalRON}

          <TransactionTable />

          <input
            type="file"
            placeholder="Choose a file"
            // onChange={({target: {files}}) => !!files && uploadStatement({variables: {file: files[0]}})}/>
            onChange={(event) => onFileUpload(event.target.files, uploadStatement)} />

        </Box>
      </Container>
    </div>
  );
}

export default Homepage;

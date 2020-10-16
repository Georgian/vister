import React from "react";
import TransactionTable from "./components/TransactionsTable";
import { AppBar, Container, Box, Typography, Button, Toolbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { gql, useMutation, useQuery } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

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

const Homepage = () => {
  const classes = useStyles();
  const [uploadStatement] = useMutation(UPLOAD_STATEMENT_MUTATION);

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
          <TransactionTable />

          <input
            type="file"
            placeholder="Choose a file"
            onChange={({target: {files}}) => !!files && uploadStatement({variables: {file: files[0]}})}/>

        </Box>
      </Container>
    </div>
  );
}

export default Homepage;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

export enum ColumnType {
  CARD_COLUMNS,
  SUMMARY_COLUMNS,
  DECK_COLUMNS,
  SESSION_COLUMNS,
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 520,
  },
});

const cardColumns = [
  { id: "indexString", label: "", minWidth: 20, align: "center" },
  { id: "front", label: "Front", minWidth: 80, align: "center" },
  { id: "back", label: "Back", minWidth: 80, align: "center" },
  { id: "score", label: "Score", minWidth: 80, align: "center" },
  { id: "deck", label: "Deck", minWidth: 80, align: "center" },
  { id: "tagsString", label: "Tag", minWidth: 80, align: "center" },
];

const summaryColumns = [
  { id: "indexString", label: "", minWidth: 20, align: "center" },
  { id: "front", label: "Front", minWidth: 80, align: "center" },
  { id: "back", label: "Back", minWidth: 80, align: "center" },
  { id: "results", label: "Results", minWidth: 80, align: "center" },
];

const deckColumns = [
  { id: "indexString", label: "", minWidth: 20, align: "center" },
  { id: "cardCount", label: "Card Count", minWidth: 80, align: "center" },
  { id: "score", label: "Score", minWidth: 80, align: "center" },
  { id: "duration", label: "Time Spent", minWidth: 80, align: "center" },
  { id: "tagsString", label: "Tag", minWidth: 80, align: "center" },
];

const sessionColumns = [
  { id: "indexString", label: "", minWidth: 20, align: "center" },
  { id: "score", label: "Score", minWidth: 80, align: "center" },
  { id: "cardCount", label: "Card Count", minWidth: 80, align: "center" },
  { id: "duration", label: "Time Spent", minWidth: 80, align: "center" },
  { id: "decks", label: "Decks", minWidth: 80, align: "center" },
  { id: "tagsString", label: "Tags", minWidth: 80, align: "center" },
];
type Props = { rows: any[]; columnType: ColumnType };

export default function StatisticsTable(props: Props) {
  const { rows, columnType } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let columns = null;
  switch (columnType) {
    case ColumnType.CARD_COLUMNS: {
      columns = cardColumns;
      break;
    }
    case ColumnType.SUMMARY_COLUMNS: {
      columns = summaryColumns;
      break;
    }
    case ColumnType.DECK_COLUMNS: {
      columns = deckColumns;
      break;
    }
    case ColumnType.SESSION_COLUMNS: {
      columns = sessionColumns;
      break;
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`${row.indexString}_${row.front}`}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align="center">
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

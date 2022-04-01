import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center"
  },
  border: {
    borderBottom: "2px solid lightgray",
    width: "100%"
  },
  content: {
    paddingTop: theme.spacing(-0.5),
    paddingBottom: theme.spacing(-0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: 14,
    color: "lightgray"
  }
}));

interface IDividerWithText {
  children: React.ReactNode,
}

const DividerWithText = ({ children }: IDividerWithText) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.border} />
      <span className={classes.content}>{children}</span>
      <div className={classes.border} />
    </div>
  );
};

export default DividerWithText;
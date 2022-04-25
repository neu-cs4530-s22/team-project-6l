import { makeStyles } from '@material-ui/core';
import React from 'react';

/**
 * The style of the DividerWithText component
 */
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderBottom: '2px solid lightgray',
    width: '100%',
  },
  content: {
    paddingTop: theme.spacing(-0.5),
    paddingBottom: theme.spacing(-0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: 14,
    color: 'lightgray',
  },
}));

/**
 * The interface of the DividerWithText component which takes one prop
 * children is the prop which is ReactNode
 */
interface IDividerWithTextProps {
  children: React.ReactNode;
}

const DividerWithText = ({ children }: IDividerWithTextProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.border} />
      <span data-testid='children' className={classes.content}>
        {children}
      </span>
      <div className={classes.border} />
    </div>
  );
};

export default DividerWithText;

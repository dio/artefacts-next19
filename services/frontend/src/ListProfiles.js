import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Profile from './Profile';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2
  }
});

function ListProfiles({ classes, members }) {
  return (
    <Grid container className={classes.root} justify="center" spacing={16}>
      {members.map((member, index) => (
        <Grid key={index} item>
          <Profile className={classes.paper} member={member} index={index} />
        </Grid>
      ))}
    </Grid>
  );
}

ListProfiles.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListProfiles);

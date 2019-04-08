import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import Profile from './Profile';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

function Detail({ classes, members, match }) {
  const memberId = match.params.id;
  console.log('xd');
  return (
    <div className={classes.root} spacing={16}>
      <Profile className={classes.paper} member={members[memberId]} />
    </div>
  );
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles),
  withRouter
)(Detail);

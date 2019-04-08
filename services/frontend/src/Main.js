import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from './ListProfiles';
import Detail from './Detail';
import { MembersContext } from './contexts/MembersProvider';
import { withStyles } from '@material-ui/core/styles';

let interval;

const styles = {
  errorText: {
    color: 'red',
    paddingLeft: 24
  }
};

function Main({ classes }) {
  const { members, setMembers } = useContext(MembersContext);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (interval === undefined) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/v1/users');

          setMembers(await response.json());
          setError(undefined);
        } catch (err) {
          setError(err.message);
        }
        // This is for mock during development.
        // const changed = Math.floor(Math.random() * 5);
        // const newV = { ...members[changed] };
        // newV.version = 'v2';
        // members[changed] = newV;
        // const newMembers = [...members];

        // setMembers(newMembers);
      }, 5 * 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {error && <h5 className={classes.errorText}>{error}</h5>}
      <Switch>
        <Route
          path="/"
          exact
          render={props => <Container {...props} members={members} />}
        />
        <Route
          path="/:id"
          render={props => <Detail {...props} members={members} />}
        />
      </Switch>
    </div>
  );
}

export default withStyles(styles)(Main);

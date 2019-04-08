import React, { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from './ListProfiles';
import Detail from './Detail';
import { MembersContext } from './contexts/MembersProvider';

let interval;

function Main() {
  const { members, setMembers } = useContext(MembersContext);

  useEffect(() => {
    if (interval === undefined) {
      interval = setInterval(async () => {
        const response = await fetch('/v1/users');
        setMembers(await response.json());
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
  );
}

export default Main;

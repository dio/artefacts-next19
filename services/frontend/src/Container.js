import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Profile from './Profile';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

const members = [
  {
    name: 'Ignasi Barrera',
    initial: 'I',
    title: 'Engineer',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Ignasi_Barrera2.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Zack Butcher',
    initial: 'Z',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/02/Zack_Butcher.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Hongtao Gao',
    initial: 'H',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Hongtao-1-e1551500623352.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Devarajan Ramaswamy',
    initial: 'D',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/Screenshot-2019-03-02-at-06.51.56-e1551538502713.png',
    quote: "I really want a boat, that's my reason to join Tetrate."
  },
  {
    name: 'Lizan Zhou',
    initial: 'L',
    picture:
      'https://www.tetrate.io/wp-content/uploads/2019/03/lizan-e1551501164830.jpg',
    quote: "I really want a boat, that's my reason to join Tetrate."
  }
];

class GuttersGrid extends React.Component {
  state = {
    spacing: '16',
    members
  };

  componentDidMount() {
    setInterval(async () => {
      const response = await fetch('/v1/users');
      this.setState({
        members: await response.json()
      });
    }, 5 * 1000);
  }

  render() {
    const { classes } = this.props;
    const { spacing } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid
            container
            className={classes.demo}
            justify="center"
            spacing={Number(spacing)}
          >
            {this.state.members.map((member, index) => (
              <Grid key={index} item>
                <Profile className={classes.paper} member={member} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

GuttersGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GuttersGrid);

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import usePrevious from './usePrevious';

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex',
    minHeight: 64
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  header: {
    textAlign: 'left'
  },
  // Button animation.
  button: {
    position: 'absolute'
  },
  buttonv2: {
    color: 'red'
  },
  '@keyframes bigger': {
    from: {
      fontSize: 24
    },
    to: {
      fontSize: 36
    }
  },
  '@keyframes smaller': {
    from: {
      fontSize: 36
    },
    to: {
      fontSize: 24
    }
  },
  animateBigger: {
    animation: `bigger 500ms ${theme.transitions.easing.easeInOut}`
  },
  animateSmaller: {
    animation: `smaller 500ms ${theme.transitions.easing.easeInOut}`
  }
});

function RecipeReviewCard({ classes, member }) {
  const [animate, setAnimate] = useState(0);
  const prevValue = usePrevious(member);

  useEffect(() => {
    const nextAnimate = animate === 2 ? 0 : animate + 1;

    if (animate !== 0) {
      setTimeout(() => {
        setAnimate(nextAnimate);
      }, 500);
    }
  }, [animate]);

  useEffect(() => {
    if (prevValue !== undefined && prevValue.version === 'v1') {
      setAnimate(1);
    }
  }, [member]);

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{member.initial}</Avatar>}
        classes={{
          title: classes.header,
          subheader: classes.header
        }}
        title={member.name}
        subheader={member.title}
      />
      <CardMedia
        className={classes.media}
        image={member.picture}
        title={member.name}
      />
      <CardContent>
        <Typography component="p">{member.quote}</Typography>
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton
          aria-label="Add to favorites"
          className={classnames(classes.button, {
            [classes.buttonv2]: member.version === 'v2'
          })}
        >
          <FavoriteIcon
            className={classnames({
              [classes.animateBigger]: animate === 1,
              [classes.animateSmaller]: animate === 2
            })}
          />
        </IconButton>
      </CardActions>
    </Card>
  );
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecipeReviewCard);

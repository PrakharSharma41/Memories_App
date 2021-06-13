import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);// this component runs every time state is updated
  const classes = useStyles();

  // isLoading is maintained by redux and hence it is one source of truth
  // thus it can be used in pagination, search etc.
  if (!posts.length && !isLoading) return 'No posts';// no posts exist

  return (
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {posts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>{/*show 1 post for extra small and small, 2 for medium 4 for large */}
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;

{/*xs=12 means it will take full width on extra small screen
                                sm=7 means it will take 7 out of 12 spaces in small or larger devices*/}
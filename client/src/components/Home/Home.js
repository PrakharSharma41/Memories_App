import React, { useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';// use History for renavigating to certain page, useLocation to know which page we are on currently
import ChipInput from 'material-ui-chip-input';// normal input but works great for tags, used in search button it gives inputs in chips

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

// we need to know which page we are we currently on 
function useQuery() {
  return new URLSearchParams(useLocation().search);// this allows us to use it as a hook
}
// Paper component is just a white div component
const Home = () => {
  const classes = useStyles();
  const query = useQuery();// this gives us page information

  // we will pass page as prop to pagination
  const page = query.get('page') || 1;// this reads our URL and see if we have page parameter there and then populate page variable default page is 1
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const history = useHistory();

  const searchPost = () => {
    if (search.trim() || tags) {
        // we cannot pass an array in query parameter thus we join its elements
        // below line is client side routing we did it so that on searching we changes our url and if we have
        // wish to send only those particular posts we can just copy paste that url alng with query parameters
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      if(search===''&&tags.length===0){ // if empty fields are present
        history.push('/');
      }
      else
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')|| 'none'}`);
    } else {
      history.push('/');// searched for nothing
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {// keyCode ==13 means enter key
      searchPost();
    }
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));// select only tag which are not equal to tag we want to delete

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>{/*take full space on mobile,half space on small and 3/4 on medium device  */}
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <ChipInput
                style={{ margin: '10px 0' }}// 10px top and bottom 0px left and right
                value={tags}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip) => handleDeleteChip(chip)}
                label="Search Tags"
                variant="outlined"
              />
              <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {/* if dont have searchquery and tags we paginate */}
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;

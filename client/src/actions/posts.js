import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';
import * as api from '../api/index.js';
// Action creators are function that returns an action
// as it is asynchronous function we need to add async keyword
// with redux thunk we add async keyword and instead of returning we have to dispatch it

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data } = await api.fetchPost(id);// this contains current page,posts, total number of pages

    dispatch({ type: FETCH_POST, payload: { post: data } });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = (page) => async (dispatch) => {// we have a function that returns a async function with dispatch
  try {
    dispatch({ type: START_LOADING });
    const { data: { data, currentPage, numberOfPages } } = await api.fetchPosts(page);// this contains current page,posts, total number of pages

    dispatch({ type: FETCH_ALL, payload: { data, currentPage, numberOfPages } });//  dispatching an action
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {// using redux thunk for asynchronous actions
  try {
    dispatch({ type: START_LOADING });

    // we have to destructure data 2 times one for axios request and second as we put it on object in data property
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });// sending data to our reducers to update store
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);// it is sending post api request to our backend server

    dispatch({ type: CREATE, payload: data });
    // we have not used history.push in handlesubmit of form.js as that time
    // we didn't have id of post id is obtained after saving it to database

    history.push(`/posts/${data._id}`);// this is done to move to post page after creating it
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post,history) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);// api response is returning updated post

    dispatch({ type: UPDATE, payload: data });
    history.push(`/posts/${data._id}`);// this is done to move to post page after updating it
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('profile'));

  try {
    const { data } = await api.likePost(id, user?.token);// api response is returning updated post

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await await api.deletePost(id);// we dont want return data

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

import axios from 'axios';

const API = axios.create({ baseURL: 'https://memories-prakhar.herokuapp.com/' });
// const API =axios.create({baseURL:'https://localhost:5000/'});
// we need to add token in headers authorization in each request thus we use 
// interceptors method , this method run before each request and add 
// token in header so that user can be authorized after login 
// we need to send this to backend so that backend can verify that we 
// are actually logged in

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});


export const fetchPost = (id) => API.get(`/posts/${id}`);// return all posts in database
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);// we are passing page to backend to know which page we are currently on
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);// in this we are also sending our query parameters to api
export const createPost = (newPost) => API.post('/posts', newPost);// posting newPost to url
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

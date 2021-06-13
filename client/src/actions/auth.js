import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';
// when form in auth is submitted handlesubmit function runs then lets say
// signin function is dispatched then it calls signin function here
// then this signin function calls api which communicates with server 
export const signin = (formData, router) => async (dispatch) => {// router is to move back to home page
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

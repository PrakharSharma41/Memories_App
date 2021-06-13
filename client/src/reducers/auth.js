import * as actionType from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {// default value of state is authData=NULL
  switch (action.type) {
    case actionType.AUTH:// getting the profile and setting it to local storage
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false, errors: null };

    case actionType.LOGOUT:// clears entore lcoalstorage
      localStorage.clear();
      return { ...state, authData: null, loading: false, errors: null };
    default:
      return state;
  }
};

export default authReducer;

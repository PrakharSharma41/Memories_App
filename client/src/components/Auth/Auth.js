import React from 'react';
import { useDispatch } from 'react-redux';
import { Button} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import Icon from './icon';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';

const Auth= () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });

      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = (error) => {
    console.log('Google Sign In was unsuccessful. Try again later');
    console.log(error);
  }


  return (
    <GoogleLogin
    clientId={process.env.CLIENT_ID}
    render={(renderProps) => (
      <Button className={classes.googleButton} color="primary" onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
        Google Sign In
      </Button>
    )}
    onSuccess={googleSuccess}
    onFailure={googleError}
    cookiePolicy="single_host_origin"
    />
  );
}

export default Auth;
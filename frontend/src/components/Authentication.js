import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

function Authentication({ location, history }) {
  const [code, setCode] = useState(queryString.parse(location.search).code);

  useEffect(() => {
    if (code) {
      (async function authenticate() {
        try {
          await fetch(`http://localhost:3333/authenticate?code=${code}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response);
              }
              return response.json();
            })
            .then(response => {
              if (!response.status) {
                throw new Error(response.error);
              }
              const { tokens } = response;
              // scope, refresh_token, expiry_date, access_token, token_type
              Object.keys(tokens).forEach(token => {
                sessionStorage.setItem(token, tokens[token]);
              });

              history.push('/');
            });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [code, history]);

  useEffect(() => {
    setCode(queryString.parse(location.search).code);
  }, [location]);

  return <></>;
}

export default withRouter(Authentication);

Authentication.propTypes = {
  location: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

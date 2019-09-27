/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import Loader from '../components/Loader';

export default function Main({ location }) {
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLive, setLive] = useState(false);
  const [isAuth, setAuth] = useState(null);
  const [channelId, setChannelId] = useState(null);

  useEffect(() => {
    const {
      expiry_date: expiryDate,
      access_token: accessToken,
    } = sessionStorage;
    if (accessToken && expiryDate / 1000 < +new Date() - 600) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [location]);

  useEffect(() => {
    if (isAuth) {
      const {
        scope,
        refresh_token,
        expiry_date,
        access_token,
        token_type,
      } = sessionStorage;
      const socket = io('http://localhost:3333', {
        query: {
          scope,
          refresh_token,
          expiry_date,
          access_token,
          token_type,
        },
      });

      socket.on('isLive', liveData => {
        console.log(liveData);
        setChannelId(liveData[0].snippet.channelId);
        setLive(true);
      });

      socket.on('liveError', err => {
        console.log(err);
        setError(err);
        setHasError(true);
      });

      fetch('http://localhost:3333/subscribe', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: sessionStorage.refresh_token,
        }),
      });
    }
  }, [isAuth]);

  async function signIn() {
    try {
      return fetch('http://localhost:3333/signin')
        .then(response => {
          if (!response.ok) {
            throw new Error(response.error);
          }
          return response.json();
        })
        .then(response => {
          if (!response.status) {
            throw new Error(response.error);
          }
          window.location.href = response.url;
        });
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  return (
    <>
      {!isAuth && (
        <button type="button" onClick={signIn}>
          <span>Log In</span>
        </button>
      )}
      {!error && isAuth && !isLive && (
        <>
          <Loader color="#fc0d1b" />
          <h2>Waiting for live stream</h2>
        </>
      )}
      {!error && isAuth && isLive && channelId && (
        <>
          <h2>Broadcasting</h2>
          <div className="video">
            <iframe
              title="Live Broadcast"
              src={`https://www.youtube.com/embed/live_stream?channel=${channelId}`}
              allowFullScreen
            />
          </div>
        </>
      )}
      {hasError && error && (
        <>
          <h1>Erro na requisição</h1>
          <pre>
            <p>{JSON.stringify(error, null, 2)}</p>
          </pre>
        </>
      )}
    </>
  );
}

Main.propTypes = {
  location: PropTypes.shape().isRequired,
};

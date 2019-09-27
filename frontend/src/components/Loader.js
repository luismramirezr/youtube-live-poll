import React from 'react';
import PropTypes from 'prop-types';
import './Loader.scss';

export default function Loader({ color, background, radius }) {
  return (
    <>
      <div
        className="loader"
        style={{
          backgroundColor: `rgba(${background})`,
          borderRadius: `${radius}px`,
        }}
      >
        <div className="spinner">
          <svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="28"
              stroke={color}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

Loader.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string,
  radius: PropTypes.string,
};

Loader.defaultProps = {
  color: '#ffffff',
  background: '0,0,0,0',
  radius: '0',
};

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './message.less';

function SystemMessage({ message, showTimeStamp }) {
  console.log('level:', message.level);
  return (
    <div className={styles.systemmessage}>
      <div>-----<span className={styles[`systext-${message.level}`]}>{message.text}</span>-----</div>
      {showTimeStamp && <span className={styles.timestamp}>{moment(message.timeStamp).format('hh:mm')}</span>}
    </div>
  );
}

SystemMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,

  }).isRequired,
  showTimeStamp: PropTypes.bool,
}

SystemMessage.defaultProps = {
  showTimeStamp: false,
}
export default SystemMessage;

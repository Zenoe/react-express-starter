import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './message.less';

function TextMessage({ message, showTimeStamp }) {
  // console.log('text:', message.text);
  return (
    <div className={styles.textmessage}>
      <div>{message.text}</div>
      {showTimeStamp && <span className={styles.timestamp}>{moment(message.timeStamp).format('hh:mm:ss')}</span>}
    </div>
  );
}

TextMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,

  }).isRequired,
  showTimeStamp: PropTypes.bool,
}

TextMessage.defaultProps = {
  showTimeStamp: true,
}
export default TextMessage;

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './message.less';

function ImageMessage({ message, showTimeStamp }) {
  console.log('img:', message.src);
  return (
    <div className={styles.textmessage}>
      <div>
        <img src={message.src} />
      </div>
      {showTimeStamp && <span className={styles.timestamp}>{moment(message.timeStamp).format('hh:mm:ss')}</span>}
    </div>
  );
}

ImageMessage.propTypes = {
  message: PropTypes.shape({
    src: PropTypes.string.isRequired,
  }).isRequired,
  showTimeStamp: PropTypes.bool,
}

ImageMessage.defaultProps = {
  showTimeStamp: true,
}

export default ImageMessage;

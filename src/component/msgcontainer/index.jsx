import React from 'react';
import PropTypes from 'prop-types';

import * as styles from './msgcontainer.less'

const MsgContainer=({children})=>(
  <div className={styles.msgbox}>
    {children}
  </div>
)

MsgContainer.propTypes = {
  children: PropTypes.element.isRequired
}

export default MsgContainer;

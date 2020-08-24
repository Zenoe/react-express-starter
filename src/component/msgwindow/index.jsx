import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid'

import * as styles from './msgwindow.less'
import MsgContainer from '../msgcontainer'

const defaultRender = (msg) =>{
  console.log(msg);
}

const renderMsg = (msgs) =>{
  if(!Array.isArray(msgs)){
    console.log('renderMsg invalid params:', msgs);
    return null;
  }

  return msgs.map((msg)=>{
    const RenderComp = msg.render;
    return <MsgContainer key={v4()}>{msg.render ? <RenderComp message={msg} /> : defaultRender(msg)}</MsgContainer>
  });
}

const MessageWindow=({arrMsg})=>{
  const bottomDiv = useRef(null)

  const scrollToBottom = () => {
    bottomDiv.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [arrMsg]);

  return(
    <div className={styles.msgwindow}>
      {renderMsg(arrMsg)}
      <div ref={bottomDiv} className={styles.bottomdiv} />
    </div>
  )
}

MessageWindow.propTypes = {
  arrMsg: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    timeStamp: PropTypes.number.isRequired,
  }))
}

MessageWindow.defaultProps = {
  arrMsg: [],
}

export default MessageWindow;

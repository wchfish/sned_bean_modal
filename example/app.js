import React from 'react'
import ReactDOM from 'react-dom'

import SendBeanModal from '../src/components/SendBeanModal'

import '../src/styles/normalize.scss';
import '../src/utils/rem.js';

const APP = ()=>{
    return(
      <SendBeanModal />
    )
}

ReactDOM.render(<APP/>, document.getElementById('app'))

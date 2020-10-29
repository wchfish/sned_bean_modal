import React from 'react'
import ReactDOM from 'react-dom'
import SendBeanModal from './components/SendBeanModal'
const name = 'send_bean_modal'
const version = '1.0.0'

const Modal = {
  name,
  version,
}

// 初始化方法
Modal.init = (cb) => {
  ReactDOM.render(
    <SendBeanModal />,
    document.querySelector('body'),
    () => {
      cb && cb()
    },
  )
}

export default Modal

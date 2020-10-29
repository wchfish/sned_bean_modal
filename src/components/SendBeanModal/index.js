import React, { Component, useCallback, useEffect, useState } from 'react'
import Dialog from '../Modal/DialogWrap'
import { requestSendBean } from '../../api/index'

import './index.scss'

import { newUserMock, oldUserMock } from '../../api/sendBeanMock'

const SendBeanModal = () => {
  const [beanCount, setBeanCount] = useState(0)
  const [userIdentity, setUserIdentity] = useState(false)
  const [hotModal, setHotModal] = useState(false)
  const [modalShow, setModalShow] = useState(false)

  useEffect(
    () => {
      requestSendBean()
        .then(res => {
          res = newUserMock
          const { success, data } = res
          const { beanCount, userIdentity } = data || {}
          if (success && data) {
            setBeanCount(beanCount)
            setUserIdentity(userIdentity)
            setModalShow(true)
          } else {
            console.log(res)
            setHotModal(true)
            setModalShow(true)
          }
        })
        .catch(err => {
          console.log(err)
          setHotModal(true)
          setModalShow(true)
        })
    },
    [],
  )

  // 关闭弹窗
  const closeModal = useCallback(
    () => {
      setModalShow(false)
    },
    []
  )

  return (
    <Dialog visible={modalShow} onClose={closeModal}>
      {
        !hotModal
          ? (
            <div className="content-wrapper content-wrapper-success column-align-center">
              <div className="title">{userIdentity === 0 ? '恭喜获得天天领京豆新客奖励' : '恭喜获得天天领京豆奖励'}</div>
              <div className="sub-title">京东购物支付时可直接用来抵现</div>
              <img className="bean-img" src={'https://img12.360buyimg.com/imagetools/jfs/t1/138626/15/7604/11593/5f51ef71E81a6f689/6be860f061990eba.png'} alt="" />
              <div className="bean-amount row-justify-center row-align-center">
                <div className="amount">{beanCount}</div>
                <div className="unit">京豆</div>
              </div>
              <div className="use-intro column-align-center">
                <p>10京豆已发送到您的京东账户中</p>
                <p>可在京东主站和小程序内看到对应京豆明细</p>
              </div>
              <div className="btn btn-ok" onClick={closeModal}>我知道了</div>
            </div>
          )
          : (
            <div className="content-wrapper content-wrapper-fail column-align-center">
              <p className="hot-tip tip-text">天天领京豆活动火爆</p>
              <p className="sub-tip tip-text">去看看其他活动</p>
              <div className="btn btn-other" onClick={closeModal}>查看其他活动</div>
            </div>
          )
      }
    </Dialog>
  )
}

export default SendBeanModal

import React from 'react'
import Animate from 'rc-animate'
import LazyRenderBox from './LazyRenderBox'

function noop() {
}
let scrollTop = null

export default class Dialog extends React.Component {
  dialogRef;

  bodyRef;

  headerRef;

  footerRef;

  wrapRef;

  componentWillUnmount() {
    // fix: react@16 no dismissing animation
    document.body.style.overflow = ''
    if (this.wrapRef) {
      this.wrapRef.style.display = 'none'
    }

    // 主动调用onAnimateLeave方法，避免弹窗以预料外的方式关闭，产生的副作用没有消除
    if (!this.hasAnimateLeave) {
      this.onAnimateLeave()
    }
  }

  getZIndexStyle() {
    const style = {}
    const props = this.props
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex
    }
    return style
  }

  getWrapStyle() {
    const { wrapStyle } = this.props || {}
    return { ...this.getZIndexStyle(), ...wrapStyle }
  }

  getMaskStyle() {
    const { maskStyle } = this.props || {}
    return { ...this.getZIndexStyle(), ...maskStyle }
  }

  getMaskTransitionName() {
    const props = this.props
    let transitionName = props.maskTransitionName
    const animation = props.maskAnimation
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`
    }
    return transitionName
  }

  getTransitionName() {
    const props = this.props
    let transitionName = props.transitionName
    const animation = props.animation
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`
    }
    return transitionName
  }

  getMaskElement() {
    const props = this.props
    let maskElement
    if (props.mask) {
      const maskTransition = this.getMaskTransitionName()
      maskElement = (
        <LazyRenderBox
          style={this.getMaskStyle()}
          key="mask-element"
          className={`${props.prefixCls}-mask`}
          hiddenClassName={`${props.prefixCls}-mask-hidden`}
          visible={props.visible}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props.maskProps}
        />
      )
      if (maskTransition) {
        maskElement = (
          <Animate
            key="mask"
            showProp="visible"
            transitionAppear
            component=""
            transitionName={maskTransition}
          >
            {maskElement}
          </Animate>
        )
      }
    }
    return maskElement
  }

  getDialogElement = () => {
    const props = this.props
    const closable = props.closable
    const prefixCls = props.prefixCls

    let closer
    if (closable) {
      closer = (
        <p
          onClick={this.close}
          aria-label="Close"
          className={`${props.closePosition}-close`}
        />
      )
    }

    const transitionName = this.getTransitionName()
    const dialogElement = (
      <LazyRenderBox
        key="dialog-element"
        role="document"
        ref={el => this.dialogRef = el}
        style={props.style || {}}
        className={`${prefixCls} ${props.className || ''}`}
        visible={props.visible}
      >
        <div className={`${prefixCls}-content ${!props.isBg ? 'content-no-ng' : ''}`}>
          <div
            className={`${prefixCls}-body`}
            style={props.bodyStyle}
            ref={el => this.bodyRef = el}
          >
            {props.children}
          </div>
        </div>
        {closer}
      </LazyRenderBox>
    )
    return (
      <Animate
        key="dialog"
        showProp="visible"
        onAppear={this.onAnimateAppear}
        onLeave={this.onAnimateLeave}
        transitionName={transitionName}
        component=""
        transitionAppear
      >
        {dialogElement}
      </Animate>
    )
  }

  onAnimateAppear = () => {
    // document.body.style.overflow = 'hidden';
    scrollTop = document.scrollingElement.scrollTop
    document.body.classList.add('model-open')
    document.body.style.top = `${-scrollTop}px`

    // 记录是否执行了onAnimateLeave方法
    this.hasAnimateLeave = false
  }

  onAnimateLeave = () => {
    // 修改状态位
    this.hasAnimateLeave = true

    // document.body.style.overflow = '';
    document.body.classList.remove('model-open')
    document.scrollingElement.scrollTop = scrollTop
    const { onAnimateLeave, afterClose } = this.props
    if (this.wrapRef) {
      this.wrapRef.style.display = 'none'
    }
    if (onAnimateLeave) {
      onAnimateLeave()
    }
    if (afterClose) {
      afterClose()
    }
  }

  close = (e) => {
    const { onClose } = this.props
    if (onClose) {
      onClose(e)
    }
  }

  onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      this.close(e)
    }
  }

  render() {
    const { props } = this
    const { prefixCls, maskClosable } = props
    const style = this.getWrapStyle()
    if (props.visible) {
      style.display = null
    }
    return (
      <div>
        {this.getMaskElement()}
        <div
          className={`${prefixCls}-wrap`}
          ref={el => this.wrapRef = el}
          onClick={maskClosable ? this.onMaskClick : undefined}
          role="dialog"
          aria-labelledby={props.title}
          style={style}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props.wrapProps}
        >
          {this.getDialogElement()}
        </div>
      </div>
    )
  }
}

Dialog.defaultProps = {
  afterClose: noop,
  className: '',
  mask: true,
  visible: false,
  closable: true,
  maskClosable: true,
  prefixCls: 'common-dialog',
  onClose: noop,
  isBg: true,
  closePosition: 'common-dialog',
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuDroppo from '../../menu-droppo'

export class Dropdown extends Component {
  render () {
    const {
      containerClassName,
      isOpen,
      onClickOutside,
      style,
      innerStyle,
      children,
      useCssTransition,
    } = this.props

    const innerStyleDefaults = Object.assign({
      borderRadius: '9px',
      padding: '8px 16px',
      background: '#FFFFFF',
      boxShadow: '0px 14px 28px rgba(46, 91, 255, 0.06)',
      border: '1px solid #F5F5F5',
    }, innerStyle)

    return (
      <MenuDroppo
        containerClassName={containerClassName}
        useCssTransition={useCssTransition}
        isOpen={isOpen}
        zIndex={55}
        onClickOutside={onClickOutside}
        style={style}
        innerStyle={innerStyleDefaults}
      >
        <style>
          {`
            li.dropdown-menu-item:hover {
              color:rgb(15,18,34);
              background-color: rgba(255, 255, 255, 0.05);
              border-radius: 9px;
            }
            li.dropdown-menu-item { color: rgb(185, 185, 185); }
          `}
        </style>
        { children }
      </MenuDroppo>
    )
  }
}

Dropdown.defaultProps = {
  useCssTransition: false,
}

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  style: PropTypes.object.isRequired,
  onClickOutside: PropTypes.func,
  innerStyle: PropTypes.object,
  useCssTransition: PropTypes.bool,
  containerClassName: PropTypes.string,
}

export class DropdownMenuItem extends Component {
  render () {
    const { onClick, closeMenu, children, style } = this.props

    return (
      <li
        className="dropdown-menu-item"
        onClick={() => {
          onClick()
          closeMenu()
        }}
        style={Object.assign({
          listStyle: 'none',
          padding: '8px 0px',
          fontSize: '18px',
          fontStyle: 'normal',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          color: 'white',
        }, style)}
      >
        {children}
      </li>
    )
  }
}

DropdownMenuItem.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  style: PropTypes.object,
}

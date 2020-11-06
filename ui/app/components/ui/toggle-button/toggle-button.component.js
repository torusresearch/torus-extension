import React from 'react'
import PropTypes from 'prop-types'
import ReactToggleButton from 'react-toggle-button'

const trackStyle = {
  width: '40px',
  height: '24px',
  padding: '0px',
  borderRadius: '26px',
  border: '2px solid rgb(3, 125, 214)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const offTrackStyle = {
  ...trackStyle,
  border: '2px solid #8E8E8E',
}

const thumbStyle = {
  width: '20px',
  height: '20px',
  display: 'flex',
  boxShadow: 'none',
  alignSelf: 'center',
  borderRadius: '50%',
  position: 'relative',
}

const colors = {
  activeThumb: {
    base: '#FFFFFF',
  },
  inactiveThumb: {
    base: '#4d4d4d',
  },
  active: {
    base: '#0364FF',
    hover: '#0364FF',
  },
  inactive: {
    base: '#DADADA',
    hover: '#DADADA',
  },
}

const ToggleButton = (props) => {
  const { value, onToggle, offLabel, onLabel } = props

  const modifier = value ? 'on' : 'off'

  return (
    <div className={`toggle-button toggle-button--${modifier}`}>
      <div className="toggle-button__status">
        <span className="toggle-button__label-off">{offLabel}</span>
        <span className="toggle-button__label-on">{onLabel}</span>
      </div>
      <ReactToggleButton
        value={value}
        onToggle={onToggle}
        activeLabel=""
        inactiveLabel=""
        trackStyle={value ? trackStyle : offTrackStyle}
        thumbStyle={thumbStyle}
        thumbAnimateRange={[2, 18]}
        colors={colors}
      />
    </div>
  )
}

ToggleButton.propTypes = {
  value: PropTypes.bool,
  onToggle: PropTypes.func,
  offLabel: PropTypes.string,
  onLabel: PropTypes.string,
}

export default ToggleButton

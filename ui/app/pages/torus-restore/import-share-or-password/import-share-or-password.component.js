import React, { Component } from 'react'
// import { Switch, Route, matchPath } from 'react-router-dom'
import PropTypes from 'prop-types'
// import classnames from 'classnames'

import Select, { components } from 'react-select'
import ComputerIcon from '@material-ui/icons/Computer'
import Grid from '@material-ui/core/Grid'
import Bowser from 'bowser'
import Button from '../../../components/ui/button'

import {
  TORUS_RESTORE_PASSWORD_ROUTE,
  TRP_PASSWORD_ROUTE,
  TRP_DEVICE_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
} from '../../../helpers/constants/routes'

export default class ImportShareOrPassword extends Component {
  state = {
    tabHeading: 'Verify with Device',
    accountPasswordError: '',
  }

  state = {
    selectedDevice: '',
    devices: [],
  }

  componentDidMount () {
    const { changeHeading, getTotalDeviceShares } = this.props

    changeHeading('Verify with Device') // for tabs

    // this.setDeviceDetails(); // for adding this extension

    // Show options with labels
    getTotalDeviceShares().then((devices) => {
      const totalDevices = []
      Object.keys(devices).map((index) => {
        devices[index] = devices[index].slice(0, 1)
        return devices[index].map((device) => {
          const date = new Date(device.dateAdded)
          const browser = Bowser.getParser(device.userAgent)
          totalDevices.push({
            label: this.getBowserLabel(device.userAgent),
            value: index,
            browser: {
              name: browser.getBrowserName(),
              os: browser.getOSName(),
              platform: browser.getPlatformType(),
              date: date.toDateString(),
              index: index,
            },
          })
        })
        // return {label: getBrowserLabel(devices)}
      })
      this.setState({
        devices: totalDevices,
        selectedDevice: totalDevices[0],
      })
    }) // populate list of available devices
  }

  getBowserLabel (agent) {
    const browser = Bowser.getParser(agent)
    return browser.getBrowserName() + ' ' + browser.getOSName()
  }

  renderAddOldDevice = () => {
    const { devices, selectedDevice } = this.state
    // console.log(components)
    // debugger
    const { Option, ValueContainer, IndicatorSeparator } = components

    const indicatorSeparatorStyle = {
      width: 0,
    }

    const IndicatorSeparator2 = ({ innerProps }) => {
      return <span style={indicatorSeparatorStyle} {...innerProps} />
    }

    const IconOption = (props) => {
      // console.log(props)
      return (
        <Option {...props}>
          <div className="new-account-create-form__device-info">
            <Grid container>
              <Grid item xs={2}>
                <ComputerIcon />
              </Grid>
              <Grid item xs={10}>
                <h4>
                  {props.data.browser.os}
                  <span>
                    {' '}
                    {' (' + props.data.browser.index.substring(0, 4) + ')'}
                  </span>
                </h4>
                <p>
                  {props.data.browser.platform + ', ' + props.data.browser.name}
                </p>
                <p>{props.data.browser.date}</p>
              </Grid>
            </Grid>
          </div>
        </Option>
      )
    }
    const SingleOption = (props) => {
      // debugger
      // console.log(props.data)
      return (
        <ValueContainer {...props}>
          <div className="new-account-create-form__device-info">
            <Grid container>
              <Grid item xs={2}>
                <ComputerIcon />
              </Grid>
              <Grid item xs={10}>
                <h4>
                  {props.data.browser.os}
                  <span>
                    {' '}
                    {' (' + props.data.browser.index.substring(0, 4) + ')'}
                  </span>
                </h4>
                <p>
                  {props.data.browser.platform + ', ' + props.data.browser.name}
                </p>
                <p>{props.data.browser.date}</p>
              </Grid>
            </Grid>
          </div>
        </ValueContainer>
      )
    }

    const ValueOption = (props) => {
      // debugger
      // console.log(props)
      return <ValueContainer {...props}>{props.children}</ValueContainer>
    }

    return (
      <Select
        className="new-account-create-form__device-select new-account-create-form__device-select--options-device"
        name="import-type-select"
        isClearable={false}
        // value={selectedDevice}
        options={devices}
        defaultValue={selectedDevice}
        closeMenuOnScroll={false}
        isSearchable={false}
        styles={{
          valueContainer: (base) => ({
            ...base,
            width: '100%',
          }),
          option: (base, { data, isDisabled, isFocused, isSelected }) => ({
            ...base,
            color: 'black',
          }),
        }}
        onChange={(opt) => {
          this.setState({ selectedDevice: opt })
        }}
        components={{
          Option: IconOption,
          SingleValue: SingleOption,
          ValueContainer: ValueOption,
          IndicatorSeparator: IndicatorSeparator2,
        }}
      />
    )
  }

  gotoPassword = () => {
    const { history } = this.props
    history.goBack()
  }

  requestShare = async () => {
    const {
      requestShareFromOtherDevice,
      startRequestStatusCheck,
      history,
    } = this.props
    // const { accountPasswordError } = this.state
    try {
      const key = await requestShareFromOtherDevice()
      await startRequestStatusCheck(key)
      console.log('share transfer request completed')
      history.push(TRP_DEVICE_ROUTE)
    } catch (err) {
      if (err.message === 'User cancelled request') {
        this.setState({ accountPasswordError: `${err.message}. Please create a new request` })
      }
      // show error UI
      console.log(err)
    }
  }

  render () {
    const { accountPasswordError } = this.state
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-image">
          <img src="images/tkey-input-methods.png" />
        </div>
        <div className="new-account-create-form__input-label">
          Login to <span style={{ fontWeight: 'bold' }}>one</span> of the stored browser below to verify your identity.
        </div>

        {this.renderAddOldDevice()}

        <p className="new-account-create-form__error-message">{accountPasswordError}</p>
        <div className="new-account-create-form__buttons">
          <Button
            type="link"
            className="new-account-create-form__button new-account-create-form__button--cancel"
            onClick={this.gotoPassword}
          >
            Verify using password
          </Button>
          <Button
            type="primary"
            className="new-account-create-form__button"
            onClick={this.requestShare}
          >
            Request Share
          </Button>
        </div>
      </div>
    )
  }
}

ImportShareOrPassword.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  requestShareFromOtherDevice: PropTypes.func,
  startRequestStatusCheck: PropTypes.func,
}

ImportShareOrPassword.contextTypes = {
  t: PropTypes.func,
}

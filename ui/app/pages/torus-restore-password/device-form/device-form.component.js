import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import Select from "react-select";
import Bowser from "bowser"; 
import {
  INITIALIZE_END_OF_FLOW_ROUTE,
  DEFAULT_ROUTE
} from '../../../helpers/constants/routes'

export default class DeviceForm extends Component {
  static defaultProps = {
    newAccountNumber: 0
  };

  state = {
    inputPassword: "",
    defaultAccountName: "Enter your password here",
    selectedDevice: "New-device",
    browser: "",
    devices: []
  };

  componentDidMount() {
    const { changeHeading, getTotalDeviceShares } = this.props;
    
    changeHeading("Verify device"); // for tabs
    
    this.setDeviceDetails(); // for adding this extension

    // Show options with labels
    getTotalDeviceShares().then(devices => {
      let totalDevices = [{ label: "New device", value: "New-device" }]
      Object.keys(devices).map(index => {
        devices[index] = devices[index].slice(0,1)
        return devices[index].map(device => {
          totalDevices.push({label: this.getBowserLabel(device.userAgent), value: index})
        })
        // return {label: getBrowserLabel(devices)}
      })
      this.setState({
        devices: totalDevices
      })
      console.log(totalDevices)
    }) // populate list of available devices
  }

  getBowserLabel(agent) {
    const browser = Bowser.getParser(agent);
    return browser.getBrowserName() + " " + browser.getOSName()
  }

  setDeviceDetails() {
    const browser = Bowser.getParser(navigator.userAgent);
    // console.log(browser)
    this.setState({
      browser: browser.getBrowserName() + " " + browser.getOSName()
    });
  }

  addDevice = async () => {
    const { selectedDevice } = this.state
    const {copyShareUsingIndexAndStoreLocally, generateAndStoreNewDeviceShare, history} = this.props
    if (selectedDevice === 'New-device') {
      try {
        await generateAndStoreNewDeviceShare()
        history.push(INITIALIZE_END_OF_FLOW_ROUTE)
      } catch (err) {
        console.error(err)
        debugger
      }
    }
    else {
      try {
        await copyShareUsingIndexAndStoreLocally(selectedDevice)
        history.push(INITIALIZE_END_OF_FLOW_ROUTE)
      } catch (err) {
        console.error(err)
        debugger
      }
    }
  }

  continueWithoutAddingDevice = () => {
    const { history } = this.props
    history.push(INITIALIZE_END_OF_FLOW_ROUTE)
  }

  render() {
    const {
      inputPassword,
      defaultAccountName,
      selectedDevice,
      browser,
      devices
    } = this.state;
  
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          Confirm your browser and device details. Store it for future access
          into your 2FA Wallet.
        </div>
        <div>
          <div className="new-account-create-form__device-info">
            <p>Browser</p>
            <p>{browser}</p>
          </div>

          <div className="new-account-import-form__select-section">
            {/* <div className="new-account-import-form__select-label">
            </div> */}
            <Select
              className="new-account-import-form__device-select"
              name="import-type-select"
              clearable={false}
              value={selectedDevice}
              options={devices}
              onChange={opt => {
                console.log(opt)
                this.setState({ selectedDevice: opt.value });
              }}
            />
          </div>

          <div className="new-account-create-form__buttons">
            <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={this.continueWithoutAddingDevice}
            >
              Don't add browser
            </Button>
            <Button
              type="secondary"
              large
              className="new-account-create-form__button new-account-create-form__confirm-button"
              onClick={this.addDevice}
            >
              Confirm and add
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

DeviceForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string,
  changeHeading: PropTypes.func,
  getTotalDeviceShares: PropTypes.func,
  copyShareUsingIndexAndStoreLocally: PropTypes.func,
  generateAndStoreNewDeviceShare: PropTypes.func,
  deleteShareDescription: PropTypes
};

DeviceForm.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func
};

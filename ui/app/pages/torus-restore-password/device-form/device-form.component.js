import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import Select from "react-select";
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
    selectedDevice: "Device 1",
    browser: "",
    devices: []
  };

  componentDidMount() {
    const { changeHeading, getTotalDeviceShares } = this.props;
    
    changeHeading("Verify device"); // for tabs
    
    this.getChromeVersion(); // for adding this extension

    getTotalDeviceShares().then(el => {
      this.setState({
        devices: el
      })
    }) // populate list of available devices
  }

  getChromeVersion() {
    this.setState({
      browser: navigator.userAgent.match(/Chrome\/([0-9.]+)/)[0]
    });
  }

  addDevice = () => {
    
  }

  continueWithoutAddingDevice = () => {
    const { history } = this.props
    history.push(DEFAULT_ROUTE)
  }

  render() {
    const {
      inputPassword,
      defaultAccountName,
      selectedDevice,
      browser
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
              options={[
                { value: "Device 1", label: "Device 1" },
                { value: "Device 2", label: "Device 2" }
              ]}
              onChange={opt => {
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
  getTotalDeviceShares: PropTypes.func
};

DeviceForm.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func
};

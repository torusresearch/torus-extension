import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import Select from "react-select";
import { components } from "react-select";
import Bowser from "bowser";
import {
  INITIALIZE_END_OF_FLOW_ROUTE,
  DEFAULT_ROUTE
} from "../../../helpers/constants/routes";
import ComputerIcon from "@material-ui/icons/Computer";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export default class DeviceForm extends Component {
  static defaultProps = {
    newAccountNumber: 0
  };

  state = {
    inputPassword: "",
    defaultAccountName: "Enter your password here",
    selectedDevice: "New-device",
    currentDevice: {},
    browser: {},
    devices: [],
    tabValue: 1
  };

  componentDidMount() {
    const { changeHeading, getTotalDeviceShares } = this.props;

    changeHeading("Save extension"); // for tabs

    this.setDeviceDetails(); // for adding this extension

    // Show options with labels
    getTotalDeviceShares().then(devices => {
      let totalDevices = [];
      Object.keys(devices).map(index => {
        devices[index] = devices[index].slice(0, 1);
        return devices[index].map(device => {
          let date = new Date(device.dateAdded)
          const browser = Bowser.getParser(device.userAgent);
          totalDevices.push({
            label: this.getBowserLabel(device.userAgent),
            value: index,
            browser: {
              name: browser.getBrowserName(),
              os: browser.getOSName(),
              platform: browser.getPlatformType(),
              date: date.toDateString(),
              index: index
            }
          });
        });
        // return {label: getBrowserLabel(devices)}
      });
      this.setState({
        devices: totalDevices
      });
      console.log(totalDevices);
    }); // populate list of available devices
  }

  getBowserLabel(agent) {
    const browser = Bowser.getParser(agent);
    return browser.getBrowserName() + " " + browser.getOSName();
  }

  setDeviceDetails() {
    const browser = Bowser.getParser(navigator.userAgent);
    // console.log(browser)
    let date = new Date()

    this.setState({
      browser: {
        name: browser.getBrowserName(),
        os: browser.getOSName(),
        platform: browser.getPlatformType(),
        date: date.toDateString()
      }
    });
  }

  addDevice = async () => {
    const { selectedDevice, tabValue } = this.state;
    const {
      copyShareUsingIndexAndStoreLocally,
      generateAndStoreNewDeviceShare,
      history
    } = this.props;
    if (tabValue === 1) {
      try {
        await generateAndStoreNewDeviceShare();
        history.push(INITIALIZE_END_OF_FLOW_ROUTE);
      } catch (err) {
        console.error(err);
        debugger;
      }
    } else {
      try {
        await copyShareUsingIndexAndStoreLocally(selectedDevice.index);
        history.push(INITIALIZE_END_OF_FLOW_ROUTE);
      } catch (err) {
        console.error(err);
        debugger;
      }
    }
  };

  continueWithoutAddingDevice = () => {
    const { history } = this.props;
    history.push(INITIALIZE_END_OF_FLOW_ROUTE);
  };

  renderAddNewDevice() {
    const { browser } = this.state;

    return (
      <div className="new-account-create-form__device-info">
        <Grid container>
          <Grid item xs={2}>
            <ComputerIcon />
          </Grid>
          <Grid item xs={10}>
            <h4>
              {browser.os}
              <span> (Current new device)</span>
            </h4>
            <p>{browser.platform + ", " + browser.name}</p>
            <p>{browser.date}</p>
          </Grid>
        </Grid>
      </div>
    );
  }


  renderAddOldDevice() {
    const { devices, selectedDevice } = this.state;
    // console.log(components)
    // debugger
    const { Option, ValueContainer } = components;

    const IconOption = props => {
      // console.log(props)
      return (
        <Option {...props}>
          <div className="new-account-create-form__device-info new-account-create-form__device-option">
            <Grid container>
              <Grid item xs={2}>
                <ComputerIcon />
              </Grid>
              <Grid item xs={10}>
                <h4>
                  {props.data.browser.os}
                  <span> {" (" + props.data.browser.index.substring(0, 4) + ")"}</span>
                </h4>
                <p>{props.data.browser.platform + ", " + props.data.browser.name}</p>
                <p>{props.data.browser.date}</p>
              </Grid>
            </Grid>
          </div>
        </Option>
      );
    };
    const ValueOption = (props) => {
      // debugger
      console.log(props.data)
      return (
        <ValueContainer {...props}>
          <div className="new-account-create-form__device-info new-account-create-form__device-option">
            <Grid container>
              <Grid item xs={2}>
                <ComputerIcon />
              </Grid>
              <Grid item xs={10}>
                <h4>
                  {props.data.os}
                  <span> {" (" + props.data.index.substring(0, 4)+")"}</span>
                </h4>
                <p>{props.data.platform + ", " + props.data.name}</p>
                <p>{props.data.date}</p>
              </Grid>
            </Grid>
          </div>
        </ValueContainer>
      );
    };

    return (
      <Select
        className="new-account-create-form__device-select"
        name="import-type-select"
        clearable={false}
        value={selectedDevice}
        options={devices}
        defaultValue={devices[0].browser}
        closeMenuOnScroll={false}
        isSearchable={false}
        onChange={opt => {
          console.log(opt);
          this.setState({ selectedDevice: opt.browser });
        }}
        components={{ Option: IconOption, SingleValue: ValueOption }}
      />
    );
  }

  render() {
    const {
      inputPassword,
      defaultAccountName,
      selectedDevice,
      browser,
      devices,
      tabValue
    } = this.state;

    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          Confirm your browser and device details. Store it for future access
          into your 2FA Wallet.
        </div>

        <div className="new-account-create-form__tabs">
          <div
            className={`new-account-create-form__tab ${
              tabValue === 1 ? "new-account-create-form__tab-selected" : ""
            }`}
            onClick={() => this.setState({ tabValue: 1 })}
          >
            New device
          </div>
          <div
            className={`new-account-create-form__tab ${
              tabValue === 2 ? "new-account-create-form__tab-selected" : ""
            }`}
            onClick={() => this.setState({ tabValue: 2 })}
          >
            Old device
          </div>
        </div>

        {tabValue === 1 ? this.renderAddNewDevice() : this.renderAddOldDevice()}

        <div className="new-account-create-form__buttons">
          <Button
            type="default"
            large
            className="new-account-create-form__button new-account-create-form__cancel-button"
            onClick={this.continueWithoutAddingDevice}
          >
            Don't add chrome extension
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

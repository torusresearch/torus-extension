import React, { Component } from "react";
import { Switch, Route, matchPath } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";

import Select from "react-select";
import { components } from "react-select";
import ComputerIcon from "@material-ui/icons/Computer";
import Grid from "@material-ui/core/Grid";
import Bowser from "bowser";
import Button from "../../../components/ui/button";

import {
  TORUS_RESTORE_PASSWORD_ROUTE,
  TRP_PASSWORD_ROUTE,
  TRP_DEVICE_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE
} from "../../../helpers/constants/routes";

export default class ImportShareOrPassword extends Component {
  state = {
    tabHeading: "Verify with device"
  };

  state = {
    inputPassword: "",
    defaultAccountName: "Enter your password here",
    selectedDevice: "",
    instruction:
      "Confirm your browser and device details. Store it for future access into your 2FA Wallet.",
    currentDevice: {},
    browser: {},
    devices: [],
    tabValue: 1
  };

  componentDidMount() {
    const { changeHeading, getTotalDeviceShares } = this.props;

    changeHeading("Verify with device"); // for tabs

    // this.setDeviceDetails(); // for adding this extension

    // Show options with labels
    getTotalDeviceShares().then(devices => {
      let totalDevices = [];
      Object.keys(devices).map(index => {
        devices[index] = devices[index].slice(0, 1);
        return devices[index].map(device => {
          let date = new Date(device.dateAdded);
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
        devices: totalDevices,
        selectedDevice: totalDevices[0]
      });
    }); // populate list of available devices
  }

  getBowserLabel(agent) {
    const browser = Bowser.getParser(agent);
    return browser.getBrowserName() + " " + browser.getOSName();
  }

  renderAddOldDevice = () => {
    const { devices, selectedDevice } = this.state;
    // console.log(components)
    // debugger
    const { Option, ValueContainer, IndicatorSeparator } = components;

    const indicatorSeparatorStyle = {
      width: 0
    };

    const IndicatorSeparator2 = ({ innerProps }) => {
      return <span style={indicatorSeparatorStyle} {...innerProps} />;
    };

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
                  <span>
                    {" "}
                    {" (" + props.data.browser.index.substring(0, 4) + ")"}
                  </span>
                </h4>
                <p>
                  {props.data.browser.platform + ", " + props.data.browser.name}
                </p>
                <p>{props.data.browser.date}</p>
              </Grid>
            </Grid>
          </div>
        </Option>
      );
    };
    const SingleOption = props => {
      // debugger
      // console.log(props.data)
      return (
        <ValueContainer {...props}>
          <div className="new-account-create-form__device-info new-account-create-form__device-option">
            <Grid container>
              <Grid item xs={2}>
                <ComputerIcon />
              </Grid>
              <Grid item xs={10}>
                <h4>
                  {props.data.browser.os}
                  <span>
                    {" "}
                    {" (" + props.data.browser.index.substring(0, 4) + ")"}
                  </span>
                </h4>
                <p>
                  {props.data.browser.platform + ", " + props.data.browser.name}
                </p>
                <p>{props.data.browser.date}</p>
              </Grid>
            </Grid>
          </div>
        </ValueContainer>
      );
    };

    const ValueOption = props => {
      // debugger
      // console.log(props)
      return <ValueContainer {...props}>{props.children}</ValueContainer>;
    };

    return (
      <Select
        className="new-account-create-form__device-select"
        name="import-type-select"
        isClearable={false}
        // value={selectedDevice}
        options={devices}
        defaultValue={selectedDevice}
        closeMenuOnScroll={false}
        isSearchable={false}
        styles={{
          valueContainer: base => ({
            ...base,
            width: "100%"
          }),
          option: (base, { data, isDisabled, isFocused, isSelected }) => ({
            ...base,
            color: "black"
          })
        }}
        onChange={opt => {
          this.setState({ selectedDevice: opt });
        }}
        components={{
          Option: IconOption,
          SingleValue: SingleOption,
          ValueContainer: ValueOption,
          IndicatorSeparator: IndicatorSeparator2
        }}
      />
    );
  };

  gotoPassword = () => {
    const { history } = this.props;
    history.goBack();
  };

  requestShare = async () => {
    const {
      requestShareFromOtherDevice,
      startRequestStatusCheck,
      history
    } = this.props;
    try {
      let key = await requestShareFromOtherDevice();
      // console.log(key)
      // start loader ui with message
      await startRequestStatusCheck(key);
      console.log("share transfer request completed");
      // setTimeout(function() {
      //   history.push(INITIALIZE_END_OF_FLOW_ROUTE);
      // }, 4000);
      history.push(INITIALIZE_END_OF_FLOW_ROUTE)
    } catch (err) {
      // show error UI
      console.log(err)
    }
  };

  render() {
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          Login to app.tor.us using one of the stored devices to verify your
          identity.
        </div>

        {this.renderAddOldDevice()}

        <div className="new-account-create-form__buttons">
          <Button
            type="default"
            large
            className="new-account-create-form__button new-account-create-form__cancel-button"
            onClick={this.gotoPassword}
          >
            Verify using password
          </Button>
          <Button
            type="secondary"
            large
            className="new-account-create-form__button new-account-create-form__confirm-button"
            onClick={this.requestShare}
          >
            Request Share
          </Button>
        </div>
      </div>
    );
  }
}

ImportShareOrPassword.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  requestShareFromOtherDevice: PropTypes.func,
  startRequestStatusCheck: PropTypes.func
};

ImportShareOrPassword.contextTypes = {
  t: PropTypes.func
};

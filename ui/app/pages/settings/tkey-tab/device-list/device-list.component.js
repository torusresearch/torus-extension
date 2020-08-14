import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Bowser from "bowser";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Button from "../../../../components/ui/button";

export default class DeviceList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    metricsEvent: PropTypes.func.isRequired
  };

  static propTypes = {
    passwordShare: PropTypes.object,
    addPasswordShare: PropTypes.func,
    changePasswordShare: PropTypes.func,
    renderThresholdPanels: PropTypes.func
  };

  constructor(props) {
    super(props);
    // console.log(props)
    let { currentDeviceShare, shareDesc, shareIndex } = props;

    this.state = {
      shareDesc: shareDesc,
      shareIndex: shareIndex,
      currentDeviceShare: currentDeviceShare
    };
  }

  getBowserLabel(agent) {
    const browser = Bowser.getParser(agent);
    return browser.getBrowserName() + " " + browser.getOSName();
  }

  renderHeading() {
    const { shareDesc } = this.state;
    let el = (
      <p className="tkey-tab__subheading">
        Device - {this.getBowserLabel(shareDesc[0].userAgent)}
      </p>
    );
    return el;
  }

  renderDevices() {
    const { shareDesc } = this.state;
    return shareDesc.map(device => {
      return (
        <div className="tkey-tab__subshare">
          <p>{Bowser.getParser(device.userAgent).getBrowserName()}</p>
          <DeleteOutlinedIcon />
        </div>
      );
    });
  }

  render() {
    let { currentDeviceShare } = this.state;
    console.log(currentDeviceShare);

    return (
      <div className="tkey-tab__share">
        {this.renderHeading()}
        <div className="tkey-tab__borderWrapper">{this.renderDevices()}</div>
        <Button type="secondary" className="tkey-tab__addshareButton">
          Add new browser
        </Button>
      </div>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Bowser from "bowser";
import PasswordForm from "./password-form";
import DeviceList from "./device-list";
import Spinner from '../../../components/ui/spinner'

export default class tkeyTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func
  };

  static propTypes = {
    warning: PropTypes.string,
    history: PropTypes.object,
    getTkeyState: PropTypes.func.isRequired,
    getTkeyState2: PropTypes.func.isRequired,
    getTkeyDataForSettingsPage: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.renderThresholdPanels();
  }

  constructor(props) {
    super(props);
    this.state = {
      torusPanel: null,
      deviceSharePanel: null,
      passwordPanel: null,
      accountPassword: "",
      accountPasswordError: "",
      passwordShare: null,
      random: Math.random(),
      currentThreshold: "",
      allDeviceShares: null,
      currentDeviceShare: null
    };
  }

  getBowserLabel(agent) {
    const browser = Bowser.getParser(agent);
    return browser.getBrowserName() + " " + browser.getOSName();
  }

  renderThresholdPanels = () => {
    const { getTkeyDataForSettingsPage } = this.props;

    getTkeyDataForSettingsPage().then(el => {
      // console.log(el);
      let serviceProvider = el.serviceProvider;
      let currentDeviceShare = el.deviceShare;
      let allDeviceShares = el.allDeviceShares;

      // let passwordShare = el.passwordShare;
      this.setState({
        passwordShare: el.passwordShare,
        random: Math.random(),
        currentThreshold: el.threshold,
        allDeviceShares: allDeviceShares,
        currentDeviceShare: currentDeviceShare
      });
      // this.renderPasswordPanel(el.passwordShare);

      this.setState({
        torusPanel: (
          <div className="tkey-tab__share">
            <p className="tkey-tab__subheading">Torus Network</p>
            <div className="tkey-tab__borderWrapper">
              <div className="tkey-tab__subshare">
                <p>{serviceProvider.verifierId}</p>
                {/* <DeleteOutlinedIcon /> */}
              </div>
            </div>
            {/* <Button type="secondary" className="tkey-tab__addshareButton">
              Add share
            </Button> */}
          </div>
        )
      });
    });
  };

  handlePasswordChange(el) {
    this.setState(state => {
      const { accountPassword } = state;
      let accountPasswordError = "";

      // Add check for password if minimum 10 digits
      if (el.length < 10) {
        accountPasswordError = "Password should be minimum 10 digis";
      }

      return {
        accountPassword: el,
        accountPasswordError: accountPasswordError
      };
    });
  }

  async addAccountPassword() {
    const { accountPassword, accountPasswordError } = this.state;
    const { history, addPasswordShare } = this.props;
    // console.log(accountPassword);

    if (accountPasswordError == "") {
      await addPasswordShare(accountPassword);
      this.renderThresholdPanels(); // reload panel
    } else {
      // Show error
    }
  }

  renderDeviceList() {
    const { allDeviceShares, currentDeviceShare } = this.state;
    let el = Object.keys(allDeviceShares).map(index => {
      if (allDeviceShares[index].length === 0) return;
      return (
        <DeviceList
          key={index}
          shareDesc={allDeviceShares[index]}
          shareIndex={index}
          currentDeviceShare={currentDeviceShare}
          renderThresholdPanels={this.renderThresholdPanels}
        />
      );
    });

    return el;
  }

  render() {
    const { warning, random } = this.props;
    const {
      passwordShare,
      currentThreshold,
      allDeviceShares,
      currentDeviceShare
    } = this.state;
    // console.log(currentThreshold);

    return (
      <div className="settings-page__body">
        {currentThreshold ? (
          <div className="tkey-tab__share">
            <p className="tkey-tab__subheading">
              Authentication threshold - {currentThreshold}
            </p>
          </div>
        ) : (
          <div className="spinner-container">
            <Spinner color="#0364FF" />
          </div>
        )}

        {this.state.torusPanel === null ? (
          void (0)
        ) : (
          <div>{this.state.torusPanel}</div>
        )}

        {allDeviceShares !== null ? this.renderDeviceList() : void 0}

        {passwordShare !== null ? (
          <PasswordForm
            random={random}
            passwordShare={passwordShare}
            renderThresholdPanels={this.renderThresholdPanels}
          />
        ) : (
          void 0
        )}

        {/* { this.renderSeedWords() }
        { this.renderIncomingTransactionsOptIn() }
        { this.renderPhishingDetectionToggle() }
        { this.renderMetaMetricsOptIn() } */}
      </div>
    );
  }
}

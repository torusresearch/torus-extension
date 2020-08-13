import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ToggleButton from "../../../components/ui/toggle-button";
import { REVEAL_SEED_ROUTE } from "../../../helpers/constants/routes";
import Button from "../../../components/ui/button";
import TextField from "../../../components/ui/text-field";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import clone from 'clone'

import {
  // INITIALIZE_SELECT_ACTION_ROUTE,
  TKEY_ROUTE
} from "../../../helpers/constants/routes";
import PasswordForm from './password-form'

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
      random: Math.random()
    };
  }

  renderThresholdPanels = () => {
    const { getTkeyDataForSettingsPage } = this.props;

    getTkeyDataForSettingsPage().then(el => {
      console.log(el);
      let serviceProvider = el.serviceProvider;
      let deviceShare = el.deviceShare;
      // let passwordShare = el.passwordShare;
      this.setState({
        passwordShare: clone(el.passwordShare),
        random: Math.random()
      })
      // this.renderPasswordPanel(el.passwordShare);

      this.setState({
        torusPanel: (
          <div className="tkey-tab__share">
            <p className="tkey-tab__subheading">Torus Network</p>
            <div className="tkey-tab__subshare">
              <p>{serviceProvider.verifierId}</p>
              <DeleteOutlinedIcon />
            </div>
            <Button type="secondary" className="tkey-tab__addshareButton">
              Add share
            </Button>
          </div>
        )
      });

      if (deviceShare.available) {
        this.setState({
          deviceSharePanel: (
            <div className="tkey-tab__share">
              <p className="tkey-tab__subheading">Device - Chrome extension</p>
              <div className="tkey-tab__subshare">
                <p>{deviceShare.userAgent.substr(0, 50)}</p>
                <DeleteOutlinedIcon />
              </div>
              <Button type="secondary" className="tkey-tab__addshareButton">
                Add new browser
              </Button>
            </div>
          )
        });
      } else {
        this.setState({
          deviceSharePanel: (
            <div className="tkey-tab__share">
              <p className="tkey-tab__subheading">Device - Chrome extension</p>
              <div className="tkey-tab__subshare">
                <p>No available share</p>
              </div>
              <Button type="secondary" className="tkey-tab__addshareButton">
                Add device share
              </Button>
            </div>
          )
        });
      }
    });
  }

  handlePasswordChange(el) {
    this.setState(state => {
      const { accountPassword, } = state;
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
    console.log(accountPassword);

    if (accountPasswordError == "") {
      await addPasswordShare(accountPassword);
      this.renderThresholdPanels(); // reload panel
    } else {
      // Show error
    }
  }

  render() {
    const { warning, random } = this.props;
    const { passwordShare } = this.state
    console.log(passwordShare)

    return (
      <div className="settings-page__body">

        {this.state.torusPanel === null ? (
          <div>Loading</div>
        ) : (
          <div>{this.state.torusPanel}</div>
          )}
        
        {this.state.deviceSharePanel === null ? (
          <div>Loading</div>
        ) : (
          <div>{this.state.deviceSharePanel}</div>
        )}
        
        {passwordShare !== null ? <PasswordForm random={random} passwordShare={passwordShare} renderThresholdPanels={this.renderThresholdPanels}/> : void (0)}

        {/* { this.renderSeedWords() }
        { this.renderIncomingTransactionsOptIn() }
        { this.renderPhishingDetectionToggle() }
        { this.renderMetaMetricsOptIn() } */}
      </div>
    );
  }
}
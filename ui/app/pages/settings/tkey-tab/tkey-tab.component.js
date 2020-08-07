import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ToggleButton from "../../../components/ui/toggle-button";
import { REVEAL_SEED_ROUTE } from "../../../helpers/constants/routes";
import Button from "../../../components/ui/button";
import TextField from "../../../components/ui/text-field";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import {
  // INITIALIZE_SELECT_ACTION_ROUTE,
  TKEY_ROUTE
} from "../../../helpers/constants/routes";

export default class tkeyTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func
  };

  static propTypes = {
    warning: PropTypes.string,
    history: PropTypes.object,
    // participateInMetaMetrics: PropTypes.bool.isRequired,
    // setParticipateInMetaMetrics: PropTypes.func.isRequired,
    // showIncomingTransactions: PropTypes.bool.isRequired,
    // setShowIncomingTransactionsFeatureFlag: PropTypes.func.isRequired,
    // setUsePhishDetect: PropTypes.func.isRequired,
    // usePhishDetect: PropTypes.bool.isRequired,
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
      accountPasswordError: ""
    };
  }

  renderPasswordPanel(passwordShare) {
    if (passwordShare.available) {
      this.setState({
        passwordPanel: (
          <div className="tkey-tab__share">
            <p className="tkey-tab__subheading">Account Password</p>
            <div className="tkey-tab__subshare">
              <p>*******</p>
              <DeleteOutlinedIcon />
            </div>
            <Button
              type="secondary"
              className="tkey-tab__addshareButton"
              onClick={() => this.changePassword()}
            >
              Change password
            </Button>
          </div>
        )
      });
    } else {
      this.setState({
        passwordPanel: (
          <div className="tkey-tab__share">
            <p className="tkey-tab__subheading">Account Password</p>
            <div className="tkey-tab__subshare">
                <input
                  type="text"
                  value={this.state.password}
                  onChange={event =>
                    this.handlePasswordChange(event.target.value)
                  }
                  id="password"
                />
            </div>
            <Button
              type="secondary"
              className="tkey-tab__addshareButton"
              onClick={() => this.addAccountPassword()}
            >
              Add Password
            </Button>
          </div>
        )
      });
    }
  }

  renderThresholdPanels() {
    const { getTkeyDataForSettingsPage } = this.props;

    getTkeyDataForSettingsPage().then(el => {
      console.log(el);
      let serviceProvider = el.serviceProvider;
      let deviceShare = el.deviceShare;
      // let passwordShare = el.passwordShare;

      this.renderPasswordPanel(el.passwordShare);

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
    });
  }

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
    debugger;

    const { accountPassword, accountPasswordError } = this.state;
    const { history, addPasswordShare } = this.props;
    console.log(accountPassword);

    if (accountPasswordError == "") {
      await addPasswordShare(password);
      this.renderThresholdPanels() // reload panel
    } else {
      // Show error
    }
  }

  // Maybe create a new page for password to separate concerns
  handlePasswordChange() {
    
  }

  render() {
    const { warning } = this.props;

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
        {this.state.passwordPanel === null ? (
          <div>Loading</div>
        ) : (
          <div>{this.state.passwordPanel}</div>
        )}

        {/* { this.renderSeedWords() }
        { this.renderIncomingTransactionsOptIn() }
        { this.renderPhishingDetectionToggle() }
        { this.renderMetaMetricsOptIn() } */}
      </div>
    );
  }
}

// renderSeedWords () {
//   const { t } = this.context
//   const { history } = this.props

//   return (
//     <div className="tkeys-page__content-row">
//       <div className="settings-page__content-item">
//         <span>{ t('revealSeedWords') }</span>
//       </div>
//       <div className="settings-page__content-item">
//         <div className="settings-page__content-item-col">
//           <Button
//             type="danger"
//             large
//             onClick={(event) => {
//               event.preventDefault()
//               this.context.metricsEvent({
//                 eventOpts: {
//                   category: 'Settings',
//                   action: 'Reveal Seed Phrase',
//                   name: 'Reveal Seed Phrase',
//                 },
//               })
//               history.push(REVEAL_SEED_ROUTE)
//             }}
//           >
//             { t('revealSeedWords') }
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// renderMetaMetricsOptIn () {
//   const { t } = this.context
//   const { participateInMetaMetrics, setParticipateInMetaMetrics } = this.props

//   return (
//     <div className="settings-page__content-row">
//       <div className="settings-page__content-item">
//         <span>{ t('participateInMetaMetrics') }</span>
//         <div className="settings-page__content-description">
//           <span>{ t('participateInMetaMetricsDescription') }</span>
//         </div>
//       </div>
//       <div className="settings-page__content-item">
//         <div className="settings-page__content-item-col">
//           <ToggleButton
//             value={participateInMetaMetrics}
//             onToggle={(value) => setParticipateInMetaMetrics(!value)}
//             offLabel={t('off')}
//             onLabel={t('on')}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// renderIncomingTransactionsOptIn () {
//   const { t } = this.context
//   const { showIncomingTransactions, setShowIncomingTransactionsFeatureFlag } = this.props

//   return (
//     <div className="settings-page__content-row">
//       <div className="settings-page__content-item">
//         <span>{ t('showIncomingTransactions') }</span>
//         <div className="settings-page__content-description">
//           { t('showIncomingTransactionsDescription') }
//         </div>
//       </div>
//       <div className="settings-page__content-item">
//         <div className="settings-page__content-item-col">
//           <ToggleButton
//             value={showIncomingTransactions}
//             onToggle={(value) => setShowIncomingTransactionsFeatureFlag(!value)}
//             offLabel={t('off')}
//             onLabel={t('on')}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// renderPhishingDetectionToggle () {
//   const { t } = this.context
//   const { usePhishDetect, setUsePhishDetect } = this.props

//   return (
//     <div className="settings-page__content-row">
//       <div className="settings-page__content-item">
//         <span>{ t('usePhishingDetection') }</span>
//         <div className="settings-page__content-description">
//           { t('usePhishingDetectionDescription') }
//         </div>
//       </div>
//       <div className="settings-page__content-item">
//         <div className="settings-page__content-item-col">
//           <ToggleButton
//             value={usePhishDetect}
//             onToggle={(value) => setUsePhishDetect(!value)}
//             offLabel={t('off')}
//             onLabel={t('on')}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

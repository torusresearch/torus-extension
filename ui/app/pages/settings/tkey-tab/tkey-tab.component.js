import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ToggleButton from "../../../components/ui/toggle-button";
import { REVEAL_SEED_ROUTE } from "../../../helpers/constants/routes";
import Button from "../../../components/ui/button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
    getTkeyState2: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.renderThresholdPanels()  
  }


  constructor(props) {
    super(props);
    this.state = {
      torusPanel: null,
      deviceSharePanel: null,
      passwordPanel: null
    }
  }

  renderThresholdPanels() {
    const { getTkeyState2, getTkeyState } = this.props
    let el = getTkeyState().then(el => {
      console.log(el)
      let isTorusServiceProviderLoggedIn = el.serviceProvider.postboxKey !== "0"
      let isOnDeviceShare = Object.keys(el.metadata.shareDescriptions).length != 0
      
      this.setState({
        torusPanel: (
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary>
                <Typography className="tkey-tab__heading">
                    Torus Login
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  {isTorusServiceProviderLoggedIn ? "torus login completed" : "torus login not completed"}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary>
                <Typography className="tkey-tab__heading">
                  On device share
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                    {isOnDeviceShare ? "Chrome storage share available": "chrome storage share unavailable"}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        )
      });
    })
  }

  render() {
    const { warning } = this.props;

    return (
      <div className="settings-page__body">        
        {this.state.torusPanel === null ? 
                <div>Loading</div>
            :
                <div>{this.state.torusPanel}</div>
        }
        {this.state.deviceSharePanel === null ? 
                <div>Loading</div>
            :
                <div>{this.state.deviceSharePanel}</div>
        }
        {this.state.passwordPanel === null ? 
                <div>Loading</div>
            :
                <div>{this.state.passwordPanel}</div>
            }

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
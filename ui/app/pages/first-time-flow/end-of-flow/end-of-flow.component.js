import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import Snackbar from "../../../components/ui/snackbar";
import MetaFoxLogo from "../../../components/ui/metafox-logo";
import { DEFAULT_ROUTE, TKEY_ROUTE, TRP_SHARE_TRANSFER } from "../../../helpers/constants/routes";
import { returnToOnboardingInitiator } from "../onboarding-initiator-util";

export default class EndOfFlowScreen extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func
  };

  static propTypes = {
    history: PropTypes.object,
    completeOnboarding: PropTypes.func,
    lookForNewRequests: PropTypes.func,
    completionMetaMetricsName: PropTypes.string,
    onboardingInitiator: PropTypes.exact({
      location: PropTypes.string,
      tabId: PropTypes.number
    })
  };

  onComplete = async () => {
    const {
      history,
      completeOnboarding,
      completionMetaMetricsName,
      onboardingInitiator,
      lookForNewRequests
    } = this.props;

    await completeOnboarding()
    // this.context.metricsEvent({
    //   eventOpts: {
    //     category: 'Onboarding',
    //     action: 'Onboarding Complete',
    //     name: completionMetaMetricsName,
    //   },
    // })

    // console.log("looking for new requests")
    // lookForNewRequests().then(res => {
    //   console.log("response in from lookfornewrequests", res)
    //   history.push(TRP_SHARE_TRANSFER, {res})
    // })

    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator)
    }
    history.push(DEFAULT_ROUTE);
  };

  gotoSettingsPage = async () => {
    const {
      history,
      completeOnboarding,
      completionMetaMetricsName,
      onboardingInitiator
    } = this.props;

    await completeOnboarding()
    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator)
    }
    
    history.push(TKEY_ROUTE)
  }

  render() {
    const { t } = this.context;
    const { onboardingInitiator } = this.props;

    return (
      <div className="main-container">
        <div className="end-of-flow">
          <MetaFoxLogo />
          <div className="first-time-flow__question">Welcome to Torus</div>
          <div className="first-time-flow__text-block end-of-flow__text-1">
            Torus connects you with any Ethereum application in one-click on
            your browser.
          </div>

          <div className="first-time-flow__question">What’s new?</div>
          <div className="first-time-flow__text-block end-of-flow__text-1">
            Your Torus extension starts with two wallets - a Google wallet
            and a 2FA Wallet. Your 2FA wallet utilizes tKey, a new form of key
            mangagement.
          </div>

          <div className="first-time-flow__question">2FA Wallet setup</div>
          <div className="first-time-flow__text-block end-of-flow__text-1">
            <a style={{color:"#0363ff"}} onClick={this.gotoSettingsPage}>Add a password</a> to your 2FA wallet in 'Settings' page for account recovery
          </div>

          <div className="first-time-flow__onboarding">
            <div className="first-time-flow__onboarding-image">
              <img src="images/torus-onboarding.png" />
            </div>
            <div>
              <ul className="first-time-flow__onboarding-feats">
                <li>
                  <img src="images/ob-self-custodial.png" />
                  <span>Self custodial</span>
                </li>
                <li>
                  <img src="images/ob-access.png" />
                  <span>Access with or without Google</span>
                </li>
                <li>
                  <img src="images/ob-secure.png" />
                  <span>Progressively secure your assets and never lose your key</span>
                </li>
              </ul>
              <a className="first-time-flow__onboarding-more" href="https://docs.tor.us" target="_blank">
                Learn more &gt;
              </a>
            </div>
          </div>

          
          {/* <div className="first-time-flow__text-block end-of-flow__text-2">
            { t('endOfFlowMessage2') }
          </div>
          <div className="end-of-flow__text-3">
            { '• ' + t('endOfFlowMessage3') }
          </div>
          <div className="end-of-flow__text-3">
            { '• ' + t('endOfFlowMessage4') }
          </div>
          <div className="end-of-flow__text-3">
            { '• ' + t('endOfFlowMessage5') }
          </div>
          <div className="end-of-flow__text-3">
            { '• ' + t('endOfFlowMessage6') }
          </div>
          <div className="end-of-flow__text-3">
            { '• ' + t('endOfFlowMessage7') }
          </div>
          <div className="first-time-flow__text-block end-of-flow__text-4">
            { '*' + t('endOfFlowMessage8') }&nbsp;
            <a
              href="https://metamask.zendesk.com/hc/en-us/articles/360015489591-Basic-Safety-Tips"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="first-time-flow__link-text">
                {t('endOfFlowMessage9')}
              </span>
            </a>
          </div> */}
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.onComplete}
          >
            Go to Wallet Home
          </Button>
          {onboardingInitiator ? (
            <Snackbar
              content={t("onboardingReturnNotice", [
                t("endOfFlowMessage10"),
                onboardingInitiator.location
              ])}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

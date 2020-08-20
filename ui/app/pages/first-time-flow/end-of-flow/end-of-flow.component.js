import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import Snackbar from "../../../components/ui/snackbar";
import MetaFoxLogo from "../../../components/ui/metafox-logo";
import { DEFAULT_ROUTE } from "../../../helpers/constants/routes";
import { returnToOnboardingInitiator } from "../onboarding-initiator-util";

export default class EndOfFlowScreen extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func
  };

  static propTypes = {
    history: PropTypes.object,
    completeOnboarding: PropTypes.func,
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
      onboardingInitiator
    } = this.props;

    await completeOnboarding()
    // this.context.metricsEvent({
    //   eventOpts: {
    //     category: 'Onboarding',
    //     action: 'Onboarding Complete',
    //     name: completionMetaMetricsName,
    //   },
    // })

    if (onboardingInitiator) {
      await returnToOnboardingInitiator(onboardingInitiator)
    }
    history.push(DEFAULT_ROUTE);
  };

  render() {
    const { t } = this.context;
    const { onboardingInitiator } = this.props;

    return (
      <div className="end-of-flow">
        <MetaFoxLogo />
        <div className="first-time-flow__question">Welcome to Torus-mask</div>
        <div className="first-time-flow__text-block end-of-flow__text-1">
          Torus-mask connects you with any Ethereum application in one-click on
          your browser.
        </div>

        <div className="first-time-flow__question">What’s new?</div>
        <div className="first-time-flow__text-block end-of-flow__text-1">
          Your Torus-mask extension starts with two wallets - a Google wallet
          and a 2FA Wallet. Your 2FA wallet utilizes tKey, a new form of key
          mangagement with the features of:
        </div>
        <div className="first-time-flow__onboarding">
          <a href="docs.tor.us" target="_blank">
            <img className="" src="images/torus-onboarding.png" />
          </a>
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
          Go to wallet home
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
    );
  }
}

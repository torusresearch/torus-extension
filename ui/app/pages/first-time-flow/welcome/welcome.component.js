import EventEmitter from "events";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Mascot from "../../../components/ui/mascot";
import Button from "../../../components/ui/button";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ThresholdBak from "threshold-bak";

import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  DEFAULT_ROUTE
} from "../../../helpers/constants/routes";

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
    createNewTorusVaultAndRestore: PropTypes.func
  };

  static contextTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.animationEventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props;

    // history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    }
  }

  handleContinue = async () => {
    const {history, createNewTorusVaultAndRestore } = this.props

    try {
      const TorusOptions = {
        GOOGLE_CLIENT_ID:
          "238941746713-qqe4a7rduuk256d8oi5l0q34qtu9gpfg.apps.googleusercontent.com",
        baseUrl: "http://localhost:3000/serviceworker"
        // baseUrl: 'https://toruscallback.ont.io/serviceworker',
      };

      const tb = new ThresholdBak({
        directParams: {
          baseUrl: TorusOptions.baseUrl,
          redirectToOpener: true,
          network: "ropsten",
          proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183" // details for test net,
        }
      });

      await tb.serviceProvider.directWeb.init({ skipSw: true });

      // Login via torus service provider to get back 1 share
      const postBox = await tb.serviceProvider.triggerAggregateLogin({
        aggregateVerifierType: "single_id_verifier",
        subVerifierDetailsArray: [
          {
            clientId: TorusOptions.GOOGLE_CLIENT_ID,
            typeOfLogin: "google",
            verifier: "google-shubs"
          }
        ],
        verifierIdentifier: "multigoogle-torus"
      });
      console.log(postBox);

      // get metadata from the metadata-store
      // let keyDetails = await tb.initialize();
      let keyDetails = await tb.initializeNewKey()
      console.log(keyDetails);

      await new Promise(function(resolve, reject) {
        if (keyDetails.requiredShares > 0) {
          chrome.storage.sync.get(["OnDeviceShare"], async result => {
            tb.inputShare(JSON.parse(result.OnDeviceShare));
            resolve();
          });
        } else {
          chrome.storage.sync.set(
            { OnDeviceShare: JSON.stringify(tb.outputShare(2)) },
            function() {
              resolve();
            }
          );
        }
      });

      const keyring = await createNewTorusVaultAndRestore(
        "",
        tb.reconstructKey().toString("hex")
      );
      history.push(INITIALIZE_END_OF_FLOW_ROUTE);

      // await onSubmit(password, this.parseSeedPhrase(seedPhrase))
      // this.context.metricsEvent({
      //   eventOpts: {
      //     category: 'Onboarding',
      //     action: 'Import Seed Phrase',
      //     name: 'Import Complete',
      //   },
      // })

      // setSeedPhraseBackedUp(true).then(() => {
      //   initializeThreeBox()
      //   history.push(INITIALIZE_END_OF_FLOW_ROUTE)
      // })
    } catch (error) {
      console.error(error);
      this.setState({ seedPhraseError: error.message });
    }
  };

  render() {
    const { t } = this.context;
    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
          {/* <Mascot
            animationEventEmitter={this.animationEventEmitter}
            width="125"
            height="125"
          /> */}
          {/* <Avatar
            alt="Adelle Charles"
            src="images/torus-icon-blue.png"
            width="100"
            height="100"
            margin="10px"
          /> */}

          <img
            src="images/torus-icon-blue.png"
            width="100"
            height="100"
            margin="10px"
          />

          <div className="welcome-page__header">Welcome to Torus-mask</div>
          <div className="welcome-page__description">
            <div>{t("metamaskDescription")}</div>
            <div>{t("happyToSeeYou")}</div>
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            Continue with google
          </Button>
        </div>
      </div>
    );
  }
}

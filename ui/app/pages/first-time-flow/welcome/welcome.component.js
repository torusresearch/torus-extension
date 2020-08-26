import EventEmitter from "events";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Mascot from "../../../components/ui/mascot";
import Button from "../../../components/ui/button";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  INITIALIZE_IMPORT_WITH_TORUS_ROUTE,
  TORUS_RESTORE_PASSWORD_ROUTE,
  DEFAULT_ROUTE
} from "../../../helpers/constants/routes";
import { getUserDetails } from "../../../store/actions";

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
    createNewTorusVaultAndRestore: PropTypes.func,
    importNewAccount: PropTypes.func,
    setUserDetails: PropTypes.func,
    googleLogin: PropTypes.func,
    getIdToken: PropTypes.func,
  };

  static contextTypes = {
    t: PropTypes.func
  };

  state = {
    loginErrorMessage: ''
  }

  constructor(props) {
    super(props);

    this.animationEventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const { history, participateInMetaMetrics, welcomeScreenSeen, getIdToken } = this.props;
    // history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE);
    }
  }

  handleContinue = async (newKeyAssign) => {
    const {
      history,
      googleLogin
    } = this.props;

    try {
      await googleLogin(newKeyAssign);
      history.push(INITIALIZE_END_OF_FLOW_ROUTE);
    } catch (err) {
      if (err === "Password required") {
        history.push(TORUS_RESTORE_PASSWORD_ROUTE)
      } else if (err === "new key assign required") {
        this.setState({loginErrorMessage: 'Unsuccessful login. Please contact us at hello@tor.us'})
      }
      console.error(err);
    }
  };

  render() {
    const { t } = this.context;
    const { loginErrorMessage } = this.state

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
            width="80"
            height="80"
            margin="10px"
          />

          <div className="welcome-page__header">Welcome to Torus</div>
          <div className="welcome-page__description">
            <div>Your digital wallet in one-click</div>
            {/* <div>{t("happyToSeeYou")}</div> */}
          </div>
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={() => this.handleContinue(false)}
          >
            Continue with Google
          </Button>
{/* 
          <Button
            type="primary"
            className="first-time-flow__button"
            onClick={() => this.handleContinue(true)}
          >
            Continue with Google (new key assign)
          </Button> */}

          <p className="welcome-page__loginErrorMessage">{loginErrorMessage}</p>
        </div>
      </div>
    );
  }
}

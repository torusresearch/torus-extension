import React, { Component } from "react";
import PropTypes from "prop-types";
import bowser from "bowser";
import Button from "../../../components/ui/button";
import {
  TRP_DEVICE_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  TRP_IMPORT_OR_PASSWORD
} from "../../../helpers/constants/routes";
import ComputerIcon from "@material-ui/icons/Computer";
import Grid from "@material-ui/core/Grid";


export default class NewLoginDetected extends Component {
  static defaultProps = {
    newAccountNumber: 0
  };

  state = {
    encPubKey: '',
    browserName: '',
    browserVersion: '',
  };
  componentWillMount() {
    const { location } = this.props;
    console.log('NewLoginDetected -> componentDidMount -> location', location)
    const { encPubKey, userAgent } = location.state.res;
    const browserInfo = bowser.parse(userAgent)
    this.setState({
      encPubKey: encPubKey,
      browserName: browserInfo.browser.name || '',
      browserVersion: browserInfo.browser.version || '',
    })
  }

  componentDidMount() {
    const { changeHeading } = this.props;
    changeHeading("New login detected");
  }

  continueToHomeScreen = () => {
    const { history } = this.props;
    history.push(INITIALIZE_END_OF_FLOW_ROUTE);
  };

  async confirm() {
    const { encPubKey } = this.state
    const { approveShareRequest } = this.props;
    if(encPubKey) {
      await approveShareRequest(encPubKey)
    }
    this.continueToHomeScreen()
  }

  async cancel() {
    // TODO: deny share request
  }

  render() {
    const {browserName, browserVersion} = this.state;
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          A new login is trying to access your 2FA wallet. Please confirm the
          reference ID to confirm your identity.
          {/* It seems like you are trying to login from a new device/browser. <br /> <br />
          Please enter the password associated with this account to continue. */}
        </div>

        <div className="new-account-create-form__device-info">
          <Grid container>
            <Grid item xs={2}>
              <ComputerIcon />
            </Grid>
            <Grid item xs={10}>
              <h4>
                {browserName}
              </h4>
              <p>V{browserVersion}</p>
            </Grid>
          </Grid>
        </div>
        {/* <div style={{width: '100%', textAlign: 'right'}}>
          <a
            href="mailto:hello@tor.us"
            target="_blank"
            rel="noopener noreferrer"
            style={{fontSize: '12px', lineHeight: '1.2em'}}
          >
            Report this is not me
          </a>
        </div> */}

        <div className="new-account-create-form__buttons">
          {/* <Button
            type="link"
            className="new-account-create-form__button new-account-create-form__button--cancel"
            onClick={this.cancel.bind(this)}
          >
            Cancel
          </Button> */}
          <a
            href="mailto:hello@tor.us"
            target="_blank"
            rel="noopener noreferrer"
            style={{fontSize: '12px', lineHeight: '1.2em'}}
          >
            <Button
              type="link"
              className="new-account-create-form__button new-account-create-form__button--cancel"
            >
              Report this is not me
            </Button>
          </a>
          <Button
            type="primary"
            className="new-account-create-form__button"
            // onClick={createClick}
            onClick={this.confirm.bind(this)}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }
}

NewLoginDetected.propTypes = {
  history: PropTypes.object,
  approveShareRequest: PropTypes.func
};

NewLoginDetected.contextTypes = {};

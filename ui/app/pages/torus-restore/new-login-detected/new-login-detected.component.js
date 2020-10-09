import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../components/ui/button";
import {
  TRP_DEVICE_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  TRP_IMPORT_OR_PASSWORD
} from "../../../helpers/constants/routes";
import Grid from "@material-ui/core/Grid";


export default class NewLoginDetected extends Component {
  static defaultProps = {
    newAccountNumber: 0
  };

  state = {};

  confirm() {
    this.continueToHomeScreen()
  }

  report() {}

  componentDidMount() {
    const { changeHeading, location } = this.props;
    console.log(changeHeading, location);
    changeHeading("New login detected");
  }

  continueToHomeScreen = () => {
    const { history } = this.props;
    history.push(INITIALIZE_END_OF_FLOW_ROUTE);
  };

  render() {
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
                {browser.os}
                <span> (Current new device)</span>
              </h4>
              <p>{browser.platform + ", " + browser.name}</p>
              <p>{browser.date}</p>
            </Grid>
          </Grid>
        </div>

        <div>
          <div className="new-account-create-form__buttons">
            <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={this.report}
            >
              Report this is not me
            </Button>
            <Button
              type="secondary"
              large
              className="new-account-create-form__button new-account-create-form__confirm-button"
              // onClick={createClick}
              onClick={this.confirm}
            >
              Confirm
            </Button>
          </div>
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

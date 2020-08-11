import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
import {
  TRP_DEVICE_ROUTE, INITIALIZE_END_OF_FLOW_ROUTE
} from '../../../helpers/constants/routes'

export default class RestorePasswordForm extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  }

  state = {
    accountPassword: '',
    accountPasswordError: '',
    defaultAccountName: 'Enter your password here',
  }

  componentDidMount(){
    const { changeHeading } = this.props
    changeHeading("Verify device")
  }

  verifyPassword = async () => {
    const { accountPassword, accountPasswordError } = this.state;
    const { history, inputPasswordShare } = this.props;
    console.log(accountPassword);

    if (accountPasswordError == "") {
      try {
        await inputPasswordShare(accountPassword);
        history.push(TRP_DEVICE_ROUTE)
      } catch (err) {
        console.error(err)
        this.setState({accountPasswordError: err.message})
      }
    } else {
      // Show error

    }
  }

  handlePasswordChange = (el) => {
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

  render () {
    const { accountPassword, defaultAccountName, accountPasswordError } = this.state
    const { history, createAccount, mostRecentOverviewPage } = this.props
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          You are accessing your 2FA Wallet from a new platform. Verify your identity with your password:
        </div>
        <div>
          <input
            className="new-account-create-form__input"
            value={accountPassword}
            placeholder={defaultAccountName}
            onChange={(event) => this.handlePasswordChange(event.target.value)}
          />
          <p className="new-account-create-form__error-message">{accountPasswordError}</p>
          <div className="new-account-create-form__buttons">
            <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={() => history.push(mostRecentOverviewPage)}
            >
              Verify using another method
            </Button>
            <Button
              type="secondary"
              large
              className="new-account-create-form__button new-account-create-form__confirm-button"
              // onClick={createClick}
              onClick={this.verifyPassword}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

RestorePasswordForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string,
  inputPasswordShare: PropTypes.func
}

RestorePasswordForm.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}

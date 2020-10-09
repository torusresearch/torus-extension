import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
import {
  TRP_DEVICE_ROUTE, INITIALIZE_END_OF_FLOW_ROUTE, TRP_IMPORT_OR_PASSWORD
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
    changeHeading("Verification method")
  }

  verifyPassword = async () => {
    const { accountPassword, accountPasswordError } = this.state;
    const { history, inputPasswordShare } = this.props;

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

  passwordValidator(v) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\dA-Za-z]).\S{10,}$/.test(v)
  }

  handlePasswordChange = (el) => {
    this.setState(state => {
      const { accountPassword } = state;
      let accountPasswordError = "";

      // Add check for password if minimum 10 digits
      if (this.passwordValidator(el)) {
        accountPasswordError = "Must contain at least 10 characters. At least one uppercase letter, one lowercase letter, one number and one special character";
      }

      return {
        accountPassword: el,
        accountPasswordError: accountPasswordError
      };
    });
  }

  otherMethods = () => {
    const { history } = this.props
    history.push(TRP_IMPORT_OR_PASSWORD)
  }

  render () {
    const { accountPassword, defaultAccountName, accountPasswordError } = this.state
    const { history, createAccount, mostRecentOverviewPage } = this.props
    return (
      <div className="new-account-create-form">
        <div className="new-account-create-form__input-label">
          You require 1 verification to access your 2FA wallet. Verify your identity with any of the following.
          {/* It seems like you are trying to login from a new device/browser. <br /> <br />
          Please enter the password associated with this account to continue. */}
        </div>
        <div>
          <input
            type="password"
            className="new-account-create-form__input"
            value={accountPassword}
            placeholder={defaultAccountName}
            onChange={(event) => this.handlePasswordChange(event.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode == 13) this.verifyPassword()
            }}
          />
          <p className="new-account-create-form__error-message">{accountPasswordError}</p>
          <div className="new-account-create-form__buttons">
            <Button
              type="default"
              large
              className="new-account-create-form__button new-account-create-form__cancel-button"
              onClick={this.otherMethods}
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

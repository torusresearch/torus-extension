import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../components/ui/button'
import TextField from '../../../components/ui/text-field'
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
    changeHeading("Verification required")
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
      if (!this.passwordValidator(el)) {
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
        <div className="new-account-create-form__input-image">
          <img src="images/tkey-input-password.png" />
        </div>
        <div className="new-account-create-form__input-label">
        You are accessing your 2FA Wallet from a new platform. <span style={{fontWeight: 'bold'}}>Verify your identity</span> with your password:
        </div>
        <div className="new-account-create-form__input-fields">
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
        </div>
        <div className="new-account-create-form__buttons">
          <Button
            type="link"
            className="new-account-create-form__button new-account-create-form__button--cancel"
            onClick={this.otherMethods}
          >
            Verify using another method
          </Button>
          <Button
            type="primary"
            className="new-account-create-form__button"
            onClick={this.verifyPassword}
            disabled={accountPasswordError !== '' || accountPassword === ''}
          >
            Confirm
          </Button>
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

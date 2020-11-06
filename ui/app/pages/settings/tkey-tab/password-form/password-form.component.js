import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import validUrl from "valid-url";
import TextField from "../../../../components/ui/text-field";
import Button from "../../../../components/ui/button";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default class PasswordForm extends PureComponent {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    metricsEvent: PropTypes.func.isRequired
  };

  static propTypes = {
    passwordShare: PropTypes.object,
    addPasswordShare: PropTypes.func,
    changePasswordShare: PropTypes.func,
    renderThresholdPanels: PropTypes.func
  };

  constructor(props) {
    super(props);
    // console.log(props)
    let { passwordShare } = props;
    // console.log(passwordShare.available);

    this.state = {
      passwordPanel: null,
      accountPassword: "",
      accountPassword2: "",
      accountPasswordError: "",
      showPassword1: false,
      showPassword2: false,
      passwordBlockType: passwordShare.available ? "hidden" : "input",
      buttonText: passwordShare.available ? "Change password" : "Add password"
    };
  }

  passwordValidator(v) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(v)
  }

  onPasswordChange(el) {
    this.setState(state => {
      const { accountPassword } = state;
      let accountPasswordError = "";

      // Add check for password if minimum 10 digits
      if (!this.passwordValidator(el)) {
        // accountPasswordError = "Must contain at least 10 characters. At least one uppercase letter, one lowercase letter, one number and one special character";
        accountPasswordError = "Must contain at least 10 characters. At least one uppercase letter, one lowercase letter, one number";
      }

      return {
        accountPassword: el,
        accountPasswordError: accountPasswordError
      };
    });
  }

  onPasswordChange2(field, value) {
    this.setState(state => {
      let { accountPassword, accountPassword2 } = state;
      let accountPasswordError = "";

      field === 1 ? accountPassword = value : field === 2 ? accountPassword2 = value : void 0

      if (!this.passwordValidator(value)) {
        // accountPasswordError = "Must contain at least 10 characters. At least one uppercase letter, one lowercase letter, one number and one special character";
        accountPasswordError = "Must contain at least 10 characters. At least one uppercase letter, one lowercase letter, one number";
      } else if (accountPassword !== accountPassword2) {
        accountPasswordError = "Both passwords should be same";
      }
      
      if (field === 1) {
        return {
          accountPassword: accountPassword,
          accountPasswordError: accountPasswordError
        };
      } else if(field === 2) {
        return {
          accountPassword2: accountPassword2,
          accountPasswordError: accountPasswordError
        };
      }
    });
  }

  async addAccountPassword() {
    const { accountPassword, accountPasswordError, buttonText } = this.state;
    const {
      history,
      addPasswordShare,
      changePasswordShare,
      renderThresholdPanels
    } = this.props;
    // console.log(accountPassword);

    if (accountPasswordError === "") {
      // console.log(buttonText);
      try {
        buttonText === "Add new password"
          ? await changePasswordShare(accountPassword)
          : await addPasswordShare(accountPassword);
        // this.forceUpdate()
        this.setState({
          passwordBlockType: "hidden",
          buttonText: "Change password",
          accountPassword: "",
          accountPassword2: "",
          showPassword1: false,
          showPassword2 : false
        });
        renderThresholdPanels();
      } catch (err) {
        console.error(err)
      }
      // this.renderThresholdPanels(); // reload panel
    } else {
      // Show error
    }
  }

  changePassword() {
    this.setState({
      passwordBlockType: "change",
      buttonText: "Add new password"
    });
    // this.renderPasswordBlock()
  }


  handleClickShowPassword = (field, el) => {
    if (field === 1) {
      this.setState({ showPassword1: el });
    } else if (field === 2) {
      this.setState({ showPassword2: el });
    }
  };

  renderButton() {
    let { passwordBlockType, buttonText } = this.state;
    // console.log("renderButton", passwordBlockType);
    if (passwordBlockType === "hidden") {
      return (
        <Button
          type="secondary"
          className="tkey-tab__addshareButton"
          onClick={() => this.changePassword()}
        >
          {buttonText}
        </Button>
      );
    } else {
      return (
        <Button
          type="secondary"
          className="tkey-tab__addshareButton"
          onClick={() => this.addAccountPassword()}
        >
          {buttonText}
        </Button>
      );
    }
  }

  renderPasswordBlock() {
    let { passwordBlockType, accountPassword, accountPassword2 } = this.state;
    // console.log("renderPasswordBlock", passwordBlockType);
    if (passwordBlockType === "hidden") {
      return (
        <div className="tkey-tab__borderWrapper">
          <div className="tkey-tab__subshare">
            <p>*******</p>
            {/* <DeleteOutlinedIcon /> */}
          </div>
        </div>
      );
    } else if (passwordBlockType === "change") {
      return (
        <div className="tkey-tab__borderWrapper">
          <div className="tkey-tab__subshare">
            <input
              value={this.state.accountPassword}
              type={this.state.showPassword1 ? "text" : "password"}
              placeholder="Enter your password"
              onChange={event => this.onPasswordChange2(1, event.target.value)}
              id="password1"
            />
            {!this.state.showPassword1 ? (
              <Visibility
                onClick={() => this.handleClickShowPassword(1, true)}
              />
            ) : (
              <VisibilityOff
                onClick={() => this.handleClickShowPassword(1, false)}
              />
            )}
          </div>
          <div className="tkey-tab__subshare">
            <input
              value={this.state.accountPassword2}
              type={this.state.showPassword2 ? "text" : "password"}
              placeholder="Confirm password"
              onChange={event => this.onPasswordChange2(2, event.target.value)}
              // onKeyDown={() => this.addAccountPassword()}
              id="password2"
            />
            {!this.state.showPassword2 ? (
              <Visibility
                onClick={() => this.handleClickShowPassword(2, true)}
              />
            ) : (
              <VisibilityOff
                onClick={() => this.handleClickShowPassword(2, false)}
              />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="tkey-tab__borderWrapper">
          <div className="tkey-tab__subshare">
            <input
              type="password"
              value={this.state.accountPassword}
              placeholder="Enter your password"
              onChange={event => this.onPasswordChange(event.target.value)}
              // onKeyDown={() => this.addAccountPassword()}
              id="password"
            />
          </div>
        </div>
      );
    }
  }

  render() {
    let { passwordShare } = this.props;
    let { accountPasswordError, passwordBlockType } = this.state;
    return (
      <div>
        <div className="tkey-tab__share">
          <p className="tkey-tab__subheading">Account Password</p>
          {this.renderPasswordBlock()}
          <p className="tkey-tab__error-message">{accountPasswordError}</p>
          <div className="tkey-tab__buttons-container">
            <div style={{marginLeft: 'auto'}}>{this.renderButton()}</div>            
          </div> 
        </div>
      </div>
    );
  }
}

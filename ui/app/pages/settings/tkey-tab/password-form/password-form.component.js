import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import validUrl from "valid-url";
import TextField from "../../../../components/ui/text-field";
import Button from "../../../../components/ui/button";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

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
      accountPasswordError: "error",
      passwordBlockType: passwordShare.available ? "hidden" : "input",
      buttonText: passwordShare.available ? "Change password" : "Add password"
    };
  }

  onPasswordChange(el) {
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
          buttonText: "Change password"
        });
        renderThresholdPanels()
      } catch (err) {
        debugger;
      }
      // this.renderThresholdPanels(); // reload panel
    } else {
      // Show error
    }
  }

  changePassword() {
    this.setState({
      passwordBlockType: "input",
      buttonText: "Add new password"
    });
    // this.renderPasswordBlock()
  }

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

  // drop down -> 3 options
  // device1 , device2, new device
  // 1 and 2 copy
  // 3 -> generate New share

  renderPasswordBlock() {
    let { passwordBlockType } = this.state;
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
    } else {
      return (
        <div className="tkey-tab__borderWrapper">
          <div className="tkey-tab__subshare">
            <input
              type="text"
              value={this.state.password}
              placeholder="Enter your password"
              onChange={event => this.onPasswordChange(event.target.value)}
              id="password"
            />
          </div>
        </div>
      );
    }
  }

  render() {
    let { passwordShare } = this.props;

    return (
      <div>
        <div className="tkey-tab__share">
          <p className="tkey-tab__subheading">Account Password</p>
          {this.renderPasswordBlock()}
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

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
    addPasswordShare: PropTypes.func
  };

  constructor(props) {
    super(props);
    // console.log(props)
    let { passwordShare } = props
    console.log(passwordShare.available)

    this.state = {
      passwordPanel: null,
      accountPassword: "",
      accountPasswordError: "",
      passwordBlockType: passwordShare.available ? "hidden" : "input"
    };
  }

  handlePasswordChange(el) {
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
    const { accountPassword, accountPasswordError } = this.state;
    const { history, addPasswordShare } = this.props;
    console.log(accountPassword);

    if (accountPasswordError == "") {
      await addPasswordShare(accountPassword);
      this.renderThresholdPanels(); // reload panel
    } else {
      // Show error
    }
  }

  changePassword() {
    this.setState({
      passwordBlockType: "input"
    })
    this.renderPasswordBlock()
  }

  renderButton() {
    let { passwordBlockType } = this.state
    console.log("renderButton", passwordBlockType)
    if (passwordBlockType === "hidden") {
      return (
        <Button
          type="secondary"
          className="tkey-tab__addshareButton"
          onClick={() => this.changePassword()}
        >
          Change password
        </Button>
      );
    } else {
      return (
        <Button
          type="secondary"
          className="tkey-tab__addshareButton"
          onClick={() => this.addAccountPassword()}
        >
          Add Password
        </Button>
      );
    }
  }

  renderPasswordBlock() {
    let { passwordBlockType } = this.state
    console.log("renderPasswordBlock", passwordBlockType)
    if (passwordBlockType === "hidden") {
      return (
        <div className="tkey-tab__subshare">
          <p>*******</p>
          <DeleteOutlinedIcon />
        </div>
      );
    } else {
      return (
        <div className="tkey-tab__subshare">
          <input
            type="text"
            value={this.state.password}
            onChange={event => this.handlePasswordChange(event.target.value)}
            id="password"
          />
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

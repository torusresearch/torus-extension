import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class InfoTab extends PureComponent {
  state = {
    version: global.platform.getVersion()
  };

  static contextTypes = {
    t: PropTypes.func
  };

  renderInfoLinks() {
    const { t } = this.context;

    return (
      <div className="settings-page__content-item settings-page__content-item--without-height">
        <div className="info-tab__link-header">{t("links")}</div>
        <div className="info-tab__link-item">
          <a
            href="https://docs.tor.us/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="info-tab__link-text">{t("privacyMsg")}</span>
          </a>
        </div>
        <div className="info-tab__link-item">
          <a
            href="https://docs.tor.us/legal/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="info-tab__link-text">{t("terms")}</span>
          </a>
        </div>
        {/* <div className="info-tab__link-item">
          <a
            href="https://metamask.io/attributions.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="info-tab__link-text">
              { t('attributions') }
            </span>
          </a>
        </div> */}
        <hr className="info-tab__separator" />
        <div className="info-tab__link-item">
          <a
            href="https://t.me/TorusLabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="info-tab__link-text">
              {/* { t('supportCenter') } */}
              Telegram support
            </span>
          </a>
        </div>
        <div className="info-tab__link-item">
          <a href="https://tor.us" target="_blank" rel="noopener noreferrer">
            <span className="info-tab__link-text">{t("visitWebSite")}</span>
          </a>
        </div>
        <div className="info-tab__link-item">
          <a
            href="mailto:hello@tor.us?subject=Feedback"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="info-tab__link-text">{t("emailUs")}</span>
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.context;

    return (
      <div className="settings-page__body">
        <div className="settings-page__content-row">
          <div className="settings-page__content-item settings-page__content-item--without-height">
            <div className="info-tab__logo-wrapper">
              <img
                src="images/torus-icon-blue.png"
                width="100"
                height="100"
                margin="10px"
              />
            </div>
            <div className="info-tab__item">
              <div className="info-tab__version-header">
                {/* {t("metamaskVersion")} */}
                Torus version
              </div>
              <div className="info-tab__version-number">
                {this.state.version}
              </div>
            </div>
            <div className="info-tab__item">
              <div className="info-tab__about">
                {/* { t('builtInCalifornia') } */}
                Torus extension is a OAuth 2.0 distributed private key
                management solution with tKey support
              </div>
            </div>
          </div>
          {this.renderInfoLinks()}
        </div>
      </div>
    );
  }
}

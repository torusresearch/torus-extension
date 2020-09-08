import React, { Component } from 'react'
import { Switch, Route, matchPath } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import RestorePasswordForm from './restore-password-form/restore-password-form.container'
import DeviceForm from './device-form/device-form.container'
// import NewAccountCreateForm from './restore-password-form.container'
// import NewAccountImportForm from './import-account'
// import ConnectHardwareForm from './connect-hardware'
import {
  TORUS_RESTORE_PASSWORD_ROUTE,
  TRP_PASSWORD_ROUTE,
  TRP_DEVICE_ROUTE
} from '../../helpers/constants/routes'

export default class ImportShareOrPassword extends Component {
  state = {
    tabHeading: 'Verification methods'
  };

  changeHeading = (el) => {
    const { tabHeading } = this.state
    this.setState({
      tabHeading: el
    })
  }

  renderTabs () {
    const { history, location: { pathname } } = this.props
    const getClassNames = (path) => classnames('new-account__tabs__tab', {
      'new-account__tabs__selected': matchPath(pathname, {
        path,
        exact: true,
      }),
    })

    const {tabHeading} = this.state
    return (
      <div className="new-account__tabs">
        <div className="new-account__tabs__tab new-account__tabs__selected" >
          {tabHeading}
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="new-account">
        <div className="new-account__header">
          <div className={`new-account__header ${this.context.t('newAccount')}`}>
            {this.renderTabs()}
          </div>
        </div>
        <div className="new-account__form">
          {/* <RestorePasswordForm /> */}
          <Switch>
            <Route
              exact
              path={TORUS_RESTORE_PASSWORD_ROUTE}
              render={(routeProps) => (
                <RestorePasswordForm
                  {...routeProps}
                  changeHeading={this.changeHeading}
                />
              )}
            />
            <Route
              exact
              path={TRP_DEVICE_ROUTE}
              render={(routeProps) => (
                <DeviceForm
                  {...routeProps}
                  changeHeading={this.changeHeading}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

RestorePassword.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
}

RestorePassword.contextTypes = {
  t: PropTypes.func,
}

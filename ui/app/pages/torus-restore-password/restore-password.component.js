import React, { Component } from 'react'
import { Switch, Route, matchPath } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import RestorePasswordForm from './restore-password-form/restore-password-form.container'
// import NewAccountCreateForm from './restore-password-form.container'
// import NewAccountImportForm from './import-account'
// import ConnectHardwareForm from './connect-hardware'
// import {
//   NEW_ACCOUNT_ROUTE,
//   IMPORT_ACCOUNT_ROUTE,
//   CONNECT_HARDWARE_ROUTE,
// } from '../../helpers/constants/routes'

export default class RestorePassword extends Component {
  renderTabs () {
    const { history, location: { pathname } } = this.props
    const getClassNames = (path) => classnames('new-account__tabs__tab', {
      'new-account__tabs__selected': matchPath(pathname, {
        path,
        exact: true,
      }),
    })

    return (
      <div className="new-account__tabs">
        <div className="new-account__tabs__tab new-account__tabs__selected">
          Verification Required
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
          <RestorePasswordForm />
          {/* <Switch>
            <Route
              exact
              path={NEW_ACCOUNT_ROUTE}
              component={NewAccountCreateForm}
            />
            <Route
              exact
              path={IMPORT_ACCOUNT_ROUTE}
              component={NewAccountImportForm}
            />
            <Route
              exact
              path={CONNECT_HARDWARE_ROUTE}
              component={ConnectHardwareForm}
            />
          </Switch> */}
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

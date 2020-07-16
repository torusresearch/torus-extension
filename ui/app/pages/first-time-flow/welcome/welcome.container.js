import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { closeWelcomeScreen, createNewTorusVaultAndRestore, importNewAccount, setUserDetails } from '../../../store/actions'
import Welcome from './welcome.component'

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, participateInMetaMetrics } = metamask

  return {
    welcomeScreenSeen,
    participateInMetaMetrics,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    createNewTorusVaultAndRestore: (password, privateKey) => {
      return dispatch(createNewTorusVaultAndRestore(password, privateKey))
    },
    importNewAccount: (strategy, args) => {
      return dispatch(importNewAccount(strategy, args))
    },
    setUserDetails: (el) => {
      return dispatch(setUserDetails(el))
    }
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)

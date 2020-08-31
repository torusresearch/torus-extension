import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { closeWelcomeScreen, createNewTorusVaultAndRestore, importNewAccount, setUserDetails, googleLogin } from '../../../store/actions'
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
    googleLogin: (newKeyAssign) => dispatch(googleLogin(newKeyAssign, dispatch)),
    createNewTorusVaultAndRestore: (password, privateKey, userDetails) => {
      return dispatch(createNewTorusVaultAndRestore(password, privateKey, userDetails))
    },
    importNewAccount: (strategy, args, userDetails) => {
      return dispatch(importNewAccount(strategy, args, userDetails))
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

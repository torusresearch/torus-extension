import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'
import { ENVIRONMENT_TYPE_POPUP } from '../../../../app/scripts/lib/enums'
import { DEFAULT_ROUTE, RESTORE_VAULT_ROUTE } from '../../helpers/constants/routes'
import {
  tryUnlockMetamask,
  tryUnlockMetamask2,
  tryUnlockMetamask3,
  forgotPassword,
  markPasswordForgotten,
  forceUpdateMetamaskState,
  showModal,
  googleLogin
} from '../../store/actions'
import UnlockPage from './unlock-page.component'

const mapStateToProps = (state) => {
  const { metamask: { isUnlocked } } = state
  return {
    isUnlocked,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockMetamask: (password) => dispatch(tryUnlockMetamask(password)),
    tryUnlockMetamask3: (password) => dispatch(tryUnlockMetamask3(password)),
    tryUnlockMetamask2: () => dispatch(tryUnlockMetamask2()),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
    forceUpdateMetamaskState: () => forceUpdateMetamaskState(dispatch),
    showOptInModal: () => dispatch(showModal({ name: 'METAMETRICS_OPT_IN_MODAL' })),
    googleLogin: () => dispatch(googleLogin())
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { markPasswordForgotten, tryUnlockMetamask, tryUnlockMetamask2, tryUnlockMetamask3, ...restDispatchProps } = dispatchProps
  const { history, onSubmit: ownPropsSubmit, ...restOwnProps } = ownProps

  const onImport = async () => {
    await markPasswordForgotten()
    history.push(RESTORE_VAULT_ROUTE)

    if (getEnvironmentType() === ENVIRONMENT_TYPE_POPUP) {
      global.platform.openExtensionInBrowser(RESTORE_VAULT_ROUTE)
    }
  }

  // const onSubmit = async (password) => {
  //   // debugger
  //   await tryUnlockMetamask(password)
  //   // debugger
  //   history.push(DEFAULT_ROUTE)
  // }

  const onSubmit = async (password) => {
    
    await tryUnlockMetamask3(password)
    // debugger
    history.push(DEFAULT_ROUTE)
  }

  const onGoogleLogin = async () => {
    try {
      await tryUnlockMetamask2()
    }
    catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
    //await forceUpdateMetamaskState()
    // history.push(DEFAULT_ROUTE)
    //await forceUpdateMetamaskState()
  }

  return {
    ...stateProps,
    ...restDispatchProps,
    ...restOwnProps,
    onImport,
    onRestore: onImport,
    onSubmit: ownPropsSubmit || onSubmit,
    history,
    onGoogleLogin: onGoogleLogin
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(UnlockPage)

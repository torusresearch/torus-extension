import { connect } from 'react-redux'
import { approveShareRequest, cancelShareRequest, getTkeyDataForSettingsPage} from '../../../store/actions'
import NewLoginDetected from './new-login-detected.component'
// import { getMostRecentOverviewPage } from '../../ducks/history/history'

const mapStateToProps = (state) => {
  const { metamask: { network, selectedAddress, identities = {} } } = state
  const numberOfExistingAccounts = Object.keys(identities).length
  const newAccountNumber = numberOfExistingAccounts + 1

  return {
    network,
    address: selectedAddress,
    newAccountNumber,
    // mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    approveShareRequest: (el) => dispatch(approveShareRequest(el)),
    cancelShareRequest: (el) => dispatch(cancelShareRequest(el)),
    getTkeyDataForSettingsPage: () => dispatch(getTkeyDataForSettingsPage()),
  }
}

export default connect(null, mapDispatchToProps)(NewLoginDetected)

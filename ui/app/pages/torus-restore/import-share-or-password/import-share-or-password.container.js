import { connect } from 'react-redux'
// import { inputPasswordShare} from '../../../../store/actions'
import {
  getTotalDeviceShares,
  requestShareFromOtherDevice,
  generateAndStoreNewDeviceShare,
  deleteShareDescription
} from "../../../store/actions";
import ImportShareOrPassword from './import-share-or-password.component.js'
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
    getTotalDeviceShares: () => dispatch(getTotalDeviceShares()),
    requestShareFromOtherDevice: () => dispatch(requestShareFromOtherDevice()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportShareOrPassword)

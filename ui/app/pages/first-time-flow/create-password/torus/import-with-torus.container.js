import { connect } from 'react-redux'
import ImportFromTorus from './import-with-torus.component'
import {
  setSeedPhraseBackedUp,
  initializeThreeBox,
  importNewAccount,
  setSelectedAddress,
  createNewTorusVaultAndRestore,
} from '../../../../store/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState) => dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    initializeThreeBox: () => dispatch(initializeThreeBox()),
    importNewAccount: (strategy, [ privateKey ]) => {
      return dispatch(importNewAccount(strategy, [ privateKey ]))
    },
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
    createNewTorusVaultAndRestore: (password, privateKey) => {
      return dispatch(createNewTorusVaultAndRestore(password, privateKey))
    },
  }
}

export default connect(null, mapDispatchToProps)(ImportFromTorus)

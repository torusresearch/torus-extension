import PasswordForm from './password-form.component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  addPasswordShare
} from '../../../../store/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    addPasswordShare: (el) => dispatch(addPasswordShare(el))
  }
}
export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(PasswordForm)

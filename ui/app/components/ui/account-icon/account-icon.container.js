import { connect } from "react-redux";
import AccountIcon from "./account-icon.component";
import { getPostBox } from "../../../store/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    getPostBox: () => dispatch(getPostBox()),
  };
};
export default connect(null, mapDispatchToProps)(AccountIcon)

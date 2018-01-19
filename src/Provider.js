import { Component, Children } from 'react'
import PropTypes from 'prop-types'
export default class Provider extends Component {
  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }
  getChildContext() {
    return { store: this.store }
  }
  render() {
    return Children.only(this.props.children)
  }
}
const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})
Provider.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
  store: storeShape.isRequired
}

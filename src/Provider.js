import { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { storeShape } from './utils/propTypes'
import warning from './utils/warning'

function warnAboutReceivingStore() {
  warning(
    `<Provider> of react-loong don't support changing the 'store' on the fly.`
  )
}

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
if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function(nextProps) {
    if (this.store !== nextProps.store) {
      warnAboutReceivingStore()
    }
  }
}

Provider.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
  store: storeShape.isRequired
}

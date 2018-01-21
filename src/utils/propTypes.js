import PropTypes from 'prop-types'

export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

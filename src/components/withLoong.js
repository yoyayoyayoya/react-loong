import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import { storeShape } from '../utils/propTypes'

const dummyState = {}
let hotLoadingVersion = 0

export default function withLoong(events = [], propsTransformer = d => d) {
  return function wrapWithSubscribe(wrappedComponent) {
    hotLoadingVersion++
    class Subscribe extends Component {
      constructor(props, context) {
        super(props, context)
        this.version = hotLoadingVersion
        this.store = context.store
        this.state = {}
        this.onStateChange = this.onStateChange.bind(this)
        this.events = events
        this.subscribers = []
        this.initSubscription()
      }
      onStateChange(newState) {
        this.props = Object.assign(this.props, newState)
        this.setState(dummyState)
      }
      initSubscription() {
        const store = this.store
        for (let event of this.events) {
          this.subscribers.push(store.subscribe(event, this.onStateChange))
        }
      }
      componentWillUnmount() {
        for (let s of this.subscribers) {
          s.unsubscribe(this.onStateChange)
        }
        this.subscribers = []
      }
      render() {
        const props = Object.assign(
          {},
          this.props,
          { publish: this.store.publish },
          this.store.getState()
        )
        return React.createElement(wrappedComponent, propsTransformer(props))
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      Subscribe.prototype.componentWillUpdate = function componentWillUpdate() {
        //for hot loading
        if (this.version !== hotLoadingVersion) {
          this.version = hotLoadingVersion
          this.subscribers = []
          this.initSubscription()
        }
      }
    }

    Subscribe.contextTypes = {
      store: storeShape.isRequired
    }
    return hoistStatics(Subscribe, wrappedComponent)
  }
}

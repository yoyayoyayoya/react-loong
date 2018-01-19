import React, { Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'

const dummyState = {}

export default function withLoong(events = [], dataTransformer = d => d) {
  return function wrapWithSubscribe(wrappedComponent) {
    class Subscribe extends Component {
      constructor(props, context) {
        super(props, context)
        this.store = context.store
        this.state = {}
        this.props = Object.assign(
          props,
          { publish: this.store.publish },
          this.store.getState()
        )
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
        const onStateChange = this.onStateChange.bind(this)
        for (let event of this.events) {
          store.subscribe(event, onStateChange)
        }
      }
      componentWillUnmount() {
        for (let s of this.subscribers) {
          s.unsubscribe()
        }
      }
      render() {
        return React.createElement(
          wrappedComponent,
          dataTransformer(this.props)
        )
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      Subscribe.prototype.componentWillUpdate = function componentWillUpdate() {
        // We are hot reloading!
        // if (this.version !== version) {
        // }
      }
    }

    return hoistStatics(Subscribe, wrappedComponent)
  }
}

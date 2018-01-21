import React, { Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'

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
        this.props = Object.assign(
          props,
          { publish: this.store.publish },
          this.store.getState()
        )
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
        return React.createElement(
          wrappedComponent,
          propsTransformer(this.props)
        )
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

    return hoistStatics(Subscribe, wrappedComponent)
  }
}

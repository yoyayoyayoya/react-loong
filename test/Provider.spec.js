import React from 'react'
import renderer from 'react-test-renderer'
import PropTypes from 'prop-types'
import { Provider, withLoong } from '../src'
import { createStore } from 'loong'

/*eslint-disable no-console*/
describe('React loong', () => {
  describe('Provider', () => {
    const store = createStore({})
    @withLoong([])
    class Child extends React.Component {
      constructor(props, context) {
        expect(typeof props.publish).toEqual('function')
        super(props, context)
      }
      render() {
        return <div>test</div>
      }
    }
    Child.propTypes = {
      publish: PropTypes.func
    }
    let errorfn = null
    beforeAll(() => {
      errorfn = console.error
      console.error = m => m
    })
    afterAll(() => {
      console.error = errorfn
    })
    it('should one child only', () => {
      let error = null
      try {
        renderer.create(
          <Provider store={store}>
            <div>child</div>
            <div>child</div>
          </Provider>
        )
      } catch (e) {
        error = e
      }
      expect(error).not.toBeNull()
    })

    it('should match the store shape prop types', () => {
      let error = null
      let wrongStore = {}
      try {
        renderer.create(
          <Provider store={wrongStore}>
            <div>child</div>
            <div>child</div>
          </Provider>
        )
      } catch (e) {
        error = e
      }
      expect(error).not.toBeNull()
    })

    it('should make the child getting the publish function', () => {
      renderer.create(
        <Provider store={store}>
          <Child />
        </Provider>
      )
    })

    it('should get the warning if container change the store on the fly', () => {
      const spy = jest.spyOn(console, 'error')
      class Container extends React.Component {
        constructor(props) {
          super(props)
          this.state = { store: props.store }
          this._onClick = this._onClick.bind(this)
        }
        _onClick() {
          this.setState({ store: {} })
        }
        render() {
          return (
            <Provider store={this.state.store}>
              <a onClick={this._onClick} />
            </Provider>
          )
        }
      }
      Container.propTypes = { store: Provider.propTypes.store }

      const component = renderer.create(<Container store={store} />)
      let tree = component.toJSON()

      tree.props.onClick()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        `<Provider> of react-loong don't support changing the 'store' on the fly.`
      )
      spy.mockReset()
      spy.mockRestore()
    })

    it('should render the component correctly', () => {
      const component = renderer.create(
        <Provider store={store}>
          <Child />
        </Provider>
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})

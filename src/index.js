import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Async extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      mod: null,
    }
    this.store = props.store || context.store
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null,
    })
    props.load(this.store).then(mod => {
      this.setState({
        mod: mod.default ? mod.default : mod,
      })
    })
  }

  render() {
    const Component = this.state.mod
    const loading = this.props.children || null
    const props = this.props.props || {}
    const render = this.props.render || (Component => <Component {...props} />)
    return Component ? render(Component) : loading
  }
}

Async.propTypes = {
  children: PropTypes.node,
  load: PropTypes.func.isRequired,
  props: PropTypes.object,
  render: PropTypes.func,
  store: PropTypes.object,
}

Async.contextTypes = {
  store: PropTypes.object,
}

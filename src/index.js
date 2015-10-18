//placeholder

import { extendComponent, Router } from './extendComponent'

export { Router } from './extendComponent'


let isReactComponent = Component => {
	return 'prototype' in Component && typeof Component.prototype.render === 'function'
}

let functionRouter = (Component, options) => {
	let decoratedClass

	if (isReactComponent(Component)) {
		decoratedClass = class extends Component {
			constructor(props, context) {
				super(props, context)
				this.$router = new Router(options)
				this.$router.subscribe(() => this.forceUpdate())
			}
		}
	} else {
		//decoratedClass = wrapStatelessFunction(Component, path, options)
	}

	if (Component.displayName) {
		decoratedClass.displayName = Component.displayName
	} else {
		decoratedClass.displayName = Component.name
	}

    return decoratedClass
}

let decoratorRouter = options => Component => {
	return functionRouter(Component, options)
}

export let router =  (...args) => typeof args[0] === 'function'
? functionRouter(args[0], args[1], args[2])
: decoratorRouter(args[0], args[1])

let functionRoute = (Component, path, options) => {
	let decoratedClass

	if (isReactComponent(Component)) {
		decoratedClass = extendComponent(Component, path, options)
	} else {
		//decoratedClass = wrapStatelessFunction(Component, path, options)
	}

	if (Component.displayName) {
		decoratedClass.displayName = Component.displayName
	} else {
		decoratedClass.displayName = Component.name
	}

    return decoratedClass
}

let decoratorRoute = (path, options) => Component => {
	return functionRoute(Component, path, options)
}

export let route =  (...args) => typeof args[0] === 'function'
? functionRoute(args[0], args[1], args[2])
: decoratorRoute(args[0], args[1])
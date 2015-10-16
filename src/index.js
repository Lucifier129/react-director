//placeholder
export { Router } from 'director'

let isReactComponent = Component => {
	return 'prototype' in Component && typeof Component.prototype.render === 'function'
}

let functionRoute = (Component, path, options) => {
	let decoratedClass

	if (isReactComponent(Component)) {
		decoratedClass = extendComponent(Component, path, options)
	} else {
		decoratedClass = wrapStatelessFunction(Component, path, options)
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

let route =  (...args) => typeof args[0] === 'function'
? functionRoute(args[0], args[1], args[2])
: decoratorRoute(args[0], args[1])

export default route
import React from 'react'
import { 
	normalize,
	cleanPath,
	isObj,
	isFn,
	isRegExp,
	getPath,
	getHash,
	addEvent,
	removeEvent,
	parseQueryString
} from './util'


let currentParams = {}
const routes = {}
const resource = {}
let updateRoutes = path => {
	Object.keys(routes).forEach(key => routes[key].match(path))
}

class Route {
	constructor(pattern) {
		if (routes[pattern] instanceof Route) {
			return routes[pattern]
		}
		this.pattern = pattern
		this.isMatched = true
		routes[pattern] = this
	}
	match(path) {
		let { pattern } = this 
		let { regexp, keys } = normalize(resource[pattern] || pattern)
		let isMatched = false
		let str = path
		while (!isMatched && str) {
			isMatched = regexp.test(str)
			if (isMatched) {
				break
			}
			str = str.substr(0, str.lastIndexOf('/'))
		}
		
		if (str === path) {
			let matched = regexp.exec(path)
			let params = {}
			for(var i =0, len=keys.length; i<len; i++){
				param[keys[i]] = matched[i+1]
			}
			let queryString = path.split('?')[1]
			if (queryString) {
				Object.assign(params, parseQueryString(queryString))
			}
			currentParams = params
		}
		this.isMatched = isMatched
	}
}

const defaultSettings = {
	pushState: false,
	prefix: '#!',
	root: '/'
}

export class Router {
	constructor(options = {}) {
		Object.assign(this, defaultSettings, options)
		this.currentPath = null
		this.callbacks = []
		this.listener = this.listener.bind(this)
		this.isBrowser = typeof window !== 'undefined'
		this.start()
	}
	getPath() {
		this.currentPath = this.pushState ? getPath(this.root) : getHash(this.prefix)
		return this.currentPath
	}
	get params() {
		return currentParams
	}
	start() {
		if (!this.isBrowser) {
			return
		}
		addEvent(window, 'hashchange', this.listener)
		addEvent(window, 'popstate', this.listener)
		this.listener()
	}
	destroy() {
		if (!this.isBrowser) {
			return
		}
		removeEvent(window, 'hashchange', this.listener)
		removeEvent(window, 'popstate', this.listener)
	}
	listener() {
		if (!this.isBrowser) {
			return
		}
		let { currentPath } = this
		let path = this.getPath()
		if (currentPath !== path) {
			this.currentPath = path
			updateRoutes(path)
			this.publish()
		}
	}
	subscribe(callback) {
		this.callbacks.push(callback)
		return () => {
			let index = this.callbacks.indexOf(callback)
			if (index !== -1) {
				this.callbacks.splice(index, 1)
			}
		}
	}
	publish() {
		this.callbacks.forEach(callback => callback.call(this, this.currentPath))
	}
}

export let extendComponent = (Component, path, options) => {
	const route = new Route(path)
	return class extends React.Component {
		render() {
			if (route.isMatched) {
				return <Component {...this.props} />
			}
			return false
		}
	}
}
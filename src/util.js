//types.js
export let isType = type => obj => obj != null && Object.prototype.toString.call(obj) === `[object ${ type }]`
export let isObj = isType('Object')
export let isStr = isType('String')
export let isNum = isType('Number')
export let isFn = isType('Function')
export let isRegExp = isType('RegExp')
export let isArr = Array.isArray || isType('Array')
export let isThenable = obj => obj != null && isFn(obj.then)

const RE_DOUBLE_SLASH = /\/+/g
const RE_END_SLASH = /\/$/
const RE_NORMALIZE = /\:([\w-]+)(?:\(([^\/]+?)\))?|(?:\(([^\/]+)\))|(\*{2,})|(\*(?!\*))/g

export let cleanPath = path => `/${ path }`
	.replace(RE_DOUBLE_SLASH, '/')
	.replace(RE_END_SLASH, '' ) || '/'

export let normalize = path => {
	// means is from 
	// (?:\:([\w-]+))?(?:\(([^\/]+?)\))|(\*{2,})|(\*(?!\*)))/g
	let preIndex = 0
	let keys = []
	let index = 0
	let matches = ''

	path = cleanPath(path)

	//  :id(capture)? | (capture)   |  ** | * 
	let regStr = path
	.replace(RE_NORMALIZE, (all, key, keyformat, capture, mwild, swild, startAt) => {
		// move the uncaptured fragment in the path
		if(startAt > preIndex) {
			matches += path.slice(preIndex, startAt)
		}

        preIndex = startAt + all.length

        if (key) {
          matches += `(${ key })`
          keys.push(key)
          return `(${ keyformat || '[\\w-]+' })`
        }

        matches += `(${ index })`

        keys.push(index++)

        if (capture) {
        	// sub capture detect
        	return `(${ capture })`
        } 
        if (mwild) {
        	 return '(.*)'
        }
        if (swild) {
        	return '([^\\/]*)'
        }
    })

    if (preIndex !== path.length) {
    	matches += path.slice(preIndex)
    }

    return {
    	regexp: new RegExp("^" + regStr +"/?$"),
    	matches: matches || path,
    	keys
    }
}


export let getPath = (root = '/') => {
    let { pathname, search } = location
    let path = `${ pathname }${ search }`.replace(new RegExp("^" + root), '/')
    return cleanPath(path)
}

export let getHash = (prefix = '#') => {
    let path = location.href.match(new RegExp(prefix + '(.*)$'))
    return path && path[1] ? path[1] : ''
}

export let addEvent = (obj, eventName, listener) => {
    obj.addEventListener(eventName, listener, false)
}

export let removeEvent = (obj, eventName, listener) => {
    obj.removeEventListener(eventName, listener, false)
}

export let parseQueryString = queryString => {
    if (queryString == null) {
        return queryString
    }
    let query = {}
    queryString.split('&').forEach(item => {
        item = item.split('=')
        let name = decodeURIComponent(item[0])
        let value = decodeURIComponent(item[1])
        let curValue = query[name]
        let type = typeof curValue
        if (type === 'undefined') {
            query[name] = value
        } else if (type === 'string') {
            query[name] = [curValue, value]
        } else if (isArr(curValue)) {
            curValue.push(value)
        }
    })
    return query
}















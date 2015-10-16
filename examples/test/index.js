
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-director'

let log = scope => (...args) => console.log(scope, ...args)
var routes = {
	'/': {
		on: log('home.on'),
		before: log('home.before'),
		after: log('home.after'),
		once: log('home.once'),
		'/index': {
			on: log('index.on'),
			before: log('index.before'),
			after: log('index.after'),
			once: log('index.once')
		},
		'/user': {
			on: log('user.on'),
			before: log('user.before'),
			after: log('user.after'),
			once: log('user.once'),
			'/:name': {
				on: log('user.name.on'),
				before: log('user.name.before'),
				after: log('user.name.after'),
				once: log('user.name.once'),
			}
		},
		'/about': log('about'),
		'/hello/?((\w|.)*)': log('hello')
	}
}

var router = Router(routes).configure({
	recurse: 'backward'
})

console.log(router)
router.init('/')

window.router = router


ReactDOM.render(
	<div>
		<p><a href="#/index">index</a></p>
		<p><a href="#/user">user</a></p>
		<p><a href="#/about">about</a></p>
	</div>,
	document.getElementById('container')
)
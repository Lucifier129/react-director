import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { route, router } from 'react-director'

@route('/index')
class Index extends Component {
	render() {
		return <div>Index</div>
	}
}

@route('/list')
class List extends Component {
	render() {
		return <div>List</div>
	}
}

@route('/detail')
class Detail extends Component {
	render() {
		return <div>Detail</div>
	}
}

@router({ pushState: false, prefix: '#!', root: '/' })
class App extends Component {
	render() {
		return (
			<div>
				<ul>
					<li><a href="#!/index">index</a></li>
					<li><a href="#!/list">list</a></li>
					<li><a href="#!/detail">detail</a></li>
				</ul>
				<Index />
				<List />
				<Detail />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('container'))





import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from './containers/login/login'
import Admin from './containers/admin/admin'

export default class App extends Component {
	render() {
		return (
			<div className='app'>
				<Switch>
					<Route path='/admin' component={Admin} />
					<Route path='/login' component={Login} />
					<Redirect to='/admin'/>
				</Switch>
			</div>
		)
	}
}
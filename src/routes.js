import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import MenuBar from './components/MenuBar';

import Revenue from './views/Revenue/Revenue';
import Sales from './views/Sales/Sales';
import Marketing from './views/Marketing/Marketing';
import Rand from './views/RandD/RandD';
import GandA from './views/GandA/GandA';
import Reports from './views/Reports/Reports';
import Login from './views/Auth/Login/Login';
import SignUp from './views/Auth/SignUp/SignUp';
import { AuthContext } from './context/context';
import Billing from './views/Billing/Billing';
import Settings from './views/Settings/Settings';
import Pricing from './views/Pricing/Pricing';
import ConfirmRegistration from './views/Auth/Confirm/Confirm';
function Routes() {
	const {
		state: { isAuthenticated },
	} = React.useContext(AuthContext);
	return isAuthenticated ? (
		<MenuBar>
			<Switch>
				<Route exact path='/' render={() => <Redirect to='/revenue' />} />
				<Route exact path='/revenue' component={Revenue} />
				<Route exact path='/sales' component={Sales} />
				<Route exact path='/marketing' component={Marketing} />
				<Route exact path='/r-and-d' component={Rand} />
				<Route exact path='/g-and-a' component={GandA} />
				<Route exact path='/reports' component={Reports} />
				<Route exact path='/settings' component={Settings} />
				<Route exact path='/billing' component={Billing} />
				<Route exact path='/pricing' component={Pricing} />
				<Route path='*' render={() => <Redirect to='/revenue' />} />
			</Switch>
		</MenuBar>
	) : (
		<Switch>
			<Route exact path='/' render={() => <Redirect to='/login' />} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/signup' component={SignUp} />
			<Route exact path='/verify' component={ConfirmRegistration} />
			<Route path='*' render={() => <Redirect to='/login' />} />
		</Switch>
	);
}

export default Routes;

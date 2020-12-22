import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Revenue from './views/Revenue/Revenue';
import Sales from './views/Sales/Sales';
import Marketing from './views/Marketing/Marketing';
import Rand from './views/RandD/RandD';
import GandA from './views/GandA/GandA';
import Reports from './views/Reports/Reports';
import Login from './views/Auth/Login/Login';
import SignUp from './views/Auth/SignUp/SignUp';
import Checkout from './views/Checkout/Checkout';
function Routes() {
	return (
		<Switch>
			<Route exact path='/' render={() => <Redirect to='revenue' />} />
			<Route exact path='/revenue' component={Revenue} />
			<Route exact path='/sales' component={Sales} />
			<Route exact path='/marketing' component={Marketing} />
			<Route exact path='/r-and-d' component={Rand} />
			<Route exact path='/g-and-a' component={GandA} />
			<Route exact path='/reports' component={Reports} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/signup' component={SignUp} />
			<Route exact path='/checkout' component={Checkout} />
		</Switch>
	);
}

export default Routes;

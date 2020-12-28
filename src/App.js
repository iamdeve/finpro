import React from 'react';
import './App.css';
import Routes from './routes';
import { AuthContext, initialState, reducer } from './context/context';
import { getCurrentUser } from './service';
require('./RoundedBars');

function App() {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	if (getCurrentUser() && new Date(getCurrentUser().exp * 1000).getTime() < new Date().getTime()) {
		dispatch({
			type: 'LOGOUT',
		});
		window.location.href = '/';
	}
	return (
		<div className='app'>
			<AuthContext.Provider
				value={{
					state,
					dispatch,
				}}>
				<Routes />
			</AuthContext.Provider>
		</div>
	);
}

export default App;

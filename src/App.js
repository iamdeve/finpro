import React from 'react';
import './App.css';
import Routes from './routes';
import { AuthContext, initialState, reducer } from './context/context';

function App() {
	const [state, dispatch] = React.useReducer(reducer, initialState);
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

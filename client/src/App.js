import React from 'react';
import './App.css';
import MenuBar from './components/MenuBar';
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
				<MenuBar>
					<Routes />
				</MenuBar>
			</AuthContext.Provider>
		</div>
	);
}

export default App;

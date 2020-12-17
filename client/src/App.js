import './App.css';
import MenuBar from './components/MenuBar';
import Routes from './routes';
function App() {
	return (
		<div className='app'>
			<MenuBar>
				<Routes />
			</MenuBar>
		</div>
	);
}

export default App;

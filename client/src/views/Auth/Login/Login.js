import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../context/axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/context'
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

function Login() {
	const classes = useStyles();
	const history = useHistory();
	const {state, dispatch} = React.useContext(AuthContext);
	const [alertClass, setAlertClass] = React.useState('');
	const [err, setErr] = React.useState('');
	const [loginForm, setLoginForm] = React.useState({
		email: '',
		password: '',
	});

	const handleLogin = (e) => {
		const { name, value } = e.target;
		setLoginForm((prevState) => {
			// console.log(prevState);
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let login = await axios.post('/auth/login', loginForm);
			if (login.status === 200 || login.status === 201) {
				console.log(login)
				setErr('');
				setAlertClass('show');
				setLoginForm({
					email: '',
					password: '',
				});
				dispatch({
					type: 'LOGIN',
					payload: login.data.token,
				});
				history.push('/');
			}
		} catch (e) {
			setAlertClass('show');
			if (e.response && e.response.data) {
				if (e.response.data.error) {
					setErr(e.response.data.error.message);
				} else {
					if (e.response.data.message) {
						setErr(e.response.data.message.message);
					}
				}
			} else {
				setErr(e.message);
			}
		}
	};
	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
	};

	return (
		<div className={classes.root}>
			<div className='card'>
				<div className='card-body'>
					<div className='card-title'>
						<h2>Login</h2>
					</div>
					{err && (
						<div className={`alert alert-danger alert-dismissible fade ${alertClass}`} role='alert'>
							<strong>{err}</strong>
							<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
								<span aria-hidden='true'>×</span>
							</button>
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='email' className='form-label'>
									Email
								</label>
								<input type='email' name='email' value={loginForm.email} onChange={handleLogin} className='form-control' id='email' placeholder='Email' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='password' className='form-label'>
									Password
								</label>
								<input type='password' name='password' value={loginForm.password} onChange={handleLogin} className='form-control' id='password' placeholder='Password' required />
							</div>
						</div>
						<button className='btn btn-primary' type='submit'>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;

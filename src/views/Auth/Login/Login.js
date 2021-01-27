import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../context/axios';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/context';
import { getUser, getUserPurchasing } from '../../../context/fetch-service';
import LOGO from '../../../assets/logo.png';
import BGImgs from '../../../assets/sign-in-cover.jpg';
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

function Login() {
	const classes = useStyles();
	const history = useHistory();
	const { state, dispatch } = React.useContext(AuthContext);
	const [passwordType, setPasswordType] = React.useState('password');
	const [alertClass, setAlertClass] = React.useState('');
	const [err, setErr] = React.useState('');
	const [loader, setLoader] = React.useState(false);
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
		setLoader(true);
		e.preventDefault();
		try {
			let login = await axios.post('/login', loginForm);
			if (login.status === 200 || login.status === 201) {
				let user = await getUser(login.data.token);
				let purchasing = await getUserPurchasing();
				if (purchasing) {
					dispatch({
						type: 'SET_PURCHASING',
						payload: purchasing,
					});
				}
				if (user) {
					setErr('');
					setAlertClass('show');
					setLoginForm({
						email: '',
						password: '',
					});
					dispatch({
						type: 'LOGIN',
						payload: { token: login.data.token, user: user },
					});
					setLoader(false);
					history.push('/');
				}
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
			setLoader(false);
		}
	};
	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
	};

	const handlePwdType = () => {
		if (passwordType === 'password') {
			setPasswordType('text');
		} else {
			setPasswordType('password');
		}
	};

	return (
		<div className='container-fluid'>
			<div className='row align-items-center justify-content-center'>
				<div className='col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5'>
					<div className='Logo text-center'>
						<Link to='/'>
							<img src={LOGO} alt='logo' />
						</Link>
					</div>
					<h2 className='display-4 text-center mb-3'>Sign in</h2>
					{err && (
						<div className={`alert alert-danger alert-dismissible fade ${alertClass}`} role='alert'>
							<strong>{err}</strong>
							<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
								<span aria-hidden='true'>×</span>
							</button>
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label className='form-label'>Email Address</label>

							<input type='email' name='email' value={loginForm.email} onChange={handleLogin} className='form-control' required placeholder='name@address.com' />
						</div>

						<div className='form-group'>
							<div className='row'>
								<div className='col'>
									<label className='form-label'>Password</label>
								</div>
								<div className='col-auto'>
									<Link to='forgot-password' className='form-text small text-muted'>
										Forgot password?
									</Link>
								</div>
							</div>

							<div className='input-group input-group-merge'>
								<input className='form-control' type={passwordType} name='password' value={loginForm.password} onChange={handleLogin} required placeholder='Enter your password' />

								<span onClick={handlePwdType} className='input-group-text'>
									<i style={{ cursor: 'pointer' }} className='fe fe-eye'></i>
								</span>
							</div>
						</div>

						<button disabled={loader} className='btn btn-lg btn-block btn-custom mb-3'>
							{loader && (
								<div className='spinner-border spinner-border-sm' role='status'>
									<span className='sr-only'>Loading...</span>
								</div>
							)}
							{!loader && 'Sign in'}
						</button>

						<p className='text-center'>
							<small className='text-muted text-center'>
								Don't have an account yet? <Link to='/signup'>Sign up</Link>.
							</small>
						</p>
					</form>
				</div>
				<div className='col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block'>
					<div className='bg-cover vh-100 mt-n1 mr-n3' style={{ backgroundImage: `url(${BGImgs})` }}></div>
				</div>
			</div>
		</div>
	);
}

export default Login;

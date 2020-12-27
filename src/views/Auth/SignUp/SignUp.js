import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../context/axios';
import { Link } from 'react-router-dom';
import LOGO from '../../../assets/logo.png';
import BGImgs from '../../../assets/sign-in-cover.jpg';
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

function SignUp() {
	const classes = useStyles();

	const [alertClass, setAlertClass] = React.useState('');
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState(''); 
	const [loader, setLoader] = React.useState(false);

	const [passwordType, setPasswordType] = React.useState('password');
	const [signupForm, setSignupForm] = React.useState({
		email: '',
		cpassword: '',
	});

	const handleSignUp = (e) => {
		const { name, value } = e.target;
		setSignupForm((prevState) => {
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
			let signup = await axios.post('/auth/signup', signupForm);
			if (signup.status === 200 || signup.status === 201) {
				setErr('');
				setAlertClass('show');
				setSignupForm({
					email: '',
					password: '',
				});
				setMsg('Successfully Registered');
				setLoader(false);
			}
		} catch (e) {
			setAlertClass('show');
			setMsg('');
			if (e.response && e.response.data) {
				if (e.response.data.error) {
					setErr(e.response.data.error.message);
				} else {
					setErr(e.response.data.message);
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
		setMsg('');
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
					<h2 className='display-4 text-center mb-3'>Create a new Account</h2>
					{msg && (
						<div className={`alert alert-success alert-dismissible fade ${alertClass}`} role='alert'>
							<strong>{msg}</strong>
							<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
								<span aria-hidden='true'>×</span>
							</button>
						</div>
					)}
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

							<input type='email' name='email' value={signupForm.email} onChange={handleSignUp} className='form-control' required placeholder='name@address.com' />
						</div>

						<div className='form-group'>
							<label className='form-label'>Password</label>

							<div className='input-group input-group-merge'>
								<input className='form-control' name='password' value={signupForm.password} onChange={handleSignUp} required type={passwordType} placeholder='Enter your password' />

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
							{!loader && 'Sign up for 30-days free trial'}
						</button>

						<div className='text-center'>
							<small className='text-muted text-center'>
								Already have an account? <Link to='/login'>Log in</Link>.
							</small>
						</div>
					</form>
				</div>

				<div className='col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block'>
					<div className='bg-cover vh-100 mt-n1 mr-n3' style={{ backgroundImage: `url(${BGImgs})` }}></div>
				</div>
			</div>
		</div>
	);
}

export default SignUp;

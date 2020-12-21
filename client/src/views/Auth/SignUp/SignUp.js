import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../context/axios';
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
	const [signupForm, setSignupForm] = React.useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
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
		e.preventDefault();

		if (signupForm.password !== signupForm.cpassword) {
			setAlertClass('show');
			setErr('Passowrd should match with Confirm Password');
			return;
		}
		try {
			let signup = await axios.post('/auth/signup', signupForm);
			if (signup.status === 200 || signup.status === 201) {
				setErr('');
				setAlertClass('show');
				setSignupForm({
					firstName: '',
					lastName: '',
					email: '',
					password: '',
					cpassword: '',
				});
				setMsg('Successfully Registered');
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
		}
	};
	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
		setMsg('');
	};

	return (
		<div className={classes.root}>
			<div className='card'>
				<div className='card-body'>
					<div className='card-title'>
						<h2>Create Account</h2>
					</div>
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
						<div className='row g-3'>
							<div className='col-12 col-md-6 mb-3'>
								<label htmlFor='firstName' className='form-label'>
									First name
								</label>
								<input type='text' name='firstName' value={signupForm.firstName} onChange={handleSignUp} className='form-control' id='firstName' placeholder='First name' required />
							</div>
							<div className='col-12 col-md-6 mb-3'>
								<label htmlFor='lastName' className='form-label'>
									Last name
								</label>
								<input type='text' name='lastName' value={signupForm.lastName} onChange={handleSignUp} className='form-control' id='lastName' placeholder='Last name' required />
							</div>
						</div>

						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='email' className='form-label'>
									Email
								</label>
								<input type='email' name='email' value={signupForm.email} onChange={handleSignUp} className='form-control' id='email' placeholder='Email' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='password' className='form-label'>
									Password
								</label>
								<input type='password' name='password' value={signupForm.password} onChange={handleSignUp} className='form-control' id='password' placeholder='Password' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='cpassword' className='form-label'>
									Confirm Password
								</label>
								<input type='password' name='cpassword' value={signupForm.cpassword} onChange={handleSignUp} className='form-control' id='cpassword' placeholder='Confirm Password' required />
							</div>
						</div>

						<button className='btn btn-primary' type='submit'>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default SignUp;

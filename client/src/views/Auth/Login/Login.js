import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

function Login() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className='card'>
				<div className='card-body'>
					<div className='card-title'>
						<h2>Login</h2>
					</div>
					<form>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='email' className='form-label'>
									Email
								</label>
								<input type='email' className='form-control' id='email' placeholder='Email' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='password' className='form-label'>
									Password
								</label>
								<input type='password' className='form-control' id='password' placeholder='Password' required />
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

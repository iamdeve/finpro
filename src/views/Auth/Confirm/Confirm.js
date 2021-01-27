import React from 'react';
import axios from '../../../context/axios';
import { Link } from 'react-router-dom';
import LOGO from '../../../assets/logo.png';
import BGImgs from '../../../assets/sign-in-cover.jpg';

function ConfirmRegistration({ email, alertClass, setAlertClass, msg, setMsg, err, setErr, loader, setLoader }) {
	const [confirmationForm, setConfirmationForm] = React.useState({
		code: '',
	});

	const [success, setSuccess] = React.useState(false);

	const handleConfirmForm = (e) => {
		const { name, value } = e.target;
		setConfirmationForm((prevState) => {
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
			let verify = await axios.post('/verify', { ...confirmationForm, email });
			if (verify.status === 200 || verify.status === 201) {
				setErr('');
				setAlertClass('show');
				setConfirmationForm({
					code: '',
				});
				setMsg('Successfully Registered');
				setSuccess(true);
				setLoader(false);
			}
		} catch (e) {
			setAlertClass('show');
			setMsg('');
			if (e.response && e.response.data) {
				if (e.response.data.error) {
					setErr(e.response.data.error.message);
				} else if (e.response.data.errors && e.response.data.errors.length > 0) {
					console.log(e.response);
					setErr(e.response.data.errors[0].msg);
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

	return (
		<div className='container-fluid'>
			<div className='row align-items-center justify-content-center'>
				<div className='col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5'>
					<div className='Logo text-center'>
						<Link to='/'>
							<img src={LOGO} alt='logo' />
						</Link>
					</div>
					<h2 className='display-4 text-center mb-3'>Verify Your Account</h2>
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

					{success ? (
						<div className=''>
							Your account has been successfully created! <Link to='/login'>Please Login</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<div className='form-group'>
								<label className='form-label'>Enter Confirmation Code</label>
								<input type='text' name='code' value={confirmationForm.code} onChange={handleConfirmForm} className='form-control' required placeholder='i.e.123456' />
							</div>

							<button disabled={loader} style={{ margin: 0 }} className='btn btn-lg btn-block btn-custom'>
								{loader && (
									<div className='spinner-border spinner-border-sm' role='status'>
										<span className='sr-only'>Loading...</span>
									</div>
								)}
								{!loader && 'Verify'}
							</button>
						</form>
					)}
				</div>

				<div className='col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block'>
					<div className='bg-cover vh-100 mt-n1 mr-n3' style={{ backgroundImage: `url(${BGImgs})` }}></div>
				</div>
			</div>
		</div>
	);
}

export default ConfirmRegistration;

import React from 'react';
import Profile from '../../assets/profile.png';
import { AuthContext } from '../../context/context';
import axios, { BASE_URL } from '../../context/axios';
function Settings() {
	const {
		// state: { user },
		state,
		dispatch,
	} = React.useContext(AuthContext);
	let { user } = state;
	const [userSetting, setUserSetting] = React.useState({
		firstName: user ? user.firstName : '',
		lastName: user ? user.lastName : '',
		email: user ? user.email : '',
		phone: user ? user.phone : '',
	});

	const [alertClass, setAlertClass] = React.useState('');
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [loader, setLoader] = React.useState(false);
	const [file, setFile] = React.useState('');
	const [fileUrl, setFileUrl] = React.useState('');

	const handleSetting = (e) => {
		const { name, value } = e.target;
		setUserSetting((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const onChangeFile = (event) => {
		const file = event.target.files[0];
		if (file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function (e) {
				setFileUrl(reader.result);
				setFile(file);
			};
		}
	};

	const changeProfile = async () => {
		setLoader(true);
		const formData = new FormData();
		formData.append('image', file, file.name);
		try {
			let profile = await axios.post('/profile', formData);
			if (profile.status === 200) {
				let user = await axios.get('/user');
				if (user.status === 200) {
					setErr('');
					setAlertClass('show');
					setFile('');
					dispatch({
						type: 'SET_USER',
						payload: user.data.user,
					});
					setMsg(profile.data.message);
					setLoader(false);
				}
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
	const handleSubmit = async (e) => {
		setLoader(true);
		e.preventDefault();
		try {
			let update = await axios.patch('/setting', userSetting);
			if (update.status === 200) {
				let user = await axios.get('/user');
				if (user.status === 200) {
					setErr('');
					setAlertClass('show');
					setUserSetting({
						firstName: user !== null ? user.data.user.firstName : '',
						lastName: user !== null ? user.data.user.lastName : '',
						email: user !== null ? user.data.user.email : '',
						phone: user !== null ? user.data.user.phone : '',
					});
					dispatch({
						type: 'SET_USER',
						payload: user.data.user,
					});
					setMsg(update.data.message);
					setLoader(false);
				}
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
	const cancelProfileChange = () => {
		setFileUrl('');
	};

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-12 col-lg-6'>
					<h1 className='page-headings'>Settings</h1>
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
					<div className='row'>
						<div className='col'>
							<div className='row align-items-center'>
								<div className='col-auto'>
									<div title='Change Profile' className='file-type-container avatar avatar-container'>
										<div onClick={cancelProfileChange} className='avatar-cross'>
											<i style={{ fontSize: '16px' }} className='fe fe-x'></i>
										</div>
										<span className='btn-type-file'>
											<input type='file' name='file' onChange={(e) => onChangeFile(e)} />
											<span className='btn-file-icon'>
												<i className='fe fe-camera'></i>
											</span>
										</span>
										<img src={fileUrl !== '' && fileUrl !== null ? fileUrl : user && user.profile && fileUrl === '' ? `${user.profile}` : Profile} className='avatar-img rounded-circle' alt='profile' />
									</div>
								</div>
								<div className='col ml-n2'>
									<h4 className='mb-1'>Profile Picture</h4>
									<button disabled={loader || file === ''} onClick={changeProfile} className='btn btn-sm btn-custom'>
										{loader && (
											<div className='spinner-border spinner-border-sm' role='status'>
												<span className='sr-only'>Loading...</span>
											</div>
										)}
										{!loader && 'Upload'}
									</button>
								</div>
							</div>
						</div>
					</div>
					<form onSubmit={handleSubmit}>
						<div className='mt-5 mb-5'></div>
						<div className='row'>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>First name</label>
									<input type='text' className='form-control' name='firstName' value={userSetting.firstName} onChange={handleSetting} required placeholder='First Name' />
								</div>
							</div>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>Last name</label>
									<input type='text' className='form-control' name='lastName' value={userSetting.lastName} onChange={handleSetting} required placeholder='Last Name' />
								</div>
							</div>
							<div className='col-12'>
								<div className='form-group'>
									<label className='mb-1'>Email address</label>
									<input type='email' className='form-control' name='email' value={userSetting.email} onChange={handleSetting} required placeholder='Emails' />
								</div>
							</div>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>Phone</label>
									<input type='text' className='form-control mb-3' name='phone' value={userSetting.phone} onChange={handleSetting} required placeholder='Phone' />
								</div>
							</div>
						</div>

						<button disabled={loader} className='btn btn-custom btn-padd'>
							{loader && (
								<div className='spinner-border spinner-border-sm' role='status'>
									<span className='sr-only'>Loading...</span>
								</div>
							)}
							{!loader && 'Save changes'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Settings;

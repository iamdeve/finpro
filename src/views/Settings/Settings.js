import React from 'react';
import Profile from '../../assets/profile.png';
function Settings() {
	return (
		<div className='container'>
			<div className='row'>
				<div className='col-12 col-lg-6'>
					<h1 className='page-headings'>Settings</h1>
					<form>
						<div className='row'>
							<div className='col'>
								<div className='row align-items-center'>
									<div className='col-auto'>
										<div className='avatar avatar-container'>
                                            <div className="avatar-cross"><i className="fe fe-x"></i></div>
											<img src={Profile} className='avatar-img rounded-circle' alt='profile' />
										</div>
									</div>
									<div className='col ml-n2'>
										<h4 className='mb-1'>Profile Picture</h4>
										<button className='btn btn-sm btn-custom'>Upload</button>
									</div>
								</div>
							</div>
						</div>
						<div className='mt-5 mb-5'></div>
						<div className='row'>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>First name</label>

									<input type='text' className='form-control' />
								</div>
							</div>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>Last name</label>
									<input type='text' className='form-control' />
								</div>
							</div>
							<div className='col-12'>
								<div className='form-group'>
									<label className='mb-1'>Email address</label>
									<input type='email' className='form-control' />
								</div>
							</div>
							<div className='col-12 col-md-12'>
								<div className='form-group'>
									<label className='form-label'>Phone</label>
									<input type='text' className='form-control mb-3' placeholder='' />
								</div>
							</div>
						</div>

						<button className='btn btn-custom btn-padd'>Save changes</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Settings;

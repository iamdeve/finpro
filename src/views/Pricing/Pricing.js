import React from 'react';
import { getUserPaymentMethods, getUserPurchasing } from '../../context/fetch-service';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';
import { subscription, cancelSubscription } from '../../context/subscription-service';
import { set } from 'numeral';
const planlist = ['SaaS business Model', 'Input Variables', 'Charts', 'Reports', '30-days free trial'];

function Pricing() {
	const history = useHistory();
	const {
		state: { user, billingDetails, purchasing, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const userSub = purchasing && purchasing.length > 0 ? purchasing.filter((sub) => sub.status === 'active') : [];

	const [alertErrOpen, setAlertErrOpen] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [loaderFor, setLoaderFor] = React.useState('');
	const [alertClass, setAlertClass] = React.useState('');
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
	};

	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
		async function fetchRevenue() {
			let billings = await getUserPaymentMethods();
			dispatch({
				type: 'SET_BILLING',
				payload: billings,
			});
			let purchasing = await getUserPurchasing();
			dispatch({
				type: 'SET_PURCHASING',
				payload: purchasing,
			});
		}
		fetchRevenue();
	}, [isAuthenticated, history, dispatch]);

	const handleCloseAlert = () => {
		setAlertClass('hide');
		setAlertErrOpen('');
		setMsg('');
		setErr('');
	};

	const giveAlert = () => {
		setAlertClass('show');
		setAlertErrOpen('Please add payment details first');
	};

	const addSubscription = async (e, startTrial) => {
		e.preventDefault();
		setLoaderFor(startTrial ? 'trial' : 'sub');
		if (!startTrial && billingDetails.length === 0) {
			giveAlert();
			setLoaderFor('');
			return;
		}

		setLoader(true);
		try {
			let sub = await subscription(startTrial);
			if (sub.status === 200 || sub.status === 201) {
				let billings = await getUserPaymentMethods();
				dispatch({
					type: 'SET_BILLING',
					payload: billings,
				});
				let purchasing = await getUserPurchasing();
				dispatch({
					type: 'SET_PURCHASING',
					payload: purchasing,
				});

				setAlertClass('show');
				setMsg(sub.data.message);
				setErr('');
				setLoader(false);
				setLoaderFor('');
			}
		} catch (err) {
			setAlertClass('show');
			setMsg('');
			console.log(err);
			if (err.response && err.response.data) {
				if (err.response.data.error) {
					if (err.response.data.error && err.response.data.error.raw) {
						setErr(err.response.data.error.raw.message);
					} else {
						setErr(err.response.data.error.message);
					}
				} else if (err.response.data.errors) {
					let errors = err.response.data.errors.map((err) => <li>{err.msg}</li>);
					setErr(errors);
				} else {
					setErr(err.response.data.message);
				}
			} else {
				setErr(err.message);
			}
			setLoader(false);
			setLoaderFor('');
		}
	};
	const cancelUserSubscription = async (e) => {
		e.preventDefault();
		setLoader(true);
		setLoaderFor('cancel');
		try {
			let sub = await cancelSubscription();
			if (sub.status === 200 || sub.status === 201) {
				let billings = await getUserPaymentMethods();
				dispatch({
					type: 'SET_BILLING',
					payload: billings,
				});
				let purchasing = await getUserPurchasing();
				dispatch({
					type: 'SET_PURCHASING',
					payload: purchasing,
				});

				setAlertClass('show');
				setMsg(sub.data.message);
				setErr('');
				setLoader(false);
				setLoaderFor('');
			}
		} catch (err) {
			setAlertClass('show');
			setMsg('');
			console.log(err);
			if (err.response && err.response.data) {
				if (err.response.data.error) {
					setErr(err.response.data.error.message);
				} else if (err.response.data.errors) {
					let errors = err.response.data.errors.map((err) => <li>{err.msg}</li>);
					setErr(errors);
				} else {
					setErr(err.response.data.message);
				}
			} else {
				setErr(err.message);
			}
			setLoader(false);
			setLoaderFor('');
		}
	};
	return (
		<div className='container'>
			{alertErrOpen && (
				<div className={`alert alert-danger alert-dismissible fade ${alertClass}`} role='alert'>
					<strong>{alertErrOpen}</strong>
					<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
						<span aria-hidden='true'>×</span>
					</button>
				</div>
			)}
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
				<div className='col-lg-12'>
					<h1 className='page-headings text-center'>Plan & Pricing</h1>

					<div className='mt-2 mb-2'></div>

					<div className='row justify-content-center'>
						<div className='col-lg-6'>
							<div className='card'>
								<div className='plan-card-heading'>
									<h4>INTRO PLAN</h4>
									<h1 className='plan-price'>
										<span>$</span>19
									</h1>
									<span>/month</span>
								</div>

								<div className='items-check-list'>
									<ul>
										{planlist.map((list, id) => (
											<li key={id}>
												<div className='row'>
													<div className='col'>
														<h4>{list}</h4>
													</div>
													<div className='col-auto'>
														<span className='list-checks'>
															<i className='fe fe-check-circle'></i>
														</span>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>

								<div className='mt-2'></div>
								<div className='mb-4 text-center'>
									{userSub && userSub.length > 0 ? (
										<>
											<button onClick={cancelUserSubscription} className='btn btn-custom btn-padd'>
												{loaderFor === 'cancel' && (
													<div className='spinner-border spinner-border-sm' role='status'>
														<span className='sr-only'>Loading...</span>
													</div>
												)}
												Cancel
											</button>
											{userSub[0].planType === 'trial' && (
												<button onClick={addSubscription} className='btn btn-custom btn-padd'>
													{loaderFor === 'purchase' && (
														<div className='spinner-border spinner-border-sm' role='status'>
															<span className='sr-only'>Loading...</span>
														</div>
													)}
													Purchase
												</button>
											)}
										</>
									) : (
										<>
											<button onClick={(e) => addSubscription(e)} className='btn btn-custom btn-padd'>
												{loaderFor === 'sub' && (
													<div className='spinner-border spinner-border-sm' role='status'>
														<span className='sr-only'>Loading...</span>
													</div>
												)}
												{(loaderFor === '' || loaderFor === 'trial') && 'Subscribe'}
											</button>
											<button onClick={(e) => addSubscription(e, 'startTrial')} className='btn btn-custom btn-padd'>
												{loaderFor === 'trial' && (
													<div className='spinner-border spinner-border-sm' role='status'>
														<span className='sr-only'>Loading...</span>
													</div>
												)}
												{(loaderFor === '' || loaderFor === 'sub') && 'Start Trial'}
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Pricing;

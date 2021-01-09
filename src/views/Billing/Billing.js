import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { getUserPaymentMethods, getUserPurchasing } from '../../context/fetch-service';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Visa from '../../assets/visa.svg';
import MasterCard from '../../assets/mastercard.svg';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';

import { addPayment, deletePayment } from '../../context/payment-service';
import { userInvoices } from '../../context/subscription-service';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const ITEM_HEIGHT = 48;
const useStyles = makeStyles((theme) => ({}));
function Billing() {
	const { meta, wrapperProps, getCardImageProps, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
	const classes = useStyles();
	const history = useHistory();
	const {
		state: { billingDetails, invoices, purchasing, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const menuOpen = Boolean(anchorEl);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');

	const [msg2, setMsg2] = React.useState('');
	const [err2, setErr2] = React.useState('');

	const [open, setOpen] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [alertClass, setAlertClass] = React.useState('');
	const [paymentForm, setPaymentForm] = React.useState({
		city: '',
		state: '',
		address: '',
		cardNumber: '',
		expiryDate: '',
		cvc: '',
	});

	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
		setMsg('');
		setErr2('');
		setMsg2('');
	};

	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<span
			className={classes.ProfileIcon}
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}>
			{/* Render custom icon here */}
			{children}
		</span>
	));

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
				payload: purchasing.filter((purc) => purc.status === 'active'),
			});
			let invoices = await userInvoices();
			dispatch({
				type: 'SET_INVOICES',
				payload: invoices,
			});
		}
		fetchRevenue();
	}, [isAuthenticated, history, dispatch]);

	const handlePaymentFormChange = (e) => {
		const { name, value } = e.target;
		setPaymentForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
		setPaymentForm({
			city: '',
			state: '',
			address: '',
			cardNumber: '',
			expiryDate: '',
			cvc: '',
		});
		setErr('');
		setMsg('');
		setErr2('');
		setMsg2('');
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoader(true);
		console.log(meta);
		if (meta.error) {
			setErr2(meta.error);
			setLoader(false);
			return;
		}
		console.log(paymentForm);
		let data = {
			city: paymentForm.city,
			state: paymentForm.state,
			address: paymentForm.address,
			number: paymentForm.cardNumber.split(' ').join(''),
			exp_month: paymentForm.expiryDate ? paymentForm.expiryDate.split('/')[0].trim() : '',
			exp_year: paymentForm.expiryDate ? paymentForm.expiryDate.split('/')[1].trim() : '',
			cvc: paymentForm.cvc,
		};

		try {
			let addPaymentMethod = await addPayment(data);

			if (addPaymentMethod.status === 200) {
				let billings = await getUserPaymentMethods();
				dispatch({
					type: 'SET_BILLING',
					payload: billings,
				});

				setAlertClass('show');
				setMsg2(addPaymentMethod.data.message);
				setErr2('');
				setPaymentForm({
					city: '',
					state: '',
					address: '',
					cardNumber: '',
					expiryDate: '',
					cvc: '',
				});
				// setOpen(false);
				setLoader(false);
			}
		} catch (err) {
			setAlertClass('show');
			setMsg2('');
			if (err.response && err.response.data) {
				if (err.response.data.error) {
					if (err.response.data.error && err.response.data.error.raw) {
						setErr2(err.response.data.error.raw.message);
					} else {
						setErr2(err.response.data.error.message);
					}
				} else if (err.response.data.errors) {
					console.log(err.response.data.errors);
					let errors = err.response.data.errors.map((err) => <li>{err.msg}</li>);
					setErr2(errors);
				} else {
					setErr2(err.response.data.message);
				}
			} else {
				setErr2(err.message);
			}
			setLoader(false);
		}
	};

	const deletePaymentMethods = async (id) => {
		setLoader(true);
		try {
			let deletePaymentMethod = await deletePayment(id);

			if (deletePaymentMethod.status === 200) {
				let billings = await getUserPaymentMethods();
				dispatch({
					type: 'SET_BILLING',
					payload: billings,
				});

				setAlertClass('show');
				setMsg(deletePaymentMethod.data.message);
				setErr('');
				setLoader(false);
			}
		} catch (err) {
			setAlertClass('show');
			setMsg('');
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
		}
		handleMenuClose();
	};
	return (
		<div className='container'>
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
			<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>{'Add Payment Method'}</DialogTitle>
				<form onSubmit={(e) => handleSubmit(e)}>
					<DialogContent>
						<div className='row g-3'>
							{msg2 && (
								<div className={`alert alert-success alert-dismissible fade ${alertClass}`} role='alert'>
									<strong>{msg2}</strong>
									<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
										<span aria-hidden='true'>×</span>
									</button>
								</div>
							)}
							{err2 && (
								<div className={`alert alert-danger alert-dismissible fade ${alertClass}`} role='alert'>
									<strong>{err2}</strong>
									<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
										<span aria-hidden='true'>×</span>
									</button>
								</div>
							)}
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='value' className='form-label'>
									City
								</label>
								<input type='text' name='city' value={paymentForm.city} onChange={handlePaymentFormChange} className='form-control' id='city' placeholder='City' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='state' className='form-label'>
									State
								</label>
								<input type='text' name='state' value={paymentForm.state} onChange={handlePaymentFormChange} className='form-control' id='state' placeholder='State' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='address' className='form-label'>
									Address
								</label>
								<input type='text' name='address' value={paymentForm.address} onChange={handlePaymentFormChange} className='form-control' id='address' placeholder='Address' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<div>
									<label className='form-label'>Card Details</label>
								</div>
								<PaymentInputsWrapper {...wrapperProps}>
									<svg {...getCardImageProps({ images })} />
									<input name='number' {...getCardNumberProps({ onChange: handlePaymentFormChange })} value={paymentForm.cardNumber} />
									<input name='exp_date' {...getExpiryDateProps({ onChange: handlePaymentFormChange })} value={paymentForm.expiryDate} />
									<input name='cvc' {...getCVCProps({ onChange: handlePaymentFormChange })} value={paymentForm.cvc} />
								</PaymentInputsWrapper>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<button className='btn btn-danger' onClick={handleClose}>
							Cancel
						</button>
						<button disabled={loader} type='submit' className='btn btn-primary' autoFocus>
							{loader && (
								<div className='spinner-border spinner-border-sm' role='status'>
									<span className='sr-only'>Loading...</span>
								</div>
							)}
							{!loader && 'Add Payment Method'}
						</button>
					</DialogActions>
				</form>
			</Dialog>

			<div className='row'>
				<div className='col-12 col-lg-12'>
					<h1 className='page-headings'>Billing</h1>

					<div className='card pt-4 pb-4 pl-4 pr-4'>
						<div className='row'>
							<div className='col'>
								<div className='billing-plan'>{purchasing && purchasing.length > 0 ? "You're currently on intro plan" : 'You did not have any plan'}</div>
							</div>
							<div className='col-auto'>
								<button onClick={() => history.push('/pricing')} className='btn btn-custom btn-padd'>
									Manage plan
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-4 mb-4'></div>
				<div className='card'>
					<div className='card-header card-heading'>
						<div className='row align-items-center'>
							<div className='col'>
								<h4 className='card-header-title'>Payment methods</h4>
							</div>
							<div className='col-auto'>
								<button onClick={handleClickOpen} className='btn btn-sm btn-custom'>
									Add method
								</button>
							</div>
						</div>
					</div>
					<div className='card-body'>
						<div className='list-group list-group-flush my-n3'>
							{billingDetails &&
								billingDetails.length > 0 &&
								billingDetails.map((billing, id) => {
									return (
										<div key={id} className='list-group-item'>
											<div className='row align-items-center'>
												<div className='col-auto'>
													<img className='img-fluid' src={billing.paymentMethod.card.brand === 'visa' ? Visa : MasterCard} alt='visa' style={{ maxWidth: '38px' }} />
												</div>
												<div className='col ml-n2'>
													<h4 className='mb-1'>Visa ending in {billing.paymentMethod.card.exp_year}</h4>
													<small className='text-muted'>
														Expires {billing.paymentMethod.card.exp_month}/{billing.paymentMethod.card.exp_year}
													</small>
												</div>
												<div className='col-auto mr-n3'>
													<span className='badge bg-light'>{billing.type}</span>
												</div>
												<div className='col-auto'>
													<IconButton aria-label='more' aria-controls='long-menu' aria-haspopup='true' onClick={handleMenuClick}>
														<MoreVertIcon />
													</IconButton>
													<Menu
														id='long-menu'
														anchorEl={anchorEl}
														keepMounted
														open={menuOpen}
														onClose={handleMenuClose}
														PaperProps={{
															style: {
																maxHeight: ITEM_HEIGHT * 4.5,
																width: '20ch',
															},
														}}>
														<MenuItem onClick={() => deletePaymentMethods(billing._id)}>
															{loader ? (
																<div className='spinner-border spinner-border-sm' role='status'>
																	<span className='sr-only'>Loading...</span>
																</div>
															) : (
																'Delete'
															)}
														</MenuItem>
													</Menu>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
				<div className='mt-2 mb-2'></div>
				<div className='card'>
					<div className='card-header card-heading'>
						<div className='row align-items-center'>
							<div className='col'>
								<h4 className='card-header-title'>Payment History</h4>
							</div>
						</div>
					</div>

					<div className='payment-history-table'>
						<table class='table table-hover table-nowrap'>
							<thead>
								<tr>
									<th scope='col'>Transaction Date</th>
									<th scope='col'>Item</th>
									<th scope='col'>Amount</th>
									<th scope='col'>Status</th>
								</tr>
							</thead>
							<tbody>
								{invoices &&
									invoices.length > 0 &&
									invoices.map((inv, id) => (
										<tr key={id}>
											<td>{new Date(inv.created * 1000).getDate() + '/' + (new Date(inv.created * 1000).getMonth() + 1) + '/' + new Date(inv.created * 1000).getFullYear()}</td>

											<td>Intro</td>
											<td>$19.00</td>
											<td>
												<span className={['badge', inv.status === 'paid' ? ' bg-success' : ' bg-secondary'].join('')}>{inv.status}</span>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Billing;

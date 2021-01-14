import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addPlan, deletePlan, updatePlan } from '../../context/revenue-service';
import { AuthContext } from '../../context/context';
import { getRevenue } from '../../context/fetch-service';
import { colors } from '../../context/colors';
import moment from 'moment';

function RevenueInputs({ revenues, setMsg, setErr, setAlertClass, chartValue }) {
	const { state, dispatch } = React.useContext(AuthContext);
	const [open, setOpen] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [edit, setEdit] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const [revenueForm, setRevenueForm] = React.useState({
		plan: '',
		price: '',
		purchasers: '',
		type: 'Yearly',
		date: '',
	});

	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
		setEdit(false);
		setRevenueForm({
			plan: '',
			price: '',
			purchasers: '',
			type: 'Yearly',
			date: '',
		});
	};

	const handleRevenueChange = (e) => {
		const { name, value } = e.target;
		setRevenueForm((prevState) => {
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
			if (edit) {
				let update = await updatePlan({ revenueId: revenueForm.revenueId, revenueInputId: revenueForm.revenueInputId, data: revenueForm });
				if (update.status === 200 || update.status === 201) {
					let revenues = await getRevenue();
					dispatch({
						type: 'SET_REVENUE',
						payload: revenues,
					});

					setAlertClass('show');
					setMsg(update.data.message);
					setErr('');
					setEdit(false);
					setLoader(false);
					dispatch({ type: 'VIEW_DATA', payload: chartValue });
				}
			} else {
				revenueForm.color = colors[Math.floor(Math.random() * colors.length - 1)];
				let add = await addPlan(revenueForm);
				if (add.status === 200 || add.status === 201) {
					let revenues = await getRevenue();
					dispatch({
						type: 'SET_REVENUE',
						payload: revenues,
					});

					setAlertClass('show');
					setMsg(add.data.message);
					setErr('');
					setLoader(false);
					dispatch({ type: 'VIEW_DATA', payload: chartValue });
				}
			}
		} catch (err) {
			setAlertClass('show');
			setMsg('');
			console.log(e);
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
		}
		setRevenueForm({
			plan: '',
			price: '',
			purchasers: '',
			type: 'Yearly',
			date: '',
		});
		setOpen(false);
	};

	const handleDeletePlan = async (data) => {
		try {
			let deletePlanRes = await deletePlan(data);

			if (deletePlanRes.status === 200) {
				let revenues = await getRevenue();
				dispatch({
					type: 'SET_REVENUE',
					payload: revenues,
				});

				setAlertClass('show');
				setMsg(deletePlanRes.data.message);
				setErr('');
				dispatch({ type: 'VIEW_DATA', payload: chartValue });
			}
		} catch (e) {
			setAlertClass('show');
			setMsg('');
			if (e.response && e.response.data) {
				if (e.response.data.error) {
					setErr(e.response.data.error.message);
				} else if (e.response.data.errors) {
					console.log(e.response.data.errors);
					let errors = e.response.data.errors.map((err) => <li>{err.msg}</li>);
					setErr(errors);
				} else {
					setErr(e.response.data.message);
				}
			} else {
				setErr(e.message);
			}
		}
		setOpen(false);
	};

	const handleEditPlan = (revenueId, revenueInputId, rev) => {
		setEdit(true);
		setOpen(true);
		setRevenueForm({
			plan: rev.plan,
			price: rev.price,
			purchasers: rev.purchasers,
			type: rev.type,
			date: rev.date ? moment(rev.date).format('YYYY-MM-DD') : new Date(),
			revenueId,
			revenueInputId,
		});
	};
	return (
		<div className='card'>
			<div>
				<div className='table-responsive'>
					<table className='table table-sm table-hover table-nowrap mb-0'>
						<thead>
							<tr>
								<th scope='col'>Plan Name</th>
								<th scope='col'>Price</th>
								<th scope='col'>purchasers</th>
								<th scope='col'>Annually vs Monthly</th>
								<th scope='col'>
									<i title='Add Plan' onClick={handleClickOpen} style={{ fontSize: '22px', cursor: 'pointer' }} className='fe fe-plus add-icon'></i>
									<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
										<DialogTitle id='alert-dialog-title'>{edit ? 'Edit Plan' : 'Add Plan'}</DialogTitle>

										<form onSubmit={handleSubmit}>
											<DialogContent>
												<div className='row g-3'>
													<div className='col-12 col-md-6 mb-3'>
														<label htmlFor='plan' className='form-label'>
															Plan
														</label>
														<input type='text' name='plan' value={revenueForm.plan} onChange={handleRevenueChange} className='form-control' id='plan' placeholder='Plan' required />
													</div>
													<div className='col-12 col-md-6 mb-3'>
														<label htmlFor='price' className='form-label'>
															Price
														</label>
														<input type='text' name='price' value={revenueForm.price} onChange={handleRevenueChange} className='form-control' id='price' placeholder='Price' required />
													</div>
												</div>

												<div className='row g-3'>
													<div className='col-12 col-md-12 mb-3'>
														<label htmlFor='purchasers' className='form-label'>
															Purchasers
														</label>
														<input type='text' name='purchasers' value={revenueForm.purchasers} onChange={handleRevenueChange} className='form-control' id='purchasers' placeholder='Purchasers' required />
													</div>
												</div>
												<div className='row g-3'>
													<div className='col-6 col-md-6 mb-3'>
														<label htmlFor='type' className='form-label'>
															Type
														</label>
														<select name='type' onChange={handleRevenueChange} className='form-control' id='type' placeholder='Password' required>
															<option selected={revenueForm.type === 'Yearly'} value='Yearly'>
																Yearly
															</option>
															<option selected={revenueForm.type === 'Quarter'} value='Quarter'>
																Quarter
															</option>
															<option selected={revenueForm.type === 'Monthly'} value='Monthly'>
																Monthly
															</option>
														</select>
													</div>
													<div className='col-6 col-md-6 mb-3'>
														<label htmlFor='date' className='form-label'>
															Date
														</label>
														<input type='date' name='date' value={revenueForm.date} onChange={handleRevenueChange} className='form-control' id='date' placeholder='Date' />
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
													{!loader && (edit ? 'Update Plan' : 'Add Plan')}
												</button>
											</DialogActions>
										</form>
									</Dialog>
								</th>
							</tr>
						</thead>
						<tbody>
							{revenues &&
								revenues.revenuInputs &&
								revenues.revenuInputs.length > 0 &&
								revenues.revenuInputs.map((rev, id) => (
									<tr key={id}>
										<td>{rev.plan}</td>
										<td>${rev.price}</td>
										<td>{rev.purchasers}</td>
										<td>{rev.type}</td>
										<td>
											<span>
												<i title='Edit Plan' style={{ cursor: 'pointer' }} className='fe fe-edit edit-icon' onClick={() => handleEditPlan(revenues._id, rev._id, rev)}></i>
												<i title='Delete Plan' style={{ cursor: 'pointer' }} onClick={() => handleDeletePlan({ revenueId: revenues._id, revenueInputId: rev._id })} className='fe fe-trash-2 delete-icon'></i>
											</span>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default RevenueInputs;

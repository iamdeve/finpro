import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import { AuthContext } from '../../context/context';
import { getRevenue } from '../../context/fetch-service';
import { addExpense, deleteExpense, updateExpense } from '../../context/revenue-service';

function ExpenseInputs({ revenueId, expenseInputs, setMsg, setErr, setAlertClass }) {

	const { state, dispatch } = React.useContext(AuthContext);

	const [open, setOpen] = React.useState(false);
	const [open2, setOpen2] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [edit, setEdit] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClickOpen2 = () => {
		setOpen2(true);
	};

	const [expenseForm, setExpenseForm] = React.useState({
		value: '',
		cost: '',
	});

	const handleClose2 = (e) => {
		e.preventDefault();
		setOpen2(false);
		setEdit(false);
		setExpenseForm({
			value: '',
			cost: '',
		});
	};
	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
		setEdit(false);
		setExpenseForm({
			value: '',
			cost: '',
		});
	};

	const handleRevenueChange = (e) => {
		const { name, value } = e.target;
		setExpenseForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (e, heading) => {
		e.preventDefault();

		setLoader(true);
		try {
			if (edit) {
				let update = await updateExpense({ revenueId, expenseInputId: expenseForm.expenseInputId, data: expenseForm });
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
				}
			} else {
				let add = await addExpense({ ...expenseForm, revenueId, heading });
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
		setExpenseForm({
			value: '',
			cost: '',
		});
		setOpen(false);
		setOpen2(false);
	};

	const handleDeletePlan = async (majorExpenseInputId) => {
		try {
			let deletePlanRes = await deleteExpense({ revenueId, majorExpenseInputId });

			if (deletePlanRes.status === 200) {
				let revenues = await getRevenue();
				dispatch({
					type: 'SET_REVENUE',
					payload: revenues,
				});

				setAlertClass('show');
				setMsg(deletePlanRes.data.message);
				setErr('');
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

	const handleEditPlan = (expenseInputId, expInp) => {
		setEdit(true);
		setOpen(true);
		setExpenseForm({
			value: expInp.value,
			cost: expInp.cost,
			expenseInputId,
		});
	};

	return (
		<div>
			<div className='card'>
				<div>
					<div className='table-responsive'>
						<table className='table table-sm table-hover table-nowrap mb-0'>
							<thead>
								<tr>
									<th scope='col'>Credit Card Porcessing Fees</th>
									<th scope='col'>Cost</th>
									<th scope='col'>
										<i title='Add Major Expense' style={{ fontSize: '22px' }} onClick={handleClickOpen} className='fe fe-plus add-icon'></i>
										<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
											<DialogTitle id='alert-dialog-title'>{edit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
											<form onSubmit={(e) => handleSubmit(e, 'creditCardProcessingFees')}>
												<DialogContent>
													<div className='row g-3'>
														<div className='col-12 col-md-12 mb-3'>
															<label htmlFor='value' className='form-label'>
																Credit Card Processing Fees
															</label>
															<input type='text' name='value' value={expenseForm.value} onChange={handleRevenueChange} className='form-control' id='value' placeholder='Credit Card Processing Fees' required />
														</div>
													</div>
													<div className='row g-3'>
														<div className='col-12 col-md-12 mb-3'>
															<label htmlFor='cost' className='form-label'>
																Cost
															</label>
															<input type='text' name='cost' value={expenseForm.cost} onChange={handleRevenueChange} className='form-control' id='cost' placeholder='Cost' required />
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
														{!loader && (edit ? 'Update Expense' : 'Add Expense')}
													</button>
												</DialogActions>
											</form>
										</Dialog>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'creditCardProcessingFees')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>
													<span>
														<i className='fe fe-edit edit-icon' onClick={() => handleEditPlan(expInp._id, expInp)}></i>
														<i className='fe fe-trash-2 delete-icon' onClick={() => handleDeletePlan(expInp._id)}></i>
													</span>
												</td>
											</tr>
										))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className='card'>
				<div>
					<div className='table-responsive'>
						<table className='table table-sm table-hover table-nowrap mb-0'>
							<thead>
								<tr>
									<th scope='col'>Paid User Acquisition</th>
									<th scope='col'>Cost</th>
									<th scope='col'>
										<i title='Add Major' style={{ fontSize: '22px' }} onClick={handleClickOpen2} className='fe fe-plus add-icon'></i>
										<Dialog open={open2} onClose={handleClose2} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
											<DialogTitle id='alert-dialog-title'>{edit ? 'Edit Expense' : 'Add Plan'}</DialogTitle>
											<form onSubmit={(e) => handleSubmit(e, 'paidUserAcquisition')}>
												<DialogContent>
													<div className='row g-3'>
														<div className='col-12 col-md-12 mb-3'>
															<label htmlFor='value' className='form-label'>
																Paid User Acquisition
															</label>
															<input type='text' name='value' value={expenseForm.value} onChange={handleRevenueChange} className='form-control' id='value' placeholder='Credit Card Processing Fees' required />
														</div>
													</div>
													<div className='row g-3'>
														<div className='col-12 col-md-12 mb-3'>
															<label htmlFor='cost' className='form-label'>
																Cost
															</label>
															<input type='text' name='cost' value={expenseForm.cost} onChange={handleRevenueChange} className='form-control' id='cost' placeholder='Cost' required />
														</div>
													</div>
												</DialogContent>
												<DialogActions>
													<button className='btn btn-danger' onClick={handleClose2}>
														Cancel
													</button>
													<button disabled={loader} type='submit' className='btn btn-primary' autoFocus>
														{loader && (
															<div className='spinner-border spinner-border-sm' role='status'>
																<span className='sr-only'>Loading...</span>
															</div>
														)}
														{!loader && (edit ? 'Update Expense' : 'Add Expense')}
													</button>
												</DialogActions>
											</form>
										</Dialog>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'paidUserAcquisition')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>
													<span>
														<i className='fe fe-edit edit-icon' onClick={() => handleEditPlan(expInp._id, expInp)}></i>
														<i className='fe fe-trash-2 delete-icon' onClick={() => handleDeletePlan(expInp._id)}></i>
													</span>
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

export default ExpenseInputs;

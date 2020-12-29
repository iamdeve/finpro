import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AuthContext } from '../../context/context';
import { getInputs } from '../../context/fetch-service';
import { addInputExpense, deleteInputExpense, updateInputExpense } from '../../context/input-service';

function ExpenseInputs({ marketingId, expenseInputs, setMsg, setErr, setAlertClass }) {
	const { state, dispatch } = React.useContext(AuthContext);

	const [open, setOpen] = React.useState(false);
	const [dialogSetting, setDialogSetting] = React.useState({
		title: '',
		buttonTitle: '',
		heading: '',
		type: '',
	});
	const [loader, setLoader] = React.useState(false);
	const [edit, setEdit] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const [expenseForm, setExpenseForm] = React.useState({
		value: '',
		cost: '',
		perEmployee: '',
		date: '',
	});

	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
		setEdit(false);
		setExpenseForm({
			value: '',
			cost: '',
		});
	};

	const handleInputChange = (e) => {
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
				let update = await updateInputExpense({ inputMainId: marketingId, inputId: expenseForm.inputId, data: expenseForm });
				if (update.status === 200 || update.status === 201) {
					let inputs = await getInputs();
					dispatch({
						type: 'SET_INPUTS',
						payload: inputs,
					});

					setAlertClass('show');
					setMsg(update.data.message);
					setErr('');
					setEdit(false);
					setLoader(false);
				}
			} else {
				let add = await addInputExpense({ ...expenseForm, inputMainId: marketingId, heading });
				if (add.status === 200 || add.status === 201) {
					let inputs = await getInputs();
					dispatch({
						type: 'SET_INPUTS',
						payload: inputs,
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
			perEmployee: '',
			date: '',
		});
		setOpen(false);
	};

	const handleDeletePlan = async (inputId) => {
		try {
			let deletePlanRes = await deleteInputExpense({ inputMainId: marketingId, inputId });

			if (deletePlanRes.status === 200) {
				let inputs = await getInputs();
				dispatch({
					type: 'SET_INPUTS',
					payload: inputs,
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

	const handleEditPlan = (expInp) => {
		setEdit(true);
		setOpen(true);
		setExpenseForm({
			value: expInp.value,
			cost: expInp.cost,
			perEmployee: expInp.perEmployee,
			date: expInp.date,
			inputId: expInp._id,
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>{edit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
				<form onSubmit={(e) => handleSubmit(e, dialogSetting.heading)}>
					<DialogContent>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='value' className='form-label'>
									{dialogSetting.title}
								</label>
								<input type='text' name='value' value={expenseForm.value} onChange={handleInputChange} className='form-control' id='value' placeholder='Credit Card Processing Fees' required />
							</div>
						</div>
						<div className='row g-3'>
							<div className='col-12 col-md-12 mb-3'>
								<label htmlFor='cost' className='form-label'>
									Cost
								</label>
								<input type='text' name='cost' value={expenseForm.cost} onChange={handleInputChange} className='form-control' id='cost' placeholder='Cost' required />
							</div>
						</div>
						<div className='row g-3'>
							{dialogSetting.type === 'date' ? (
								<div className='col-12 col-md-12 mb-3'>
									<label htmlFor='date' className='form-label'>
										Date
									</label>
									<input type='date' name='date' value={expenseForm.date} onChange={handleInputChange} className='form-control' id='date' placeholder='Date' />
								</div>
							) : (
								dialogSetting.employee && (
									<div className='col-12 col-md-12 mb-3'>
										<label htmlFor='perEmployee' className='form-label'>
											{dialogSetting.employee}
										</label>
										<input type='text' name='perEmployee' value={expenseForm.perEmployee} onChange={handleInputChange} className='form-control' id='perEmployee' placeholder={dialogSetting.employee} />
									</div>
								)
							)}
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

			<div className='card'>
				<div>
					<div className='table-responsive'>
						<table className='table table-sm table-hover table-nowrap mb-0'>
							<thead>
								<tr>
									<th scope='col'>Tradeshows</th>
									<th scope='col'>Cost (per quarter)</th>

									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Tradeshows',
													heading: 'tradeShows',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'tradeShows')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Tradeshows',
																	heading: 'tradeShows',
																});
																handleEditPlan(expInp);
															}}></i>
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
									<th scope='col'>Online Marketing</th>
									<th scope='col'>Cost (per month)</th>

									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Online Marketing',
													heading: 'onlineMarketing',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'onlineMarketing')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Online Marketing',
																	heading: 'onlineMarketing',
																});
																handleEditPlan(expInp);
															}}></i>
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
									<th scope='col'>Equipment & Telecom</th>
									<th scope='col'>Cost</th>
									<th scope='col'>Per new Employee</th>
									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Equipment & Telecom',
													employee: 'Per New Employee',
													buttonTitle: '',
													heading: 'equipmentAndTelecom',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'equipmentAndTelecom')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>{expInp.perEmployee}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Equipment & Telecom',
																	employee: 'Per New Employee',
																	buttonTitle: '',
																	heading: 'equipmentAndTelecom',
																});
																handleEditPlan(expInp);
															}}></i>
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
									<th scope='col'>Dues & Subscriptions</th>
									<th scope='col'>Cost</th>
									<th scope='col'>
										Per new Employee <br /> (per month)
									</th>
									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Dues & Subscription',
													employee: 'Per New Employee',
													buttonTitle: '',
													heading: 'duesAnsSubscriptions',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'duesAnsSubscriptions')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>{expInp.perEmployee}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Dues & Subscriptions',
																	employee: 'Per New Employee',
																	buttonTitle: '',
																	heading: 'duesAnsSubscriptions',
																});
																handleEditPlan(expInp);
															}}></i>
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
									<th scope='col'>Travel & Entertainment</th>
									<th scope='col'>Cost</th>
									<th scope='col'>Per Employee (per month)</th>
									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Travel & Entertainment',
													employee: 'Per New Employee',
													buttonTitle: '',
													heading: 'travelAndEntertainment',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'travelAndEntertainment')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>{expInp.perEmployee}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Travel & Entertainments',
																	employee: 'Per New Employee',
																	buttonTitle: '',
																	heading: 'travelAndEntertainment',
																});
																handleEditPlan(expInp);
															}}></i>
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
									<th scope='col'>Others</th>
									<th scope='col'>Cost</th>
									<th scope='col'>Date</th>
									<th scope='col'>
										<i
											title='Add Major Expense'
											style={{ fontSize: '22px' }}
											onClick={() => {
												setDialogSetting({
													title: 'Others',
													employee: 'Cost',
													type: 'date',
													buttonTitle: '',
													heading: 'others',
												});
												handleClickOpen();
											}}
											className='fe fe-plus add-icon'></i>
									</th>
								</tr>
							</thead>
							<tbody>
								{expenseInputs &&
									expenseInputs
										.filter((exp) => exp.heading === 'others')
										.map((expInp, id) => (
											<tr key={id}>
												<td>{expInp.value}</td>
												<td>${expInp.cost}</td>
												<td>{expInp.date}</td>
												<td>
													<span>
														<i
															className='fe fe-edit edit-icon'
															onClick={() => {
																setDialogSetting({
																	title: 'Others',
																	employee: 'Cost',
																	type: 'date',
																	buttonTitle: '',
																	heading: 'others',
																});
																handleEditPlan(expInp);
															}}></i>
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

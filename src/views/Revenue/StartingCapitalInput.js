import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addStartingCapital, deleteStartignCapital, updateStartingCapital } from '../../context/revenue-service';
import { AuthContext } from '../../context/context';
import { getRevenue } from '../../context/fetch-service';

function StartingCapitalInput({ revenueId, startingCapital, setMsg, setErr, setAlertClass }) {
	const { state, dispatch } = React.useContext(AuthContext);
	const [open, setOpen] = React.useState(false);
	const [loader, setLoader] = React.useState(false);
	const [edit, setEdit] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const [startingCapitalForm, setStartingCapitalForm] = React.useState({
		source: '',
		amount: '',
	});

	const handleClose = (e) => {
		e.preventDefault();
		setOpen(false);
		setEdit(false);
		setStartingCapitalForm({
			source: '',
			amount: '',
		});
	};

	const handleRevenueChange = (e) => {
		const { name, value } = e.target;
		setStartingCapitalForm((prevState) => {
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
				let update = await updateStartingCapital({ revenueId: revenueId, startingCapitalId: startingCapitalForm.startingCapitalId, data: startingCapitalForm });
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
				let add = await addStartingCapital({ ...startingCapitalForm, revenueId });
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
		setStartingCapitalForm({
			source: '',
			amount: '',
		});
		setOpen(false);
	};

	const handleDeletePlan = async (startingCapitalId) => {
		try {
			let deletePlanRes = await deleteStartignCapital({ revenueId, startingCapitalId });

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

	const handleEditPlan = (startingCapitalId, rev) => {
		setEdit(true);
		setOpen(true);
		setStartingCapitalForm({
			source: rev.source,
			amount: rev.amount,
			startingCapitalId,
		});
	};

	return (
		<div className='card'>
			<div>
				<div className='table-responsive'>
					<table className='table table-sm table-hover table-nowrap mb-0'>
						<thead>
							<tr>
								<th scope='col'>Source</th>
								<th scope='col'>Amount</th>
								<th scope='col'>
									<i title='Add Plan' onClick={handleClickOpen} style={{ fontSize: '22px', cursor: 'pointer' }} className='fe fe-plus add-icon'></i>
									<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
										<DialogTitle id='alert-dialog-title'>{edit ? 'Edit Starting Capital' : 'Add Starting Capital'}</DialogTitle>

										<form onSubmit={handleSubmit}>
											<DialogContent>
												<div className='row g-3'>
													<div className='col-12 col-md-12 mb-3'>
														<label htmlFor='source' className='form-label'>
															Source
														</label>
														<input type='text' name='source' value={startingCapitalForm.source} onChange={handleRevenueChange} className='form-control' id='source' placeholder='Source' required />
													</div>
												</div>
												<div className='row g-3'>
													<div className='col-12 col-md-12 mb-3'>
														<label htmlFor='amount' className='form-label'>
															Amount
														</label>
														<input type='text' name='amount' value={startingCapitalForm.amount} onChange={handleRevenueChange} className='form-control' id='amount' placeholder='Amount' required />
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
													{!loader && (edit ? 'Update Starting Capital' : 'Add Starting Capital')}
												</button>
											</DialogActions>
										</form>
									</Dialog>
								</th>
							</tr>
						</thead>
						<tbody>
							{startingCapital &&
								startingCapital.map((rev, id) => (
									<tr key={id}>
										<td>{rev.source}</td>
										<td>${rev.amount}</td>
										<td>
											<span>
												<i title='Edit Plan' style={{ cursor: 'pointer' }} className='fe fe-edit edit-icon' onClick={() => handleEditPlan(rev._id, rev)}></i>
												<i title='Delete Plan' style={{ cursor: 'pointer' }} onClick={() => handleDeletePlan(rev._id)} className='fe fe-trash-2 delete-icon'></i>
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

export default StartingCapitalInput;

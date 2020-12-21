import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext, getMonth } from '../../context/context';
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

require('../../RoundedBars');

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

const BootstrapInput = withStyles((theme) => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '10px 26px 10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#80bdff',
			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
		},
	},
}))(InputBase);

function Marketing() {
	const history = useHistory();
	const classes = useStyles();
	const {
		state: { salesData, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);
	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
		dispatch({ type: 'VIEW_DATA', payload: { type: event.target.value, flag: 'salesData' } });
	};
	React.useEffect(() => {
		dispatch({ type: 'VIEW_DATA', payload: { type: 'year', flag: 'salesData' } });
		if (!isAuthenticated) {
			history.push('/login');
		}
	}, [isAuthenticated, history, dispatch]);

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [salesForm, setSalesForm] = React.useState({
		hire: '',
		startDate: '',
		salery: '',
		taxes: '',
		commissions: '',
	});

	const handleSalesChange = (e) => {
		const { name, value } = e.target;
		setSalesForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch({
			type: 'Add_SALES',
			payload: salesForm,
		});
		setSalesForm({});
		setOpen(false);
		dispatch({ type: 'VIEW_DATA', payload: { type: 'year', flag: 'salesData' } });
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12 col-xl-12'>
					<div className='card'>
						<div className='card-body'>
							<button onClick={handleClickOpen} className='btn btn-primary'>
								Add Marketing
							</button>
						</div>
						<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogTitle id='alert-dialog-title'>{'Add Marketing'}</DialogTitle>
							<form onSubmit={handleSubmit}>
								<DialogContent>
									<div className='row g-3'>
										<div className='col-12 col-md-6 mb-3'>
											<label htmlFor='hire' className='form-label'>
												Hire
											</label>
											<input type='text' name='hire' value={salesForm.hire} onChange={handleSalesChange} className='form-control' id='hire' placeholder='Hire' required />
										</div>
										<div className='col-6 col-md-6 mb-3'>
											<label htmlFor='startDate' className='form-label'>
												Start Date
											</label>
											<input type='date' name='startDate' value={salesForm.startDate} onChange={handleSalesChange} className='form-control' id='startDate' placeholder='Start Date' required />
										</div>
									</div>

									<div className='row g-3'>
										<div className='col-6 col-md-6 mb-3'>
											<label htmlFor='salery' className='form-label'>
												Salery
											</label>
											<input type='text' name='salery' value={salesForm.salery} onChange={handleSalesChange} className='form-control' id='salery' placeholder='Salery' required />
										</div>
										<div className='col-6 col-md-6 mb-3'>
											<label htmlFor='taxes' className='form-label'>
												Taxes
											</label>
											<input type='text' name='taxes' value={salesForm.taxes} onChange={handleSalesChange} className='form-control' id='taxes' placeholder='Taxes' required />
										</div>
									</div>
									<div className='row g-3'>
										<div className='col-12 col-md-12 mb-3'>
											<label htmlFor='commission' className='form-label'>
												Commissions
											</label>
											<input type='text' name='commissions' value={salesForm.commissions} onChange={handleSalesChange} className='form-control' id='commission' placeholder='Commission' required />
										</div>
									</div>
								</DialogContent>
								<DialogActions>
									<button className='btn btn-danger' onClick={handleClose}>
										Cancel
									</button>
									<button type='submit' className='btn btn-primary' autoFocus>
										Add
									</button>
								</DialogActions>
							</form>
						</Dialog>
					</div>
				</div>
				<div className='col-12 col-xl-12'>
					<div className='card'>
						<div className='card-header'>
							<h4 className='card-header-title'>Marketing</h4>
							<span className='text-muted mr-3'>View By:</span>
							<FormControl variant='outlined' className={classes.margin}>
								<NativeSelect id='demo-customized-select-native' value={chartValue} onChange={handleChange} input={<BootstrapInput />}>
									<option defaultValue='Year' value='year'>
										Year
									</option>
									<option value='quarter'>Quarter</option>
									<option value='month'>Month</option>
								</NativeSelect>
							</FormControl>
						</div>
						<div className='card-body'>
							<Bar
								height={400}
								data={data}
								options={{
									tooltips: {
										callbacks: {
											title: function (tooltipItem, data) {
												return data['labels'][tooltipItem[0]['index']];
											},
											label: function (tooltipItem, data) {
												return data['datasets'][0]['data'][tooltipItem['index']] + '%';
											},
											afterLabel: function (tooltipItem, data) {},
										},
										backgroundColor: '#FFF',
										borderWidth: 2,
										xPadding: 15,
										yPadding: 15,
										borderColor: '#ddd',
										titleFontSize: 16,
										titleFontColor: '#0066ff',
										bodyFontColor: '#000',
										bodyFontSize: 14,
										displayColors: false,
									},
									cornerRadius: 20,
									maintainAspectRatio: false,
									scales: {
										yAxes: [
											{
												ticks: {
													callback: function (value) {
														return value + '%';
													},
													beginAtZero: true,
												},
												gridLines: {
													borderDash: [2],
													zeroLineColor: 'transparent',
													zeroLineWidth: 0,
												},
											},
										],
										xAxes: [
											{
												categorySpacing: 0,
												barThickness: 10,
												gridLines: {
													lineWidth: 0,
													zeroLineColor: 'transparent',
												},
											},
										],
									},
								}}
								legend={{ display: false }}
							/>
						</div>
					</div>
				</div>

				<div className='col-7 col-xl-7'>
					<div className='row'>
						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Inputs</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Hire</th>
													<th scope='col'>Start Date</th>
													<th scope='col'>Salary</th>
													<th scope='col'>Taxes</th>
													<th scope='col'>Commissions</th>
													<th scope='col'></th>
												</tr>
											</thead>
											<tbody>
												{salesData.map((sd, id) => (
													<tr key={id}>
														<td>{sd.hire}</td>
														<td>{`${getMonth(new Date(sd.startDate).getMonth() + 1)} ${new Date(sd.startDate).getFullYear()}`}</td>
														<td>${sd.salery}</td>
														<td>{sd.taxes}%</td>
														<td>${sd.commissions}</td>
														<td>
															<span>
																<i className='fe fe-edit'></i> <i className='fe fe-x-square'></i>
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

						<div className='col-8 col-xl-8'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Inputs</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Contractor</th>
													<th scope='col'>Cost (per month)</th>
													<th scope='col'></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>McKinsey & Company</td>
													<td>$6,000</td>
													<td>
														<span>
															<i className='fe fe-edit'></i> <i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-5 col-xl-5'>
					<div className='row'>
						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Tradeshows</th>
													<th scope='col'>Cost (per quarter)</th>

													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Tradeshow 1</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>Other Collateral</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Online Marketing</th>
													<th scope='col'>Cost (per month)</th>
													<th></th>
													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>SEO</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>SEM</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>Load Gen</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Equipment & Telecom</th>
													<th scope='col'>Cost</th>
													<th scope='col'>per new employee</th>
													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Computer</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>Cell Phone</td>
													<td>$1,800</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Dues and Subscription</th>
													<th scope='col'>Cost</th>
													<th scope='col'>
														per new employee <br /> (per month)
													</th>
													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Software 1</td>
													<td>$50</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>Software 2</td>
													<td>$76</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Travel & Entertainment</th>
													<th scope='col'>Cost</th>
													<th scope='col'>
														per new employee <br /> (per month)
													</th>
													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Expense 1</td>
													<td>$1000</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

						<div className='col-12 col-xl-12'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>Marketing Cost</h4>
								</div>
								<div className='card-body'>
									<div className='table-responsive'>
										<table className='table table-sm table-hover table-nowrap mb-0'>
											<thead>
												<tr>
													<th scope='col'>Other</th>
													<th scope='col'>Cost</th>
													<th scope='col'>Date</th>
													<th scope='col'>
														<i className='fe fe-plus'></i>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Other 1</td>
													<td>$50</td>
													<td>12/20/2021</td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
												<tr>
													<td>Other 2</td>
													<td>$76</td>
													<td></td>
													<td>
														<span>
															<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Marketing;

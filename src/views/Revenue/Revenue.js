import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
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

function Revenue() {
	const history = useHistory();
	const classes = useStyles();
	const {
		state: { revenueData, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);
	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
		dispatch({ type: 'VIEW_DATA', payload: { type: event.target.value, flag: 'revenueData' } });
	};
	React.useEffect(() => {
		dispatch({ type: 'VIEW_DATA', payload: { type: 'year', flag: 'revenueData' } });
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

	const [revenueForm, setRevenueForm] = React.useState({
		plan: '',
		price: '',
		purchasers: '',
		type: '',
		date: '',
	});

	const handleRevenueChange = (e) => {
		const { name, value } = e.target;
		setRevenueForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch({
			type: 'Add_REVENUE',
			payload: { ...revenueForm },
		});
		setRevenueForm({});
		setOpen(false);
		dispatch({ type: 'VIEW_DATA', payload: { type: chartValue, flag: 'revenueData' } });
	};
	console.log(revenueData);
	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12 col-xl-12'>
					<div className='card'>
						<div className='card-body'>
							<button onClick={handleClickOpen} className='btn btn-primary'>
								Add Revenue
							</button>
						</div>
						<Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
							<DialogTitle id='alert-dialog-title'>{'Add Revenue'}</DialogTitle>
							<form onSubmit={handleSubmit}>
								<DialogContent>
									<div className='row g-3'>
										<div className='col-12 col-md-6 mb-3'>
											<label htmlFor='plaln' className='form-label'>
												Plan
											</label>
											<input type='text' name='plan' value={revenueForm.plan} onChange={handleRevenueChange} className='form-control' id='plan' placeholder='Plan' required />
										</div>
										<div className='col-12 col-md-6 mb-3'>
											<label htmlFor='Price' className='form-label'>
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
												<option selected value='anually'>
													Anually
												</option>
												<option value='monthly'>Monthly</option>
											</select>
										</div>
										<div className='col-6 col-md-6 mb-3'>
											<label htmlFor='date' className='form-label'>
												Date
											</label>
											<input type='date' name='date' value={revenueForm.date} onChange={handleRevenueChange} className='form-control' id='date' placeholder='Date' required />
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
							<h4 className='card-header-title'>Revenue</h4>
							<span className='text-muted mr-3'>View By:</span>
							<FormControl variant='outlined' className={classes.margin}>
								<NativeSelect id='demo-customized-select-native' value={chartValue} onChange={handleChange} input={<BootstrapInput />}>
									<option defaultValue='year' value='year'>
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
									legendCallback: function (chart) {
										alert('he');
										var text = [];
										text.push('<ul class="' + chart.id + '-legend">');
										for (var i = 0; i < chart.data.datasets.length; i++) {
											text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
											if (chart.data.datasets[i].label) {
												text.push(chart.data.datasets[i].label);
											}
											text.push('</li>');
										}
										text.push('</ul>');
										return text.join('');
									},
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

				<div className='col-8 col-xl-7'>
					<div className='card'>
						<div className='card-header'>
							<h4 className='card-header-title'>Revenue Inputs</h4>
						</div>
						<div className='card-body'>
							<div className='table-responsive'>
								<table className='table table-sm table-hover table-nowrap mb-0'>
									<thead>
										<tr>
											<th scope='col'>Play Name</th>
											<th scope='col'>Price</th>
											<th scope='col'>purchasers</th>
											<th scope='col'>Annually vs Monthly</th>
											<th scope='col'></th>
										</tr>
									</thead>
									<tbody>
										{revenueData.map((rev, id) => (
											<tr key={id}>
												<td>{rev.plan}</td>
												<td>${rev.price}</td>
												<td>{rev.purchasers}</td>
												<td>{rev.type}</td>
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
				<div className='col-4 col-xl-5'>
					<div className='card'>
						<div className='card-header'>
							<h4 className='card-header-title'>Revenue Costs</h4>
						</div>
						<div className='card-body'>
							<div className='table-responsive'>
								<table className='table table-sm table-hover table-nowrap mb-0'>
									<thead>
										<tr>
											<th scope='col'>Revenue Drivers</th>
											<th scope='col'>
												Cost <br />
												(PER NEW EMPLOYEE)
											</th>
											<th scope='col'>
												<i className='fe fe-plus'></i>
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Subsctiption 1</td>
											<td>$1,800</td>
											<td>
												<span>
													<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
												</span>
											</td>
										</tr>
										<tr>
											<td>Subsctiption 1</td>
											<td>$1,800</td>
											<td>
												{' '}
												<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
											</td>
										</tr>
										<tr>
											<td>Subsctiption 1</td>
											<td>$1,800</td>
											<td>
												{' '}
												<i className='fe fe-edit'></i> |<i className='fe fe-x-square'></i>
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
	);
}

export default Revenue;

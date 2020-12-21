import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';
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
		state: { isAuthenticated },
	} = React.useContext(AuthContext);
	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
	};
	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
	}, [isAuthenticated, history]);

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12 col-xl-12'>
					<div className='card'>
						<div className='card-body'>
							<button className='btn btn-primary'>Add Marketing</button>
						</div>
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
								data={{
									labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12'],
									datasets: [
										{
											label: '2020',
											data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32],
											backgroundColor: '#0F75FA',
										},
										{
											label: '2019',
											data: [15, 10, 20, 12, 7, 0, 8, 16, 18, 16, 10, 22],
											backgroundColor: '#0F75FA',
											hidden: true,
											borderWidth: 1,
										},
									],
								}}
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
												<tr>
													<td>Jorda-Lee Jennings</td>
													<td>Mar 2021</td>
													<td>$156,000</td>
													<td>CA-15%</td>
													<td>$5678.00</td>
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

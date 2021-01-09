import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import { ButtonGroup, Button } from 'react-bootstrap';
import { getRevenue } from '../../context/fetch-service';

import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import RevenueInputs from './RevenueInputs';
import ExpenseInputs from './ExpenseInputs';
import numeral from 'numeral';
import StartingCapitalInput from './StartingCapitalInput';

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
		backgroundColor: '#f8f9fa',
		// border: '1px solid #ced4da',
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
	const classes = useStyles();
	const history = useHistory();
	const {
		state: { purchasing, revenues, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);
	const userSub = purchasing && purchasing.length > 0 ? purchasing.filter((sub) => sub.status === 'active') : [];
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [alertClass, setAlertClass] = React.useState(userSub && userSub.length > 0 ? '' : 'show');
	const [chartLoader, setChartLoader] = React.useState(true);

	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartLoader(true);
		setChartValue(event.target.value);
	};

	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
		setMsg('');
	};

	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
		async function fetchRevenue() {
			let revenues = await getRevenue();
			dispatch({
				type: 'SET_REVENUE',
				payload: revenues,
			});
			setTimeout(() => {
				// console.log(revenues);
				if (revenues && revenues.revenuInputs && revenues.revenuInputs.length > 0) {
					dispatch({ type: 'VIEW_DATA', payload: chartValue });
				}
				setChartLoader(false);
			}, 1000);
		}
		fetchRevenue();
	}, [isAuthenticated, history, dispatch, chartValue]);

	const generatePdf = () => {
		if (revenues && revenues.revenuInputs && revenues.revenuInputs.length > 0) {
			let type = 'Yearly';
			if (chartValue === 'quarter') {
				type = 'Quarter';
			} else if (chartValue === 'month') {
				type = 'Monthly';
			}
			const doc = new jsPDF();

			// define the columns we want and their titles
			const tableColumn = ['Id', 'Plan', 'Price', 'Purchasers', 'type'];
			// define an empty array of rows
			const tableRows = [];
			// for each ticket pass all its data into an array
			revenues.revenuInputs
				.filter((rev) => rev.type === type)
				.forEach((reve) => {
					const reveData = [
						reve._id,
						reve.plan,
						reve.price,
						reve.purchasers,
						reve.type,
						// called date-fns to format the date on the ticket
						// format(new Date(), 'yyyy-MM-dd'),
					];
					// push each tickcet's info into a row
					tableRows.push(reveData);
				});

			// startY is basically margin-top
			doc.autoTable(tableColumn, tableRows, { startY: 20 });
			const date = Date().split(' ');
			// we use a date string to generate our filename.
			const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
			// ticket title. and margin-top + margin-left
			doc.text('Next Five Year Data', 14, 15);
			// we define the name of our PDF file.
			doc.save(`report_${dateStr}.pdf`);
		}
	};

	return userSub && userSub.length > 0 ? (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12 col-xl-12'>
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
					<div className='card'>
						<div className='card-header'>
							<h4 className='card-header-title'>Revenue</h4>
							<div className='chart-handle-grup'>
								<div className='chart-dropdown'>
									<span className='mr-3'>View By :</span>
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
								<ButtonGroup aria-label='Basic example'>
									<span className='btn-custom-group'>Export</span>
									<Button className='btn-custom-group'>
										{revenues && revenues.revenuInputs ? (
											<CSVLink
												className='csv-download-btn'
												filename={'data.csv'}
												data={chartValue === 'year' ? revenues.revenuInputs.filter((rev) => rev.type === 'Yearly') : chartValue === 'quarter' ? revenues.revenuInputs.filter((rev) => rev.type === 'Quarter') : revenues.revenuInputs.filter((rev) => rev.type === 'Monthly')}>
												CSV
											</CSVLink>
										) : (
											'CSV'
										)}
									</Button>
									<Button onClick={generatePdf} className='btn-custom-group'>
										PDF
									</Button>
								</ButtonGroup>
							</div>
						</div>
						<div className='card-body'>
							{chartLoader ? (
								<div className='loader-wrapper'>
									<div className='spinner-border spinner-border-sm' role='status'>
										<span className='sr-only'>Loading...</span>
									</div>
								</div>
							) : (
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
													let value;
													data['datasets'].forEach((d) => {
														// console.log(d['data'][tooltipItem['index']], tooltipItem);
														if (d['data'][tooltipItem['index']] === Number(tooltipItem.value)) {
															value = '$ ' + d['data'][tooltipItem['index']].toFixed(2);
														}
													});
													// console.log(value);
													return value;
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
										responsive: true,
										maintainAspectRatio: false,
										scales: {
											yAxes: [
												{
													ticks: {
														callback: function (value) {
															return '$ ' + numeral(value).format('0.0a');
														},
														stepSize: 400,
														beginAtZero: true,
													},
													gridLines: {
														borderDash: [2],
														zeroLineColor: 'transparent',
														zeroLineWidth: 0,
														tickMarkLength: 15,
													},
												},
											],
											xAxes: [
												{
													// barThickness: 10,
													barPercentage: 0.3,
													gridLines: {
														lineWidth: 0,
														zeroLineColor: 'transparent',
													},
												},
											],
										},
									}}
									legend={{
										display: true,
										position: 'bottom',
										labels: {
											usePointStyle: true,
											boxWidth: 10,
										},
									}}
								/>
							)}
						</div>
					</div>
				</div>
				<div className='col-8 col-xl-7'>
					<h4>Revenue Inputs</h4>
					<RevenueInputs chartValue={chartValue} revenues={revenues} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />

					<div className='row'>
						<div className='col-8 col-xl-8'>
							<h4>Starting Capital</h4>
							{revenues && revenues._id && <StartingCapitalInput revenueId={revenues._id} startingCapital={revenues.startingCapital} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />}
						</div>
					</div>
				</div>
				<div className='col-4 col-xl-5'>
					<h4>Major Expense Inputs</h4>
					{revenues && revenues._id && <ExpenseInputs revenueId={revenues._id} expenseInputs={revenues.majorExpenseInput} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />}
				</div>
			</div>
		</div>
	) : (
		<div className={`alert alert-success alert-dismissible fade ${alertClass}`} role='alert'>
			<strong>Please subscribe our product to use the app</strong>
			<button onClick={handleCloseAlert} type='button' className='close' data-dismiss='alert' aria-label='Close'>
				<span aria-hidden='true'>×</span>
			</button>
		</div>
	);
}

export default Revenue;

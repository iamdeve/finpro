import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import { ButtonGroup, Button } from 'react-bootstrap';
import { getInputs } from '../../context/fetch-service';

import { getYear, getQuarter, getMonthDetails } from '../../utils/utils';

import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import MarketingInputs from './MarketingInputs';
import ExpenseInputs from './ExpenseInputs';

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

function Marketing() {
	const history = useHistory();
	const classes = useStyles();
	const {
		state: { purchasing, inputs, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const marketing = inputs.filter((i) => i.title === 'marketing')[0];

	const userSub = purchasing && purchasing.length > 0 ? purchasing.filter((sub) => sub.status === 'active') : [];

	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
	};

	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [alertClass, setAlertClass] = React.useState(userSub && userSub.length > 0 ? '' : 'show');

	const [csvData, setCsvData] = React.useState('');

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
			let inputs = await getInputs();
			dispatch({
				type: 'SET_INPUTS',
				payload: inputs,
			});
		}
		fetchRevenue();
	}, [isAuthenticated, history, dispatch]);

	const generatePdf = () => {
		const doc = new jsPDF();
		autoTable(doc, { html: '#marketing-table', startY: 20 });
		const date = Date().split(' ');
		// we use a date string to generate our filename.
		const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
		// ticket title. and margin-top + margin-left
		doc.text('Next Five Year Data', 14, 15);
		// we define the name of our PDF file.
		doc.save(`report_${dateStr}.pdf`);
	};

	const generateCSV = () => {
		if (marketing && marketing.inputs && marketing.inputs.length > 0) {
			let str = '';
			if (chartValue === 'year') {
				str +=
					'Year ,' +
					getYear(marketing.inputs)
						.headings.map((year, id) => new Date(year.startDate).getFullYear())
						.join(',') +
					',\n';
				str +=
					'Headingcount ,' +
					getYear(marketing.inputs)
						.headings.map((year, id) => year.count)
						.join(',') +
					',\n';
				str +=
					'Salaries ,' +
					Object.values(getYear(marketing.inputs).salaries)
						.map((salary) => salary)
						.join(',') +
					',\n';
				str +=
					'Taxes ,' +
					Object.values(getYear(marketing.inputs).taxes)
						.map((tax) => tax)
						.join(',') +
					',\n';
				str +=
					'Commissions ,' +
					Object.values(getYear(marketing.inputs).commissions)
						.map((com) => com)
						.join(',') +
					',\n';
				str +=
					'Total Payroll ,' +
					Object.values(getYear(marketing.inputs).total)
						.map((tot) => tot)
						.join(',') +
					',\n';
			} else if (chartValue === 'quarter') {
				str +=
					'Quarter ,' +
					getQuarter(marketing.inputs)
						.headings.map((quarter, id) => quarter.quarter)
						.join(',') +
					',\n';
				str +=
					'Headingcount ,' +
					getQuarter(marketing.inputs)
						.headings.map((year, id) => year.count)
						.join(',') +
					',\n';
				str +=
					'Salaries ,' +
					Object.values(getQuarter(marketing.inputs).salaries)
						.map((salary) => salary)
						.join(',') +
					',\n';
				str +=
					'Taxes ,' +
					Object.values(getQuarter(marketing.inputs).taxes)
						.map((tax) => tax)
						.join(',') +
					',\n';
				str +=
					'Commissions ,' +
					Object.values(getQuarter(marketing.inputs).commissions)
						.map((com) => com)
						.join(',') +
					',\n';
				str +=
					'Total Payroll ,' +
					Object.values(getQuarter(marketing.inputs).total)
						.map((tot) => tot)
						.join(',') +
					',\n';
			} else if (chartValue === 'month') {
				str +=
					'Monthly ,' +
					getMonthDetails(marketing.inputs)
						.headings.map((month, id) => month.month)
						.join(',') +
					',\n';
				str +=
					'Headingcount ,' +
					getMonthDetails(marketing.inputs)
						.headings.map((year, id) => year.count)
						.join(',') +
					',\n';
				str +=
					'Salaries ,' +
					Object.values(getMonthDetails(marketing.inputs).salaries)
						.map((salary) => salary)
						.join(',') +
					',\n';
				str +=
					'Taxes ,' +
					Object.values(getMonthDetails(marketing.inputs).taxes)
						.map((tax) => tax)
						.join(',') +
					',\n';
				str +=
					'Commissions ,' +
					Object.values(getMonthDetails(marketing.inputs).commissions)
						.map((com) => com)
						.join(',') +
					',\n';
				str +=
					'Total Payroll ,' +
					Object.values(getMonthDetails(marketing.inputs).total)
						.map((tot) => tot)
						.join(',') +
					',\n';
			}

			console.log(str);
			setCsvData(str);
		} else {
			return;
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
					<div className='table-container-header'>
						<h4 className=''>Marketing</h4>
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
								<Button onClick={generateCSV} className='btn-custom-group'>
									{marketing && marketing.inputs ? (
										<CSVLink className='csv-download-btn' onClick={generateCSV} filename={'data.csv'} data={csvData}>
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

					<div className='custom-table-container'>
						<table id='marketing-table'>
							<thead>
								<tr>
									<th></th>
									{chartValue === 'year' && marketing && marketing.inputs && getYear(marketing.inputs).headings.map((year, id) => <th key={id}>{new Date(year.startDate).getFullYear()}</th>)}
									{chartValue === 'quarter' && marketing && marketing.inputs && getQuarter(marketing.inputs).headings.map((quarter, id) => <th key={id}>{quarter.quarter}</th>)}
									{chartValue === 'month' && marketing && marketing.inputs && getMonthDetails(marketing.inputs).headings.map((month, id) => <th key={id}>{month.month}</th>)}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Headcounts</th>

									{chartValue === 'year' && marketing && marketing.inputs && getYear(marketing.inputs).headings.map((year, id) => <td key={id}>{year.count}</td>)}
									{chartValue === 'quarter' && marketing && marketing.inputs && marketing.inputs.length > 0 && getQuarter(marketing.inputs).headings.map((quarter, id) => <td key={id}>{quarter.count}</td>)}
									{chartValue === 'month' && marketing && marketing.inputs && getMonthDetails(marketing.inputs).headings.map((month, id) => <td key={id}>{month.count}</td>)}
								</tr>
								<tr>
									<th>Salaries</th>
									{chartValue === 'year' && marketing && marketing.inputs && Object.keys(getYear(marketing.inputs).salaries).map((data, id) => <td key={id}>${getYear(marketing.inputs).salaries[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getQuarter(marketing.inputs) &&
										Object.keys(getQuarter(marketing.inputs).salaries).map((quarter, id) => <td key={id}>${getQuarter(marketing.inputs).salaries[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getMonthDetails(marketing.inputs) &&
										Object.keys(getMonthDetails(marketing.inputs).salaries).map((month, id) => <td key={id}>${getMonthDetails(marketing.inputs).salaries[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Benifits & Taxes</th>
									{chartValue === 'year' && marketing && marketing.inputs && Object.keys(getYear(marketing.inputs).taxes).map((data, id) => <td key={id}>${getYear(marketing.inputs).taxes[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getQuarter(marketing.inputs) &&
										Object.keys(getQuarter(marketing.inputs).taxes).map((quarter, id) => <td key={id}>${getQuarter(marketing.inputs).taxes[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getMonthDetails(marketing.inputs) &&
										Object.keys(getMonthDetails(marketing.inputs).taxes).map((month, id) => <td key={id}>${getMonthDetails(marketing.inputs).taxes[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Commissions</th>
									{chartValue === 'year' && marketing && marketing.inputs && Object.keys(getYear(marketing.inputs).commissions).map((data, id) => <td key={id}>${getYear(marketing.inputs).commissions[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getQuarter(marketing.inputs) &&
										Object.keys(getQuarter(marketing.inputs).commissions).map((quarter, id) => <td key={id}>${getQuarter(marketing.inputs).commissions[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getMonthDetails(marketing.inputs) &&
										Object.keys(getMonthDetails(marketing.inputs).commissions).map((month, id) => <td key={id}>${getMonthDetails(marketing.inputs).commissions[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Total Payroll</th>
									{chartValue === 'year' && marketing && marketing.inputs && Object.keys(getYear(marketing.inputs).total).map((data, id) => <td key={id}>${getYear(marketing.inputs).total[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getQuarter(marketing.inputs) &&
										Object.keys(getQuarter(marketing.inputs).total).map((quarter, id) => <td key={id}>${getQuarter(marketing.inputs).total[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' &&
										marketing &&
										marketing.inputs &&
										marketing.inputs.length > 0 &&
										getMonthDetails(marketing.inputs) &&
										Object.keys(getMonthDetails(marketing.inputs).total).map((month, id) => <td key={id}>${getMonthDetails(marketing.inputs).total[month].toFixed(2)}</td>)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className='col-8 col-xl-7'>
					<h4>Marketing Inputs</h4>
					<MarketingInputs marketing={marketing} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />
				</div>
				<div className='col-4 col-xl-5'>
					<h4>Major Expense Input</h4>
					{marketing && marketing._id && <ExpenseInputs marketingId={marketing._id} expenseInputs={marketing.majorExpenseInput} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />}
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

export default Marketing;

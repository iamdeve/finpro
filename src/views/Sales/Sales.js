import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import { ButtonGroup, Button } from 'react-bootstrap';
import { getInputs } from '../../context/fetch-service';

import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import SalesInputs from './SalesInputs';
import ExpenseInputs from './ExpenseInputs';

import { getYear, getQuarter, getMonthDetails } from '../../utils/utils';

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

function Sales() {
	const history = useHistory();
	const classes = useStyles();
	const {
		state: { purchasing, inputs, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const sales = inputs.filter((i) => i.title === 'sales')[0];
	const userSub = purchasing && purchasing.length > 0 ? purchasing.filter((sub) => sub.status === 'active') : [];
	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
	};

	const [csvData, setCsvData] = React.useState('');
	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [alertClass, setAlertClass] = React.useState(userSub && userSub.length > 0 ? '' : 'show');

	const handleCloseAlert = () => {
		setAlertClass('hide');
		setErr('');
		setMsg('');
	};

	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
		async function fetchInputs() {
			let inputs = await getInputs();
			dispatch({
				type: 'SET_INPUTS',
				payload: inputs,
			});
		}
		fetchInputs();
	}, [isAuthenticated, history, dispatch, chartValue]);

	if (sales && sales.inputs) {
		// console.log(getYear(sales.inputs));
		// console.log(getQuarter(sales.inputs));
		// console.log(getMonthDetails(sales.inputs));
	}
	const generatePdf = () => {
		const doc = new jsPDF();
		autoTable(doc, { html: '#sales-table', startY: 20 });
		const date = Date().split(' ');
		// we use a date string to generate our filename.
		const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
		// ticket title. and margin-top + margin-left
		doc.text('Next Five Year Data', 14, 15);
		// we define the name of our PDF file.
		doc.save(`report_${dateStr}.pdf`);
	};

	const generateCSV = () => {
		let str = '';
		if (chartValue === 'year') {
			str +=
				'Year ,' +
				getYear(sales.inputs)
					.headings.map((year, id) => new Date(year.startDate).getFullYear())
					.join(',') +
				',\n';
			str +=
				'Headingcount ,' +
				getYear(sales.inputs)
					.headings.map((year, id) => year.count)
					.join(',') +
				',\n';
			str +=
				'Salaries ,' +
				Object.values(getYear(sales.inputs).salaries)
					.map((salary) => salary)
					.join(',') +
				',\n';
			str +=
				'Taxes ,' +
				Object.values(getYear(sales.inputs).taxes)
					.map((tax) => tax)
					.join(',') +
				',\n';
			str +=
				'Commissions ,' +
				Object.values(getYear(sales.inputs).commissions)
					.map((com) => com)
					.join(',') +
				',\n';
			str +=
				'Total Payroll ,' +
				Object.values(getYear(sales.inputs).total)
					.map((tot) => tot)
					.join(',') +
				',\n';
		} else if (chartValue === 'quarter') {
			str +=
				'Quarter ,' +
				getQuarter(sales.inputs)
					.headings.map((quarter, id) => quarter.quarter)
					.join(',') +
				',\n';
			str +=
				'Headingcount ,' +
				getQuarter(sales.inputs)
					.headings.map((year, id) => year.count)
					.join(',') +
				',\n';
			str +=
				'Salaries ,' +
				Object.values(getQuarter(sales.inputs).salaries)
					.map((salary) => salary)
					.join(',') +
				',\n';
			str +=
				'Taxes ,' +
				Object.values(getQuarter(sales.inputs).taxes)
					.map((tax) => tax)
					.join(',') +
				',\n';
			str +=
				'Commissions ,' +
				Object.values(getQuarter(sales.inputs).commissions)
					.map((com) => com)
					.join(',') +
				',\n';
			str +=
				'Total Payroll ,' +
				Object.values(getQuarter(sales.inputs).total)
					.map((tot) => tot)
					.join(',') +
				',\n';
		} else if (chartValue === 'month') {
			str +=
				'Monthly ,' +
				getMonthDetails(sales.inputs)
					.headings.map((month, id) => month.month)
					.join(',') +
				',\n';
			str +=
				'Headingcount ,' +
				getMonthDetails(sales.inputs)
					.headings.map((year, id) => year.count)
					.join(',') +
				',\n';
			str +=
				'Salaries ,' +
				Object.values(getMonthDetails(sales.inputs).salaries)
					.map((salary) => salary)
					.join(',') +
				',\n';
			str +=
				'Taxes ,' +
				Object.values(getMonthDetails(sales.inputs).taxes)
					.map((tax) => tax)
					.join(',') +
				',\n';
			str +=
				'Commissions ,' +
				Object.values(getMonthDetails(sales.inputs).commissions)
					.map((com) => com)
					.join(',') +
				',\n';
			str +=
				'Total Payroll ,' +
				Object.values(getMonthDetails(sales.inputs).total)
					.map((tot) => tot)
					.join(',') +
				',\n';
		}

		console.log(str);
		setCsvData(str);
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
						<h4 className=''>Sales</h4>
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
									{sales && sales.inputs ? (
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
						<table id='sales-table' className='table table-nowrap'>
							<thead>
								<tr>
									<th></th>
									{chartValue === 'year' && sales && sales.inputs && getYear(sales.inputs).headings.map((year, id) => <th key={id}>{new Date(year.startDate).getFullYear()}</th>)}
									{chartValue === 'quarter' && sales && sales.inputs && getQuarter(sales.inputs).headings.map((quarter, id) => <th key={id}>{quarter.quarter}</th>)}
									{chartValue === 'month' && sales && sales.inputs && getMonthDetails(sales.inputs).headings.map((month, id) => <th key={id}>{month.month}</th>)}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Headcounts</th>

									{chartValue === 'year' && sales && sales.inputs && getYear(sales.inputs).headings.map((year, id) => <td key={id}>{year.count}</td>)}
									{chartValue === 'quarter' && sales && sales.inputs && sales.inputs.length > 0 && getQuarter(sales.inputs).headings.map((quarter, id) => <td key={id}>{quarter.count}</td>)}
									{chartValue === 'month' && sales && sales.inputs && getMonthDetails(sales.inputs).headings.map((month, id) => <td key={id}>{month.count}</td>)}
								</tr>
								<tr>
									<th>Salaries</th>

									{chartValue === 'year' && sales && sales.inputs && Object.keys(getYear(sales.inputs).salaries).map((data, id) => <td key={id}>${getYear(sales.inputs).salaries[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' && sales && sales.inputs && sales.inputs.length > 0 && getQuarter(sales.inputs) && Object.keys(getQuarter(sales.inputs).salaries).map((quarter, id) => <td key={id}>${getQuarter(sales.inputs).salaries[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' && sales && sales.inputs && sales.inputs.length > 0 && getMonthDetails(sales.inputs) && Object.keys(getMonthDetails(sales.inputs).salaries).map((month, id) => <td key={id}>${getMonthDetails(sales.inputs).salaries[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Benifits & Taxes</th>
									{chartValue === 'year' && sales && sales.inputs && Object.keys(getYear(sales.inputs).taxes).map((data, id) => <td key={id}>${getYear(sales.inputs).taxes[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' && sales && sales.inputs && sales.inputs.length > 0 && getQuarter(sales.inputs) && Object.keys(getQuarter(sales.inputs).taxes).map((quarter, id) => <td key={id}>${getQuarter(sales.inputs).taxes[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' && sales && sales.inputs && sales.inputs.length > 0 && getMonthDetails(sales.inputs) && Object.keys(getMonthDetails(sales.inputs).taxes).map((month, id) => <td key={id}>${getMonthDetails(sales.inputs).taxes[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Commissions</th>
									{chartValue === 'year' && sales && sales.inputs && Object.keys(getYear(sales.inputs).commissions).map((data, id) => <td key={id}>${getYear(sales.inputs).commissions[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' && sales && sales.inputs && sales.inputs.length > 0 && getQuarter(sales.inputs) && Object.keys(getQuarter(sales.inputs).commissions).map((quarter, id) => <td key={id}>${getQuarter(sales.inputs).commissions[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' &&
										sales &&
										sales.inputs &&
										sales.inputs.length > 0 &&
										getMonthDetails(sales.inputs) &&
										Object.keys(getMonthDetails(sales.inputs).commissions).map((month, id) => <td key={id}>${getMonthDetails(sales.inputs).commissions[month].toFixed(2)}</td>)}
								</tr>
								<tr>
									<th>Total Payroll</th>
									{chartValue === 'year' && sales && sales.inputs && Object.keys(getYear(sales.inputs).total).map((data, id) => <td key={id}>${getYear(sales.inputs).total[data].toFixed(2)}</td>)}
									{chartValue === 'quarter' && sales && sales.inputs && sales.inputs.length > 0 && getQuarter(sales.inputs) && Object.keys(getQuarter(sales.inputs).total).map((quarter, id) => <td key={id}>${getQuarter(sales.inputs).total[quarter].toFixed(2)}</td>)}
									{chartValue === 'month' && sales && sales.inputs && sales.inputs.length > 0 && getMonthDetails(sales.inputs) && Object.keys(getMonthDetails(sales.inputs).total).map((month, id) => <td key={id}>${getMonthDetails(sales.inputs).total[month].toFixed(2)}</td>)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className='col-8 col-xl-7'>
					<h4>Sales Inputs</h4>
					<SalesInputs sales={sales} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />
				</div>
				<div className='col-4 col-xl-5'>
					<h4>Major Expense Input</h4>
					{sales && sales._id && <ExpenseInputs salesId={sales._id} expenseInputs={sales.majorExpenseInput} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />}
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

export default Sales;

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Bar } from 'react-chartjs-2';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import { ButtonGroup, Button } from 'react-bootstrap';
import { getInputs } from '../../context/fetch-service';

import GandAInputs from './GandAInputs';
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

function GandA() {
	const history = useHistory();
	const classes = useStyles();
	const {
		state: { inputs, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const ganda = inputs.filter((i) => i.title === 'ganda')[0];

	const [chartValue, setChartValue] = React.useState('year');
	const handleChange = (event) => {
		setChartValue(event.target.value);
	};

	const [msg, setMsg] = React.useState('');
	const [err, setErr] = React.useState('');
	const [alertClass, setAlertClass] = React.useState('');

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

	return (
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
						<h4 className=''>G&A</h4>
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
								<Button className='btn-custom-group'>Export</Button>
								<Button className='btn-custom-group'>CSV</Button>
								<Button className='btn-custom-group'>PDF</Button>
							</ButtonGroup>
						</div>
					</div>

					<div className='custom-table-container'>
						<table>
							<thead>
								<tr>
									<th></th>
									{chartValue === 'year' && ganda && ganda.inputs && getYear(ganda.inputs).headings.map((year, id) => <th key={id}>{new Date(year.startDate).getFullYear()}</th>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && getQuarter(ganda.inputs).headings.map((quarter, id) => <th key={id}>{quarter.quarter}</th>)}
									{chartValue === 'month' && ganda && ganda.inputs && getMonthDetails(ganda.inputs).headings.map((month, id) => <th key={id}>{month.month}</th>)}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Headcounts</th>

									{chartValue === 'year' && ganda && ganda.inputs && getYear(ganda.inputs).headings.map((year, id) => <td key={id}>{year.count}</td>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && ganda.inputs.length > 0 && getQuarter(ganda.inputs).headings.map((quarter, id) => <td key={id}>{quarter.count}</td>)}
									{chartValue === 'month' && ganda && ganda.inputs && getMonthDetails(ganda.inputs).headings.map((month, id) => <td key={id}>{month.count}</td>)}
								</tr>
								<tr>
									<th>Salaries</th>
									{chartValue === 'year' && ganda && ganda.inputs && Object.keys(getYear(ganda.inputs).salaries).map((data, id) => <td key={id}>${getYear(ganda.inputs).salaries[data]}</td>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && ganda.inputs.length > 0 && getQuarter(ganda.inputs) && Object.keys(getQuarter(ganda.inputs).salaries).map((quarter, id) => <td key={id}>${getQuarter(ganda.inputs).salaries[quarter]}</td>)}
									{chartValue === 'month' && ganda && ganda.inputs && ganda.inputs.length > 0 && getMonthDetails(ganda.inputs) && Object.keys(getMonthDetails(ganda.inputs).salaries).map((month, id) => <td key={id}>${getMonthDetails(ganda.inputs).salaries[month]}</td>)}
								</tr>
								<tr>
									<th>Benifits & Taxes</th>
									{chartValue === 'year' && ganda && ganda.inputs && Object.keys(getYear(ganda.inputs).taxes).map((data, id) => <td key={id}>${getYear(ganda.inputs).taxes[data]}</td>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && ganda.inputs.length > 0 && getQuarter(ganda.inputs) && Object.keys(getQuarter(ganda.inputs).taxes).map((quarter, id) => <td key={id}>${getQuarter(ganda.inputs).taxes[quarter]}</td>)}
									{chartValue === 'month' && ganda && ganda.inputs && ganda.inputs.length > 0 && getMonthDetails(ganda.inputs) && Object.keys(getMonthDetails(ganda.inputs).taxes).map((month, id) => <td key={id}>${getMonthDetails(ganda.inputs).taxes[month]}</td>)}
								</tr>
								<tr>
									<th>Commissions</th>
									{chartValue === 'year' && ganda && ganda.inputs && Object.keys(getYear(ganda.inputs).commissions).map((data, id) => <td key={id}>${getYear(ganda.inputs).commissions[data]}</td>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && ganda.inputs.length > 0 && getQuarter(ganda.inputs) && Object.keys(getQuarter(ganda.inputs).commissions).map((quarter, id) => <td key={id}>${getQuarter(ganda.inputs).commissions[quarter]}</td>)}
									{chartValue === 'month' && ganda && ganda.inputs && ganda.inputs.length > 0 && getMonthDetails(ganda.inputs) && Object.keys(getMonthDetails(ganda.inputs).commissions).map((month, id) => <td key={id}>${getMonthDetails(ganda.inputs).commissions[month]}</td>)}
								</tr>
								<tr>
									<th>Total Payroll</th>
									{chartValue === 'year' && ganda && ganda.inputs && Object.keys(getYear(ganda.inputs).total).map((data, id) => <td key={id}>${getYear(ganda.inputs).total[data]}</td>)}
									{chartValue === 'quarter' && ganda && ganda.inputs && ganda.inputs.length > 0 && getQuarter(ganda.inputs) && Object.keys(getQuarter(ganda.inputs).total).map((quarter, id) => <td key={id}>${getQuarter(ganda.inputs).total[quarter]}</td>)}
									{chartValue === 'month' && ganda && ganda.inputs && ganda.inputs.length > 0 && getMonthDetails(ganda.inputs) && Object.keys(getMonthDetails(ganda.inputs).total).map((month, id) => <td key={id}>${getMonthDetails(ganda.inputs).total[month]}</td>)}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className='col-8 col-xl-7'>
					<h4>G & A Inputs</h4>
					<GandAInputs ganda={ganda} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />
				</div>
				<div className='col-4 col-xl-5'>
					<h4>Major Expense Input</h4>
					{ganda && ganda._id && <ExpenseInputs gandaId={ganda._id} expenseInputs={ganda.majorExpenseInput} setMsg={setMsg} setErr={setErr} setAlertClass={setAlertClass} />}
				</div>
			</div>
		</div>
	);
}

export default GandA;

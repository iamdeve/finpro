import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControl, InputBase, NativeSelect } from '@material-ui/core';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

import { ButtonGroup, Button } from 'react-bootstrap';
import { getInputs } from '../../context/fetch-service';

import MarketingInputs from './MarketingInputs';
import ExpenseInputs from './ExpenseInputs';

import { getYearSum, duplicateCounter, getTotal } from '../../utils/getYearSum';

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
		state: { inputs, data, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	const marketing = inputs.filter((i) => i.title === 'marketing')[0];

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
									{duplicateCounter(marketing) &&
										duplicateCounter(marketing)
											.splice(-4)
											.map((year, id) => <th key={id}>{new Date(year.startDate).getFullYear()}</th>)}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Headcounts</th>
									{duplicateCounter(marketing) &&
										duplicateCounter(marketing)
											.splice(-4)
											.map((data, id) => <td key={id}>{data.count}</td>)}
								</tr>
								<tr>
									<th>Salaries</th>
									{marketing &&
										marketing.inputs &&
										Object.keys(getYearSum(marketing.inputs, 'salary'))
											.splice(-4)
											.map((data, id) => <td key={id}>${getYearSum(marketing.inputs, 'salary')[data]}</td>)}
								</tr>
								<tr>
									<th>Benifits & Taxes</th>
									{marketing &&
										marketing.inputs &&
										Object.keys(getYearSum(marketing.inputs, 'taxes'))
											.splice(-4)
											.map((data, id) => <td key={id}>${getYearSum(marketing.inputs, 'taxes')[data]}</td>)}
								</tr>
								<tr>
									<th>Commissions</th>
									{marketing && marketing.inputs && Object.keys(getYearSum(marketing.inputs, 'commissions')).map((data, id) => <td key={id}>${getYearSum(marketing.inputs, 'commissions')[data]}</td>)}
								</tr>
								<tr>
									<th>Total Payroll</th>
									{marketing && marketing.inputs && Object.keys(getTotal(marketing.inputs)).map((data, id) => <td key={id}>${getTotal(marketing.inputs)[data]}</td>)}
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
	);
}

export default Marketing;

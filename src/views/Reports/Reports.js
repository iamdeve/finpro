import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ButtonGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import { getInputs } from '../../context/fetch-service';
import { getRevenue } from '../../context/fetch-service';

import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
}));

function Reports() {
	const history = useHistory();

	const classes = useStyles();
	const {
		state: { purchasing, reports, tableData, isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);

	console.log(tableData);
	const userSub = purchasing && purchasing.length > 0 ? purchasing.filter((sub) => sub.status === 'active') : [];

	const [csvData, setCsvData] = React.useState('');
	const [chartValue, setChartValue] = React.useState('P&L by Year');
	const [chartLoader, setChartLoader] = React.useState(true);
	const [alertClass, setAlertClass] = React.useState(userSub && userSub.length > 0 ? '' : 'show');
	const handleCloseAlert = () => {
		setAlertClass('hide');
	};
	const handleChange = (text) => {
		setChartLoader(true);
		setChartValue(text);
	};

	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
		if (chartValue !== 'CapEx & Cash Flow') {
			async function fetchRevenue() {
				let revenues = await getRevenue();
				dispatch({
					type: 'SET_REVENUE',
					payload: revenues,
				});

				let inputs = await getInputs();
				dispatch({
					type: 'SET_INPUTS',
					payload: inputs,
				});
				setTimeout(() => {
					// console.log(revenues);
					if (revenues && revenues.revenuInputs && revenues.revenuInputs.length > 0) {
						dispatch({ type: 'VIEW_REPORTS', payload: chartValue });
					}
					setChartLoader(false);
				}, 1000);
			}
			fetchRevenue();
		} else {
			dispatch({ type: 'SET_TABLE_DATA' });
			setChartLoader(false);
		}
	}, [isAuthenticated, history, dispatch, chartValue]);

	const generatePdf = () => {
		if (reports && reports.datasets.length > 0 && tableData) {
			if (reports) {
				if (chartValue === 'CapEx & Cash Flow') {
					const doc = new jsPDF();
					autoTable(doc, { html: '#report-table', startY: 20, startX: 5, margin: { left: 0, right: 0 } });
					const date = Date().split(' ');
					// we use a date string to generate our filename.
					const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
					// ticket title. and margin-top + margin-left
					doc.text('Next Five Year Quarter Data', 14, 15);
					// we define the name of our PDF file.
					doc.save(`report_${dateStr}.pdf`);
					return;
				}
				const doc = new jsPDF();

				let revenues = reports.datasets[0].data;
				let expenses = reports.datasets[1].data;
				let operProf = reports.datasets[2].data;
				let ebit = reports.datasets[3].data;
				// define the columns we want and their titles
				const tableColumn = ['Year', 'Revenues', 'Expenses', 'Operation Profit', 'EBIT'];
				// define an empty array of rows
				const tableRows = [];
				// for each ticket pass all its data into an array
				reports.labels.forEach((label, id) => {
					const reportData = [label, revenues[id].toFixed(2), expenses[id].toFixed(2), operProf[id].toFixed(2), ebit[id].toFixed(2)];
					tableRows.push(reportData);
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
		}
	};

	const generateCSV = () => {
		console.log(reports);
		if (reports && reports.datasets.length > 0) {
			let revenues = reports.datasets[0].data;
			let expenses = reports.datasets[1].data;
			let operProf = reports.datasets[2].data;
			let ebit = reports.datasets[3].data;
			let str = '';
			if (chartValue === 'P&L by Year') {
				str += 'Year ,' + reports.labels.toString() + ',\n';
				str += 'Revenues ,' + revenues.toString() + ',\n';
				str += 'Expenses ,' + expenses.toString() + ',\n';
				str += 'Operation Profit ,' + operProf.toString() + ',\n';
				str += 'EBIT ,' + ebit.toString() + ',\n';
			} else if (chartValue === 'P&L by Quarter') {
				str += 'Quarter ,' + reports.labels.toString() + ',\n';
				str += 'Revenues ,' + revenues.toString() + ',\n';
				str += 'Expenses ,' + expenses.toString() + ',\n';
				str += 'Operation Profit ,' + operProf.toString() + ',\n';
				str += 'EBIT ,' + ebit.toString() + ',\n';
			} else if (chartValue === 'CapEx & Cash Flow') {
				// console.log(tableData);
				if (tableData) {
					str += 'Quarter ,' + tableData.labels.toString() + ',\n';
					str += 'Beginning Cash ,' + tableData.beginingCash.slice(0, 15).toString() + ',\n';
					str += 'Gross Margin ,' + tableData.quarterRevenues.slice(0, 15).toString() + ',\n';
					str += 'Expenses ,' + tableData.quarterExpense.slice(0, 15).toString() + ',\n';
					str += 'Investment ,' + tableData.investment.slice(0, 15).toString() + ',\n';
					str += 'Capital Expense ,' + tableData.captalExpense.slice(0, 15).toString() + ',\n';
					str += 'Change in Cash ,' + tableData.changeInCash.slice(0, 15).toString() + ',\n';
					str += 'Endign Cash ,' + tableData.endingCash.slice(0, 15).toString() + ',\n';
				}
			}

			console.log(str);
			setCsvData(str);
		}
	};
	return userSub && userSub.length > 0 ? (
		<div className='report-container'>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-3 col-xl-3 full-height'>
						<div className='control-panel'>
							<div className='control-btn'>
								<button
									onClick={() => {
										handleChange('P&L by Year');
									}}
									className={['btn', chartValue === 'P&L by Year' ? 'btn-primary' : 'btn-light'].join(' ')}>
									P&L by Year
								</button>
							</div>
							<div className='control-btn'>
								<button
									onClick={() => {
										handleChange('P&L by Quarter');
									}}
									className={['btn', chartValue === 'P&L by Quarter' ? 'btn-primary' : 'btn-light'].join(' ')}>
									P&L by Quarter
								</button>
							</div>
							<div className='control-btn'>
								<button
									onClick={() => {
										handleChange('CapEx & Cash Flow');
									}}
									className={['btn', chartValue === 'CapEx & Cash Flow' ? 'btn-primary' : 'btn-light'].join(' ')}>
									CapEx & Cash Flow
								</button>
							</div>
						</div>
					</div>
					<div className='col-9 col-xl-9'>
						<div className='chart-panel'>
							<div className='card'>
								<div className='card-header'>
									<h4 className='card-header-title'>{chartValue}</h4>
									<div className='chart-handle-grup'>
										<ButtonGroup aria-label='Basic example'>
											<span className='btn-custom-group'>Export</span>
											<Button onClick={generateCSV} className='btn-custom-group'>
												{reports ? (
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
								<div className='card-body'>
									{chartLoader ? (
										<div className='loader-wrapper'>
											<div className='spinner-border spinner-border-sm' role='status'>
												<span className='sr-only'>Loading...</span>
											</div>
										</div>
									) : chartValue === 'CapEx & Cash Flow' ? (
										<div className='custom-table-container'>
											<table id='report-table' responsive>
												<thead>
													<tr>
														<td></td>
														{tableData && tableData.labels && tableData.labels.map((quarter, id) => <th key={id}>{quarter}</th>)}
													</tr>
												</thead>
												<tbody>
													<tr>
														<th>Beginning Cash</th>
														{tableData && tableData.beginingCash && tableData.beginingCash.slice(0, tableData.beginingCash.length - 1).map((exp, id) => <td key={id}>${exp.toFixed(2)}</td>)}
													</tr>
													<tr>
														<th>Gross Margin</th>
														{tableData && tableData.quarterRevenues && tableData.quarterRevenues.slice(0, tableData.quarterRevenues.length - 1).map((rev, id) => <td key={id}>${rev.toFixed(2)}</td>)}
													</tr>
													<tr>
														<th>Expenses</th>
														{tableData && tableData.quarterExpense && tableData.quarterExpense.map((qpro, id) => <td key={id}>${qpro.toFixed(2)}</td>)}
													</tr>
													<tr>
														<th>Investment</th>
														{tableData && tableData.investment && tableData.investment.map((inv, id) => <td key={id}>${inv}</td>)}
													</tr>
													<tr>
														<th>Capital Expense</th>
														{tableData && tableData.captalExpense && tableData.captalExpense.map((ce, id) => <td key={id}>${ce.toFixed(2)}</td>)}
													</tr>
													<tr>
														<th>Change in Cash</th>
														{tableData && tableData.changeInCash && tableData.changeInCash.slice(0, tableData.changeInCash.length - 1).map((cic, id) => <td key={id}>${cic.toFixed(2)}</td>)}
													</tr>
													<tr>
														<th>Ending Balance</th>
														{tableData && tableData.endingCash && tableData.endingCash.slice(0, tableData.endingCash.length - 1).map((ec, id) => <td key={id}>${ec.toFixed(2)}</td>)}
													</tr>
												</tbody>
											</table>
										</div>
									) : (
										<Bar
											height={400}
											data={reports}
											options={{
												tooltips: {
													callbacks: {
														title: function (tooltipItem, data) {
															return data['labels'][tooltipItem[0]['index']];
														},
														label: function (tooltipItem, data) {
															let value;
															data['datasets'].forEach((d) => {
																if (d['data'][tooltipItem['index']] === Number(tooltipItem.value)) {
																	value = '$ ' + d['data'][tooltipItem['index']];
																}
															});
															// console.log(value)
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
																stepSize: 200,
																beginAtZero: true,
															},
															gridLines: {
																borderDash: [2],
																// zeroLineColor: 'transparent',
																zeroLineWidth: 3,
																tickMarkLength: 15,
																lineWidth: 0,
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
					</div>
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

export default Reports;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ButtonGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
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
		state: { reports, isAuthenticated },
	} = React.useContext(AuthContext);

	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
	}, [isAuthenticated, history]);

	const [chartValue, setChartValue] = React.useState('P&L by Year');
	const handleChange = (text) => {
		setChartValue(text);
	};

	return (
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
									className='btn btn-primary'>
									P&L by Year
								</button>
							</div>
							<div className='control-btn'>
								<button
									onClick={() => {
										handleChange('P&L by Quarter');
									}}
									className='btn btn-light'>
									P&L by Quarter
								</button>
							</div>
							<div className='control-btn'>
								<button
									onClick={() => {
										handleChange('CapEx & Cash Flow');
									}}
									className='btn btn-light'>
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
											<Button className='btn-custom-group'>Export</Button>
											<Button className='btn-custom-group'>CSV</Button>
											<Button className='btn-custom-group'>PDF</Button>
										</ButtonGroup>
									</div>
								</div>
								<div className='card-body'>
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Reports;

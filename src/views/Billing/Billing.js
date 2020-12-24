import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import Visa from '../../assets/visa.svg';
import MasterCard from '../../assets/mastercard.svg';

const useStyles = makeStyles((theme) => ({}));
function Billing() {
	const classes = useStyles();

	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<span
			className={classes.ProfileIcon}
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}>
			{/* Render custom icon here */}
			{children}
		</span>
	));

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-12 col-lg-12'>
					<h1 className='page-headings'>Billing</h1>

					<div className='card pt-4 pb-4 pl-4 pr-4'>
						<div className='row'>
							<div className='col'>
								<div className='billing-plan'>You're currently on intro plan</div>
							</div>
							<div className='col-auto'>
								<button className='btn btn-custom btn-padd'>Manage plan</button>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-4 mb-4'></div>
				<div className='card'>
					<div className='card-header card-heading'>
						<div className='row align-items-center'>
							<div className='col'>
								<h4 className='card-header-title'>Payment methods</h4>
							</div>
							<div className='col-auto'>
								<button className='btn btn-sm btn-custom'>Add method</button>
							</div>
						</div>
					</div>
					<div className='card-body'>
						<div className='list-group list-group-flush my-n3'>
							<div className='list-group-item'>
								<div className='row align-items-center'>
									<div className='col-auto'>
										<img className='img-fluid' src={Visa} alt='visa' style={{ maxWidth: '38px' }} />
									</div>
									<div className='col ml-n2'>
										<h4 className='mb-1'>Visa ending in 1234</h4>
										<small className='text-muted'>Expires 3/2024</small>
									</div>
									<div className='col-auto mr-n3'>
										<span className='badge bg-light'>Default</span>
									</div>
									<div className='col-auto'>
										<Dropdown>
											<Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
												<i className='fe fe-more-vertical'></i>
											</Dropdown.Toggle>
											<Dropdown.Menu>
												<Dropdown.Item as={Link} to='/action'>
													Action
												</Dropdown.Item>
												<Dropdown.Item as={Link} to='/action'>
													Another Action
												</Dropdown.Item>
												<Dropdown.Item as={Link} to='/action'>
													Something else
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</div>
							</div>
							<div className='list-group-item'>
								<div className='row align-items-center'>
									<div className='col-auto'>
										<img className='img-fluid' src={MasterCard} alt='...' style={{ maxWidth: '38px' }} />
									</div>
									<div className='col ml-n2'>
										<h4 className='mb-1'>Mastercard ending in 1234</h4>
										<small className='text-muted'>Expires 3/2024</small>
									</div>
									<div className='col-auto'>
										<Dropdown>
											<Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
												<i className='fe fe-more-vertical'></i>
											</Dropdown.Toggle>

											<Dropdown.Menu>
												<Dropdown.Item as={Link} to='/action'>
													Action
												</Dropdown.Item>
												<Dropdown.Item as={Link} to='/action'>
													Another Action
												</Dropdown.Item>
												<Dropdown.Item as={Link} to='/action'>
													Something else
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-2 mb-2'></div>
				<div className='card'>
					<div className='card-header card-heading'>
						<div className='row align-items-center'>
							<div className='col'>
								<h4 className='card-header-title'>Payment History</h4>
							</div>
						</div>
					</div>

					<div className='payment-history-table'>
						<table class='table table-hover table-nowrap'>
							<thead>
								<tr>
									<th scope='col'>Transaction Date</th>
									<th scope='col'>Item</th>
									<th scope='col'>Amount</th>
									<th scope='col'>Status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>4/04/2021</td>
									<td>Intro</td>
									<td>$19.00</td>
									<td>
										<span className='badge bg-secondary'>Failed</span>
									</td>
								</tr>
								<tr>
									<td>2/04/2021</td>
									<td>Intro</td>
									<td>$19.00</td>
									<td>
										<span className='badge bg-success'>Paid</span>
									</td>
								</tr>
								<tr>
									<td>1/04/2021</td>
									<td>Intro</td>
									<td>$19.00</td>
									<td>
										<span className='badge bg-success'>Paid</span>
									</td>
								</tr>
								<tr>
									<td>12/04/2021</td>
									<td>Intro</td>
									<td>$19.00</td>
									<td>
										<span className='badge bg-success'>Paid</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Billing;

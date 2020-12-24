import React from 'react';

const planlist = ['SaaS business Model', 'Input Variables', 'Charts', 'Reports', '30-days free trial'];

function Pricing() {
	return (
		<div className='container'>
			<div className='row'>
				<div className='col-lg-12'>
					<h1 className='page-headings text-center'>Plan & Pricing</h1>

					<div className='mt-2 mb-2'></div>

					<div className='row justify-content-center'>
						<div className='col-lg-6'>
							<div className='card'>
								<div className='plan-card-heading'>
									<h4>INTRO PLAN</h4>
									<h1 className='plan-price'>
										<span>$</span>19
									</h1>
									<span>/month</span>
								</div>

								<div className='items-check-list'>
									<ul>
										{planlist.map((list, id) => (
											<li key={id}>
												<div className='row'>
													<div className='col'>
														<h4>{list}</h4>
													</div>
													<div className='col-auto'>
														<span className='list-checks'>
															<i className='fe fe-check-circle'></i>
														</span>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>

								<div className='mt-2'></div>
								<div className='mb-4 text-center'>
									<button className='btn btn-custom btn-padd'>Select Plan</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Pricing;

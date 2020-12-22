import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from '../../context/axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/context';
import { useHistory } from 'react-router-dom';

function Checkout() {
	const history = useHistory();
	const {
		state: { isAuthenticated },
	} = React.useContext(AuthContext);
	React.useEffect(() => {
		if (!isAuthenticated) {
			history.push('/login');
		}
	}, [isAuthenticated, history]);

	const [subscribe, setSubscribe] = React.useState(true);
	const onToken = async (token) => {
		// let sToken = {
		// 	id: 'tok_1I1D6HL2QqDUeeFIx7HKSGEy',
		// 	object: 'token',
		// 	card: {
		// 		id: 'card_1I1D6HL2QqDUeeFIkECPAJpP',
		// 		object: 'card',
		// 		address_city: null,
		// 		address_country: null,
		// 		address_line1: null,
		// 		address_line1_check: null,
		// 		address_line2: null,
		// 		address_state: null,
		// 		address_zip: null,
		// 		address_zip_check: null,
		// 		brand: 'Visa',
		// 		country: 'US',
		// 		cvc_check: 'unchecked',
		// 		dynamic_last4: null,
		// 		exp_month: 11,
		// 		exp_year: 2022,
		// 		funding: 'credit',
		// 		last4: '4242',
		// 		name: 'wajdanaeli@gmail.com',
		// 		tokenization_method: null,
		// 	},
		// 	client_ip: '182.186.91.92',
		// 	created: 1608652117,
		// 	email: 'wajdanaeli@gmail.com',
		// 	livemode: false,
		// 	type: 'card',
		// 	used: false,
		// };

		try {
			let sub = await axios.post('/subscription', { token, subscribe: subscribe });
			if (sub.status === 200) {
				console.log(sub.data);
				Swal.fire({
					icon: 'success',
					title: 'Hurrah',
					text: sub.data.message,
				});
			}
		} catch (err) {
			console.log(err);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: err.message,
			});
		}
	};
	return (
		<div>
			<input type='checkbox' checked={subscribe} id='sub' onChange={(e) => setSubscribe(e.target.checked)} /> <label htmlFor='sub'>Subscribe</label>
			<br />
			<StripeCheckout token={onToken} stripeKey='pk_test_51HQQAWL2QqDUeeFIhi7RBSjCZ538rvHf2Nsk9EJx2u4cXne5JnQguw8UKMNaMu7lKM0kun1pmoAL1TSo91UHfSOo00dDP9BK5q' />
		</div>
	);
}

export default Checkout;

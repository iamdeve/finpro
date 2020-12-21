import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { AuthContext } from '../context/context';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		marginLeft: drawerWidth,
		background: '#fff',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		overflow: 'hidden',
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
		paddingTop: '80px',
	},
	TopNav: {
		width: '100%',
		marginLeft: '0rem',
		marginRight: '0rem',
	},
	Logo: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: '1rem',
	},
	MENU: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'space-around',
		color: 'blue',
	},
}));

function MenuBar(props) {
	const classes = useStyles();
	const {
		state: { isAuthenticated },
		dispatch,
	} = React.useContext(AuthContext);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch({
			type: 'LOGOUT',
		});
	};
	return (
		<div className={classes.root}>
			<AppBar style={isAuthenticated ? { width: `calc(100% - ${drawerWidth}px)` } : { width: '100%' }} className={classes.appBar}>
				<Toolbar>
					{isAuthenticated ? null : (
						<div style={{ color: '#000' }}>
							<Link to='/'>LOGO</Link>
						</div>
					)}
					<div style={{ flexGrow: 1 }}></div>
					{isAuthenticated ? (
						<>
							<Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
								<div className={classes.MENU}>
									<i className='fe fe-user'></i> <i className='fe fe-chevron-down'></i>
								</div>
							</Button>
							<span style={{ color: '#000' }}>Welcome User</span>
							<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
								<MenuItem onClick={handleClose}>Profile</MenuItem>
								<MenuItem onClick={handleLogout}>Logout</MenuItem>
							</Menu>
						</>
					) : (
						<>
							<NavLink className={classes.NavItem} style={{ margin: '0 1rem' }} to='/login'>
								Login
							</NavLink>
							<NavLink className={classes.NavItem} to='signup'>
								Signup
							</NavLink>
						</>
					)}
				</Toolbar>
			</AppBar>
			{isAuthenticated && (
				<Drawer
					className={classes.drawer}
					variant='permanent'
					classes={{
						paper: classes.drawerPaper,
					}}
					anchor='left'>
					<div className={[classes.toolbar, classes.Logo].join(' ')}>LOGO</div>

					<ul className={[classes.TopNav, 'navbar-nav'].join(' ')}>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/revenue'>
								<i className='fe fe-home'></i> Revenue
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/sales'>
								<i className='fe fe-file'></i> Sales
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/marketing'>
								<i className='fe fe-file'></i> Marketing
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/r-and-d'>
								<i className='fe fe-file'></i> R&D
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/g-and-a'>
								<i className='fe fe-file'></i> G&A
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' activeClassName='active' to='/reports'>
								<i className='fe fe-file'></i> Reports
							</NavLink>
						</li>
					</ul>
				</Drawer>
			)}
			<main className={classes.content}>{props.children}</main>
		</div>
	);
}

export default MenuBar;

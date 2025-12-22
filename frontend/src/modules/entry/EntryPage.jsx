
import { useNavigate } from 'react-router-dom';

import styles from './EntryPage.module.css';

// SVG icons for demonstration

const AdminIcon = () => (

<svg width="60" height="60" viewBox="0 0 24 24" fill="none">

<circle cx="12" cy="12" r="12" fill="#5636D4"/>

<path d="M12 7L16 9V13C16 15.21 14.21 17 12 17C9.79 17 8 15.21 8 13V9L12 7Z" stroke="#fff" strokeWidth="2"/>

<path d="M12 13V15" stroke="#fff" strokeWidth="2"/>

</svg>

);

const CustomerIcon = () => (

<svg width="60" height="60" viewBox="0 0 24 24" fill="none">

<circle cx="12" cy="12" r="12" fill="#10B981"/>

<path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#fff" strokeWidth="2"/>

<path d="M6 18C6 15.7909 8.23858 14 12 14C15.7614 14 18 15.7909 18 18" stroke="#fff" strokeWidth="2"/>

</svg>

);

const EntryPage = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.portalWrapper}>
			<h1 className={styles.title}>Welcome to EV Station Portal</h1>
			<p className={styles.subtitle}>Select your portal to continue</p>
			<div className={styles.portalCards}>
				<div
					className={styles.portalCard}
					onClick={() => navigate('/admin/login')}
					style={{ cursor: 'pointer' }}
				>
					<AdminIcon />
					<h2>Admin Portal</h2>
					<p>Manage submissions, users, alerts, and analytics</p>
				</div>
				<div
					className={styles.portalCard}
					onClick={() => navigate('/login')}
					style={{ cursor: 'pointer' }}
				>
					<CustomerIcon />
					<h2>Customer Portal</h2>
					<p>Register, submit forms, and select charging stations</p>
				</div>
			</div>
		</div>
	);
};

export default EntryPage;
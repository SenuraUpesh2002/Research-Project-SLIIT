import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../../../components/CustomerNavbar';
import styles from './_layout.module.css';

export default function CustomerLayout() {
  return (
    <div className={styles.container}>
      <CustomerNavbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

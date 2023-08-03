import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      welcome to umi
     
      <Outlet />
    </div>
  );
}

import styles from './index.less';
import logo from '@/assets/logo.svg';
import { useEffect } from 'react';
import { history } from 'umi';

const CloudflarePage: React.FC = () => {

  useEffect(() => {
    window._turnstileCb = function () {
      window.turnstile.render('#myWidget', {
        sitekey: '0x4AAAAAAAN8UDJhIsEZUUZ4',
        theme: 'dark',
        callback: function() {
          // ro
          history.push(`/home`);
        },
      });
    };
  }, []);
  return (
    <div className={styles.loginPage}>
      <div className={styles.content}>
        <div className={styles.title}>
          <img src={logo} alt='logo' />
          <span>faucet.aries.axiomesh.io</span>
        </div>
        <div>Checking if the site connection is secure</div>
        <div id="myWidget" style={{marginTop: 32, marginBottom: 64}}></div>
        <div> faucet.aries.axiomesh.io needs to review the security of your connection before proceeding.</div>
      </div>
      <div className={styles.bottom}>
        <div>Performance & security by Cloudflare</div>
      </div>
    </div>
  );
};

export default CloudflarePage;

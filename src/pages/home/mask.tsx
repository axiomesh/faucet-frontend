import styles from './index.less';
import { Button } from 'antd';
import Lottie from 'react-lottie'
import jsonFile from '../../../public/project.json';
import { useEffect } from 'react';

const CanvasPage: React.FC = (props) => {
  const { onCancel, hash, showBtn, loading } = props;
  const Options = {
    loop: true,
    autoplay: true,
    animationData: jsonFile,
  };


  useEffect(() => {
    window.scrollTo(0,0);
  }, [])



  return (
    <div className={styles.mask} style={{height: '100vh', minHeight: 872}}>
      <Lottie options={Options} width="100%" isClickToPauseDisabled={true} />
      <div className={styles.maskText}>
        <div className={styles.maskCancel}>
          <svg onClick={onCancel} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M18.5855 16.2303C19.3666 17.0114 20.6329 17.0114 21.4139 16.2303L27.0714 10.5729C27.7222 9.92209 28.7773 9.92209 29.4281 10.5729C30.0788 11.2236 30.0788 12.2788 29.4281 12.9295L23.7706 18.587C22.9896 19.368 22.9896 20.6344 23.7706 21.4154L29.4281 27.0729C30.0788 27.7236 30.0788 28.7788 29.4281 29.4295C28.7773 30.0803 27.7222 30.0803 27.0714 29.4295L21.4139 23.7721C20.6329 22.991 19.3666 22.991 18.5855 23.7721L12.9281 29.4295C12.2773 30.0803 11.2222 30.0803 10.5714 29.4295C9.92062 28.7788 9.92062 27.7236 10.5714 27.0729L16.2289 21.4154C17.0099 20.6344 17.0099 19.368 16.2289 18.587L10.5714 12.9295C9.92062 12.2788 9.92062 11.2236 10.5714 10.5729C11.2222 9.92209 12.2773 9.92209 12.9281 10.5729L18.5855 16.2303Z" fill="white"/>
          </svg>
        </div>
        {loading ? <div className={styles.fadeIn} style={{textAlign: 'center'}}>
          <div> Hello Fren. Your request is in progress.</div>
          <div> It may take up to a few seconds to complete the request.</div>
        </div> : showBtn ? <div className={styles.successFadeIn}>
          <div>Hello Fren.</div>
          {/*<div>Your request is in progress.It may take up to a few seconds to complete the request.</div>*/}
          <div>The transfer has been made to your Wallet address.</div>
          <div className={styles.maskBtnContainer}>
            <Button className={styles.maskBtn} style={{fontSize: 16}} >
              <a className={styles.maskLink} target="_blank" href= {`${window.BrowerUrl}/tx/${hash}`}>
                {/*<a className={styles.maskLink} target="_blank" href= {`http://localhost:3000/#/txs-detail/${hash}`}>*/}
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" style={{marginRight: 14}}>
                  <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M2.59921 11.4568C2.37339 11.2338 1.96579 11.2139 1.87941 11.5193C1.83413 11.6793 1.80957 11.8482 1.80957 12.0254C1.80957 12.8688 2.36595 13.5252 3.06588 13.9289L10.3644 18.1392C11.0695 18.546 11.9365 18.7233 12.7543 18.7233C13.5721 18.7233 14.4391 18.546 15.1442 18.1392L22.4427 13.9289C23.1426 13.5252 23.699 12.8688 23.699 12.0254C23.699 11.8482 23.6744 11.6793 23.6292 11.5193C23.5428 11.2139 23.1352 11.2338 22.9094 11.4568C22.7434 11.6206 22.5495 11.7647 22.338 11.8867L21.644 12.2871C21.6119 12.3093 21.5758 12.3324 21.5352 12.3558L14.2367 16.5661C13.8725 16.7761 13.338 16.9072 12.7543 16.9072C12.1706 16.9072 11.6361 16.7761 11.2719 16.5661L3.97337 12.3558C3.93276 12.3324 3.89665 12.3093 3.8646 12.2871L3.17059 11.8867C2.9591 11.7647 2.76518 11.6206 2.59921 11.4568Z" fill="currentColor"/>
                  <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M2.60019 15.9833C2.37436 15.7603 1.96677 15.7404 1.88039 16.0458C1.8351 16.2058 1.81055 16.3748 1.81055 16.5519C1.81055 17.3953 2.36693 18.0517 3.06685 18.4554L10.3653 22.6657C11.0705 23.0725 11.9375 23.2498 12.7553 23.2498C13.5731 23.2498 14.4401 23.0725 15.1452 22.6657L22.4437 18.4554C23.1436 18.0517 23.7 17.3953 23.7 16.5519C23.7 16.3748 23.6754 16.2058 23.6301 16.0458C23.5438 15.7404 23.1362 15.7604 22.9103 15.9833C22.7444 16.1471 22.5505 16.2912 22.339 16.4132L21.645 16.8136C21.6129 16.8358 21.5768 16.8589 21.5362 16.8823L14.2377 21.0926C13.8735 21.3026 13.339 21.4337 12.7553 21.4337C12.1715 21.4337 11.637 21.3026 11.2728 21.0926L3.97435 16.8823C3.93374 16.8589 3.89763 16.8358 3.86558 16.8136L3.17156 16.4132C2.96007 16.2912 2.76616 16.1471 2.60019 15.9833Z" fill="currentColor"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.576 12.6838C10.4632 13.8915 12.9929 14.5425 14.4754 13.6873L22.903 8.82568C24.3856 7.97046 23.257 6.51117 21.1635 6.57625L20.5183 6.5963C19.7633 6.61977 19.1842 6.99188 19.2249 7.42743L19.302 8.25271C19.3052 8.28692 19.3558 8.31315 19.4151 8.31131C19.5136 8.30825 19.5667 8.37688 19.4969 8.4171L14.8324 11.1079C14.3885 11.364 13.631 11.1691 13.6648 10.8075L13.9023 8.26464C13.9754 7.48133 12.8543 6.83458 11.4964 6.8768L7.08837 7.01384C6.46148 7.03333 6.12357 6.59637 6.56749 6.34029L11.2319 3.64951C11.3017 3.60929 11.4206 3.63991 11.4153 3.6967C11.4121 3.73091 11.4576 3.76013 11.5169 3.76198L12.9475 3.80644C13.7026 3.82991 14.3476 3.49586 14.3883 3.0603L14.4231 2.68814C14.5359 1.48042 12.0062 0.829419 10.5237 1.68465L2.09611 6.54624C0.61358 7.40147 1.74209 8.86076 3.83569 8.79567L9.43703 8.62154C10.2502 8.59626 10.9216 8.98357 10.8778 9.45266L10.576 12.6838Z" fill="currentColor"/>
                </svg>
                Check transaction on AXMScan
              </a>
            </Button>
          </div>
        </div> : <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M18.585 16.2291C19.3661 17.0101 20.6324 17.0101 21.4135 16.2291L27.0709 10.5716C27.7217 9.92087 28.7768 9.92087 29.4276 10.5716C30.0784 11.2224 30.0784 12.2775 29.4276 12.9283L23.7701 18.5858C22.9891 19.3668 22.9891 20.6331 23.7701 21.4142L29.4276 27.0716C30.0784 27.7224 30.0784 28.7775 29.4276 29.4283C28.7768 30.0791 27.7217 30.0791 27.0709 29.4283L21.4135 23.7709C20.6324 22.9898 19.3661 22.9898 18.585 23.7709L12.9276 29.4283C12.2768 30.0791 11.2217 30.0791 10.5709 29.4283C9.92014 28.7775 9.92014 27.7224 10.5709 27.0716L16.2284 21.4142C17.0094 20.6331 17.0094 19.3668 16.2284 18.5858L10.5709 12.9283C9.92014 12.2775 9.92014 11.2224 10.5709 10.5716C11.2217 9.92087 12.2768 9.92087 12.9276 10.5716L18.585 16.2291Z" fill="white"/>
            </svg>
          </div>
          <div>Transfer failed</div>
          <div className={styles.errorSubTitle}>Please try again later</div>
          <Button onClick={onCancel} className={styles.errBtn} style={{fontSize: 16}} >
            CLose
          </Button>
        </div>}

      </div>
    </div>
  );
};

export default CanvasPage;

import styles from './index.less';
import CanvasPage from './mask';
import {useState } from 'react';
import { directClaim, preCheck, tweetClaim } from '@/services/home';
import logo from '@/assets/logo.svg'
// import titleImg from '@/assets/title.png';
import { ethers } from "ethers";
import { Timeline, Input, Button, Divider, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { timelineIcon, defaultTimelineIcon, activeTimelineIcon } from '@/componments/Icon';
import CopyModal from './copy-modal';
import { Layout } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Simulate } from 'react-dom/test-utils';
import progress = Simulate.progress;

const { Content, Footer } = Layout;


const HomePage: React.FC = () => {
  const [show, setShow] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [urlErr, setUrlErr] = useState('');
  const [url, setUrl] = useState('');
  const [submitErrMsg, setSubmitErrMsg] = useState('');
  const [val, setVal] = useState('');
  const [hash, setHash] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const provider = new ethers.JsonRpcProvider(window.ST_URL);
  const [copyTooltip, setCopyTooltip] = useState(false);

  const [step, setStep] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [maskError, setMaskError] = useState('');


  const handleChangeValue = (e:any) => {
    setErrMsg('');
    setVal(e.target.value);
  }

  const getRes = async (res:any) => {
    return  provider.getTransactionReceipt(res.txHash);
  }

  const handleAddress = async () => {
    if(!val.trim()){
      setErrMsg('please enter address.');
      return
      // ^0x[0-9a-fA-F]{40}$
    } else if(!(/^0x[0-9a-fA-F]{40}$/).test(val)) {
      setErrMsg('please enter correct address.');
      return
    } else {
      setErrMsg('');
    }
    setStep(2);
  }

  const handleMsg = (num: number, msg: string) => {
    if(num === 100){
      setSubmitErrMsg(msg)
      setUrlErr('');
    } else {
      setUrlErr(msg);
      setSubmitErrMsg('');
    }
  }

  const handleMsgCancel = () =>{
    setSubmitErrMsg('')
    setUrlErr('');
  }

  const handleDirectClaim = async () => {
    setLoading(true);
    const res = await directClaim(val);
    console.log(res);
    setHash(res.txHash);
    if (res.code !== 200) {
      setLoading(false)
      setMaskError(res.msg);
    } else {
      setMaskError('');
      setTimeout(async () => {
        const resData = await getRes(res);
        console.log('resData', resData)
        setLoading(false)
        setShowBtn(true)
      }, 10000)
    }
  }

  const handleTweetClaim = async() => {
    setLoading(true)
    const res = await tweetClaim(val, url);
    setHash(res.txHash);
    if (res.code !== 200) {
      setLoading(false)
      setMaskError(res.msg);
    } else {
      setMaskError('');
      setTimeout(async () => {
        const resData = await getRes(res);
        console.log('resData', resData)
        setLoading(false)
        setShowBtn(true)
      }, 10000)
    }
  }

  const handlePreCheck = async (num: number) => {
    try {
      const res = await preCheck(val);
      if(num === 100) {
        setBtnLoading(true)
      } else {
        setUrlLoading(true);
      }
      if(res.code !== 200){
        handleMsg(num, res.msg)
      } else {
        setShow(true);
        handleMsgCancel();
      }
    } catch (e){
      if(typeof (e) === 'string'){
        handleMsg(num, e)
      } else {
        handleMsg(num, 'Someting went wrong, please try again later')
      }
    } finally {
      setBtnLoading(false);
      setUrlLoading(false);
    }
  }

  const handleSubmit = async() => {
    await handlePreCheck(100)
    await handleDirectClaim()
  }

  const handleCancel = () => {
    setShow(false);
    setShowBtn(false);
  }

  const handleEdit = () => {
    setSubmitErrMsg('')
    setStep(1);
  }

  const handleUrlBlur = (e: any) => {
    const {value} = e.target;
    setUrl(value)
    if(!value){
      setUrlErr('Please enter twitter URL.')
      setIsActive(false)
      return;
    }
    const reg1= /^https?:\/\/twitter.com/;
    const reg2= /^https?:\/\/x.com/;
    if(!reg1.test(value) && !reg2.test(value)){
      setUrlErr('Please enter correct URL.');
      setIsActive(false)
      return
    }
    setIsActive(true)
    setUrlErr('');
  }

  const handleChangeUrl = () => {
    setIsActive(false)
    setUrlErr('');
  }

  const handleSubmitUrl = async () => {
    await handlePreCheck(200);
    await handleTweetClaim();
    // try{
    //   setUrlLoading(true)
    //   const res = await postAddress(val);
    //
    //   if(res.msg !== 'ok') {
    //     setUrlErr(res.msg);
    //   } else {
    //     setUrlErr('');
    //     setUrlLoading(false)
    //   }
    // } catch (e){
    //   console.log(e);
    //   setUrlErr(typeof (e) === 'string' ? e : '')
    // } finally {
    //   setUrlErr('');
    // }
  }

  return (
    <Layout className={styles.container}>
      <Content>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.contentBg}>
              <div className={styles.contentBgIcon}>
                <svg width="558" height="558" viewBox="0 0 558 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g style={{mixBlendMode: 'overlay'}}>
                    <mask id="path-1-inside-1_2396_34675" fill="white">
                      <path fillRule="evenodd" clipRule="evenodd" d="M81.3644 268.156C76.8566 263.707 68.7206 263.309 66.9962 269.404C66.0922 272.599 65.602 275.971 65.6021 279.508C65.6021 296.343 76.7082 309.444 90.6796 317.504L236.367 401.547C250.442 409.666 267.749 413.207 284.073 413.207C300.397 413.207 317.704 409.666 331.779 401.547L477.467 317.504C491.438 309.444 502.544 296.343 502.544 279.508C502.544 275.971 502.054 272.599 501.15 269.404C499.425 263.309 491.289 263.707 486.782 268.156C483.469 271.427 479.598 274.303 475.376 276.738L461.525 284.729C460.885 285.174 460.163 285.634 459.352 286.102L313.664 370.145C306.394 374.338 295.725 376.954 284.073 376.954C272.421 376.954 261.752 374.338 254.482 370.145L108.794 286.102C107.983 285.634 107.262 285.174 106.621 284.729L92.7697 276.738C88.5481 274.303 84.6774 271.427 81.3644 268.156Z"/>
                    </mask>
                    <path fillRule="evenodd" clipRule="evenodd" d="M81.3644 268.156C76.8566 263.707 68.7206 263.309 66.9962 269.404C66.0922 272.599 65.602 275.971 65.6021 279.508C65.6021 296.343 76.7082 309.444 90.6796 317.504L236.367 401.547C250.442 409.666 267.749 413.207 284.073 413.207C300.397 413.207 317.704 409.666 331.779 401.547L477.467 317.504C491.438 309.444 502.544 296.343 502.544 279.508C502.544 275.971 502.054 272.599 501.15 269.404C499.425 263.309 491.289 263.707 486.782 268.156C483.469 271.427 479.598 274.303 475.376 276.738L461.525 284.729C460.885 285.174 460.163 285.634 459.352 286.102L313.664 370.145C306.394 374.338 295.725 376.954 284.073 376.954C272.421 376.954 261.752 374.338 254.482 370.145L108.794 286.102C107.983 285.634 107.262 285.174 106.621 284.729L92.7697 276.738C88.5481 274.303 84.6774 271.427 81.3644 268.156Z" fill="white" fillOpacity="0.2"/>
                    <path d="M65.6021 279.508L54.1547 279.508L65.6021 279.508ZM90.6796 317.504L84.9595 327.42L90.6796 317.504ZM236.367 401.547L230.647 411.462V411.462L236.367 401.547ZM284.073 413.207V424.654H284.073L284.073 413.207ZM331.779 401.547L326.059 391.631L326.059 391.631L331.779 401.547ZM477.467 317.504L471.746 307.588L477.467 317.504ZM502.544 279.508H491.097V279.508L502.544 279.508ZM475.376 276.738L481.096 286.654L481.096 286.654L475.376 276.738ZM461.525 284.729L455.805 274.813L455.386 275.055L454.989 275.331L461.525 284.729ZM459.352 286.102L453.632 276.186L453.632 276.186L459.352 286.102ZM313.664 370.145L319.384 380.06L313.664 370.145ZM284.073 376.954V388.402V376.954ZM254.482 370.145L248.762 380.06L248.762 380.06L254.482 370.145ZM108.794 286.102L103.074 296.018L103.074 296.018L108.794 286.102ZM106.621 284.729L113.157 275.331L112.76 275.055L112.341 274.813L106.621 284.729ZM92.7697 276.738L87.0496 286.654L92.7697 276.738ZM501.15 269.404L490.135 272.52L501.15 269.404ZM486.782 268.156L478.74 260.01L486.782 268.156ZM77.0494 279.508C77.0494 277.041 77.3896 274.717 78.0112 272.52L55.9812 266.287C54.7949 270.48 54.1547 274.901 54.1547 279.508L77.0494 279.508ZM96.3996 307.588C84.4509 300.695 77.0494 290.756 77.0494 279.508L54.1547 279.508C54.1547 301.93 68.9655 318.193 84.9595 327.42L96.3996 307.588ZM242.087 391.631L96.3996 307.588L84.9595 327.42L230.647 411.462L242.087 391.631ZM284.073 401.759C269.222 401.759 254.012 398.51 242.087 391.631L230.647 411.462C246.873 420.822 266.275 424.654 284.073 424.654V401.759ZM326.059 391.631C314.134 398.51 298.924 401.759 284.073 401.759L284.073 424.654C301.871 424.654 321.274 420.822 337.499 411.462L326.059 391.631ZM471.746 307.588L326.059 391.631L337.499 411.462L483.187 327.42L471.746 307.588ZM491.097 279.508C491.097 290.756 483.695 300.695 471.746 307.588L483.187 327.42C499.181 318.193 513.991 301.93 513.991 279.508L491.097 279.508ZM490.135 272.52C490.756 274.717 491.097 277.041 491.097 279.508H513.991C513.991 274.901 513.351 270.48 512.165 266.287L490.135 272.52ZM478.74 260.01C476.202 262.515 473.135 264.816 469.656 266.823L481.096 286.654C486.061 283.79 490.735 280.339 494.824 276.303L478.74 260.01ZM469.656 266.823L455.805 274.813L467.245 294.645L481.096 286.654L469.656 266.823ZM465.072 296.018C466.15 295.396 467.144 294.764 468.061 294.127L454.989 275.331C454.625 275.584 454.176 275.872 453.632 276.186L465.072 296.018ZM319.384 380.06L465.072 296.018L453.632 276.186L307.944 360.229L319.384 380.06ZM284.073 388.402C297.203 388.402 309.968 385.492 319.384 380.06L307.944 360.229C302.821 363.184 294.246 365.507 284.073 365.507V388.402ZM248.762 380.06C258.178 385.493 270.943 388.402 284.073 388.402V365.507C273.9 365.507 265.325 363.184 260.202 360.229L248.762 380.06ZM103.074 296.018L248.762 380.06L260.202 360.229L114.514 276.186L103.074 296.018ZM100.085 294.127C101.002 294.764 101.996 295.396 103.074 296.018L114.514 276.186C113.97 275.872 113.521 275.584 113.157 275.331L100.085 294.127ZM112.341 274.813L98.4898 266.823L87.0496 286.654L100.901 294.645L112.341 274.813ZM98.4898 266.823C95.0114 264.816 91.9441 262.515 89.4063 260.01L73.3225 276.303C77.4107 280.339 82.0849 283.79 87.0496 286.654L98.4898 266.823ZM512.165 266.287C509.669 257.465 502.089 253.638 495.441 253.387C489.324 253.156 483.136 255.67 478.74 260.01L494.824 276.303C494.803 276.323 494.844 276.283 494.927 276.25C495.024 276.211 494.929 276.278 494.578 276.265C494.225 276.252 493.313 276.134 492.262 275.401C491.091 274.584 490.397 273.446 490.135 272.52L512.165 266.287ZM78.0112 272.52C77.7493 273.446 77.0554 274.584 75.8836 275.401C74.8329 276.134 73.9209 276.252 73.5685 276.265C73.2169 276.278 73.1224 276.211 73.2193 276.25C73.3016 276.283 73.3428 276.323 73.3225 276.303L89.4063 260.01C85.01 255.67 78.8223 253.156 72.7046 253.387C66.0568 253.638 58.4773 257.465 55.9812 266.287L78.0112 272.52Z" fill="white" fillOpacity="0.2" mask="url(#path-1-inside-1_2396_34675)"/>
                  </g>
                  <g style={{mixBlendMode: 'overlay'}}>
                    <mask id="path-3-inside-2_2396_34675" fill="white">
                      <path fillRule="evenodd" clipRule="evenodd" d="M81.3888 358.511C76.8811 354.062 68.745 353.664 67.0207 359.759C66.1167 362.954 65.6265 366.326 65.6265 369.863C65.6265 386.698 76.7326 399.8 90.704 407.859L236.392 491.902C250.467 500.021 267.773 503.562 284.097 503.562C300.422 503.562 317.728 500.021 331.803 491.902L477.491 407.859C491.462 399.8 502.568 386.698 502.568 369.863C502.568 366.326 502.078 362.954 501.174 359.759C499.45 353.664 491.314 354.062 486.806 358.512C483.493 361.782 479.622 364.658 475.401 367.094L461.55 375.084C460.909 375.529 460.188 375.989 459.376 376.457L313.689 460.5C306.419 464.694 295.749 467.31 284.097 467.31C272.446 467.31 261.776 464.694 254.506 460.5L108.819 376.457C108.007 375.989 107.285 375.529 106.645 375.084L92.7941 367.094C88.5725 364.658 84.7018 361.782 81.3888 358.511Z"/>
                    </mask>
                    <path fillRule="evenodd" clipRule="evenodd" d="M81.3888 358.511C76.8811 354.062 68.745 353.664 67.0207 359.759C66.1167 362.954 65.6265 366.326 65.6265 369.863C65.6265 386.698 76.7326 399.8 90.704 407.859L236.392 491.902C250.467 500.021 267.773 503.562 284.097 503.562C300.422 503.562 317.728 500.021 331.803 491.902L477.491 407.859C491.462 399.8 502.568 386.698 502.568 369.863C502.568 366.326 502.078 362.954 501.174 359.759C499.45 353.664 491.314 354.062 486.806 358.512C483.493 361.782 479.622 364.658 475.401 367.094L461.55 375.084C460.909 375.529 460.188 375.989 459.376 376.457L313.689 460.5C306.419 464.694 295.749 467.31 284.097 467.31C272.446 467.31 261.776 464.694 254.506 460.5L108.819 376.457C108.007 375.989 107.285 375.529 106.645 375.084L92.7941 367.094C88.5725 364.658 84.7018 361.782 81.3888 358.511Z" fill="white" fillOpacity="0.2"/>
                    <path d="M65.6265 369.863L54.1791 369.863L65.6265 369.863ZM90.704 407.859L84.9839 417.775L90.704 407.859ZM236.392 491.902L230.671 501.818H230.671L236.392 491.902ZM284.097 503.562V515.009H284.097L284.097 503.562ZM331.803 491.902L326.083 481.986V481.986L331.803 491.902ZM477.491 407.859L471.771 397.944L477.491 407.859ZM502.568 369.863H491.121V369.863L502.568 369.863ZM475.401 367.094L481.121 377.009L481.121 377.009L475.401 367.094ZM461.55 375.084L455.83 365.168L455.411 365.409L455.014 365.686L461.55 375.084ZM459.376 376.457L465.096 386.373L465.096 386.373L459.376 376.457ZM313.689 460.5L319.409 470.416V470.416L313.689 460.5ZM284.097 467.31V478.757H284.097L284.097 467.31ZM254.506 460.5L248.786 470.416L248.786 470.416L254.506 460.5ZM108.819 376.457L114.539 366.542L114.539 366.542L108.819 376.457ZM106.645 375.084L113.181 365.686L112.784 365.41L112.365 365.168L106.645 375.084ZM92.7941 367.094L87.074 377.009L92.7941 367.094ZM501.174 359.759L490.159 362.875L501.174 359.759ZM77.0738 369.863C77.0738 367.396 77.414 365.072 78.0357 362.875L56.0057 356.642C54.8193 360.836 54.1791 365.256 54.1791 369.863L77.0738 369.863ZM96.4241 397.944C84.4753 391.051 77.0738 381.111 77.0738 369.863L54.1791 369.863C54.1791 392.286 68.9899 408.549 84.9839 417.775L96.4241 397.944ZM242.112 481.986L96.4241 397.944L84.9839 417.775L230.671 501.818L242.112 481.986ZM284.097 492.115C269.247 492.115 254.037 488.865 242.112 481.986L230.671 501.818C246.897 511.178 266.3 515.009 284.097 515.009V492.115ZM326.083 481.986C314.158 488.865 298.948 492.115 284.097 492.115L284.097 515.009C301.895 515.009 321.298 511.178 337.523 501.818L326.083 481.986ZM471.771 397.944L326.083 481.986L337.523 501.818L483.211 417.775L471.771 397.944ZM491.121 369.863C491.121 381.111 483.72 391.051 471.771 397.944L483.211 417.775C499.205 408.549 514.016 392.286 514.016 369.863L491.121 369.863ZM490.159 362.875C490.781 365.072 491.121 367.396 491.121 369.863H514.016C514.016 365.256 513.376 360.836 512.189 356.643L490.159 362.875ZM478.764 350.365C476.226 352.87 473.159 355.171 469.681 357.178L481.121 377.009C486.086 374.145 490.76 370.694 494.848 366.658L478.764 350.365ZM469.681 357.178L455.83 365.168L467.27 384.999L481.121 377.009L469.681 357.178ZM465.096 386.373C466.175 385.751 467.17 385.119 468.086 384.482L455.014 365.686C454.649 365.939 454.201 366.227 453.656 366.542L465.096 386.373ZM319.409 470.416L465.096 386.373L453.656 366.542L307.969 450.584L319.409 470.416ZM284.097 478.757C297.228 478.757 309.992 475.848 319.409 470.416L307.969 450.584C302.845 453.539 294.271 455.862 284.097 455.862L284.097 478.757ZM248.786 470.416C258.203 475.848 270.967 478.757 284.097 478.757V455.862C273.924 455.862 265.349 453.539 260.226 450.584L248.786 470.416ZM103.099 386.373L248.786 470.416L260.226 450.584L114.539 366.542L103.099 386.373ZM100.109 384.482C101.025 385.119 102.02 385.751 103.099 386.373L114.539 366.542C113.994 366.227 113.546 365.939 113.181 365.686L100.109 384.482ZM112.365 365.168L98.5142 357.178L87.074 377.009L100.925 384.999L112.365 365.168ZM98.5142 357.178C95.0358 355.171 91.9685 352.87 89.4307 350.365L73.3469 366.658C77.4351 370.694 82.1093 374.145 87.074 377.009L98.5142 357.178ZM512.189 356.643C509.693 347.82 502.114 343.993 495.466 343.742C489.348 343.511 483.16 346.025 478.764 350.365L494.848 366.658C494.828 366.678 494.869 366.638 494.951 366.605C495.048 366.566 494.953 366.633 494.602 366.62C494.25 366.607 493.338 366.489 492.287 365.756C491.115 364.939 490.421 363.801 490.159 362.875L512.189 356.643ZM78.0357 362.875C77.7737 363.801 77.0799 364.939 75.908 365.756C74.8573 366.489 73.9453 366.607 73.5929 366.62C73.2414 366.633 73.1468 366.566 73.2437 366.605C73.3261 366.638 73.3672 366.678 73.3469 366.658L89.4307 350.365C85.0344 346.025 78.8467 343.511 72.7291 343.742C66.0813 343.993 58.5017 347.82 56.0057 356.642L78.0357 362.875Z" fill="white" fillOpacity="0.2" mask="url(#path-3-inside-2_2396_34675)"/>
                  </g>
                  <g style={{mixBlendMode: 'overlay'}}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M240.604 292.65C238.352 316.758 288.848 329.752 318.441 312.681L486.667 215.637C516.26 198.565 493.733 169.436 451.943 170.735L440.77 171.082C424.757 171.58 412.475 179.472 413.338 188.71L414.785 204.2C414.849 204.882 415.86 205.406 417.044 205.369C419.009 205.308 420.068 206.678 418.677 207.481L326.927 260.409C317.587 265.796 301.652 261.695 302.363 254.087L307 204.438C308.46 188.802 286.08 175.892 258.975 176.734L172.906 179.41C159.718 179.82 152.609 170.628 161.948 165.24L253.697 112.314C255.088 111.511 257.463 112.122 257.357 113.256C257.294 113.938 258.201 114.522 259.385 114.558L286.236 115.393C302.25 115.891 315.931 108.806 316.793 99.5683L317.395 93.1234C319.647 69.0157 269.152 56.0208 239.558 73.0923L71.3333 170.136C41.74 187.208 64.2665 216.337 106.058 215.038L219.019 211.526C234.636 211.04 247.531 218.479 246.689 227.488L240.604 292.65Z" fill="white" fillOpacity="0.2"/>
                    <path d="M247.605 292.868C245.699 313.271 288.437 324.269 313.483 309.821L481.709 212.777C506.755 198.328 487.69 173.675 452.32 174.774L441.148 175.121C429.001 175.499 419.685 181.485 420.34 188.492L421.598 201.963C426.542 203.54 428.258 207.674 423.635 210.341L331.884 263.269C317.999 271.279 294.305 265.182 295.361 253.87L299.998 204.22C301.234 190.987 282.293 180.06 259.353 180.773L173.283 183.449C153.674 184.059 143.104 170.391 156.99 162.38L248.739 109.453C253.362 106.786 260.528 107.776 263.262 110.628L286.614 111.354C298.76 111.732 309.138 106.358 309.792 99.3507L310.394 92.9057C312.3 72.5021 269.563 61.5038 244.516 75.9523L76.2912 172.996C51.2447 187.445 70.3102 212.098 105.68 210.999L218.642 207.487C238.424 206.872 254.757 216.294 253.691 227.705L247.605 292.868Z" stroke="white" strokeOpacity="0.2" strokeWidth="11.4474"/>
                  </g>
                </svg>
              </div>
              <div className={styles.contentTitle}>
                <div className={styles.miniTitle}>AXM Faucet</div>
                <div className={styles.minTitle}>
                  Axiomesh AXM Faucet
                  {/*<img src={titleImg} alt='' />*/}
                </div>

                {/*<div className={styles.inputBox}>*/}
                {/*  <Input onChange={handleChangeValue} placeholder="Address" className={styles.input} />*/}
                {/*</div>*/}
              </div>
              <div className={step=== 1 ? styles.timelineContent : styles.timelineContent2}>
                <Timeline
                  items={[
                    {
                      color: 'gray',
                      children: (
                        <div style={{color: '#fff', textAlign: 'left', paddingLeft: 50, fontSize: 16, fontFamily: 'Inter-Bold'}} className={step === 1 ? styles.step1 : `${styles.step1} ${styles.thin}`}>
                          <div className={styles.firstIndexNum}>1</div>
                          <p>Fill your address below and get 100 test AXM for free</p>

                          <div className={styles.inputBox}>
                            <Input
                              onChange={handleChangeValue}
                              disabled={step === 2}
                              placeholder="Address"
                              suffix={step === 1 ? null : <div className={styles.editText} onClick={handleEdit}>Edit</div>}
                              className={errMsg ? `${styles.input} ${styles.inputError}` : step === 1 ? styles.input : `${styles.input} ${styles.inputDisabled}`}
                            />
                          </div>
                          {errMsg ? <div className={styles.error}>{errMsg}</div> : null}
                          <div className={step === 1 ? styles.step1Content : `${styles.step1Content} ${styles.hidden}`}>
                            <div className={styles.btnBox}>
                              <Button onClick={handleAddress} className={styles.btn}>Continue</Button>
                            </div>
                          </div>
                        </div>
                      ),
                      dot: <Icon component={step=== 1 ? timelineIcon : activeTimelineIcon} style={{fontSize: 50}} />
                      // dot: <TimelineIcon />
                    },
                    {
                      color: 'gray',
                      children: (
                        <div style={{color: '#fff', textAlign: 'left', paddingLeft: 50, fontSize: 16}} className={step === 1 ? styles.step2 : `${styles.step2} ${styles.strong}`}>
                          <div className={styles.indexNum}>2</div>
                          <p style={{color: step=== 1 ? "rgba(255,255,255,.6)" : 'inherit', fontFamily: 'Inter-Bold'}}>Follow @Axiomesh and tweet for a 2x bonus</p>
                          <div style={{color: "rgba(255,255,255,.6)"}} className={step === 1 ? styles.step2Content : `${styles.step2Content} ${styles.show}`}>
                            <div className={styles.followBox} style={{marginBottom: 12}}>
                              <div >1. Follow @Axiomesh</div>
                              <Button className={styles.followBtn}>
                                <a rel="noreferrer" target="_blank" href='https://twitter.com/axiomesh' className={styles.btnText}>Follow</a>
                              </Button>
                            </div>
                            <div className={styles.followBox}>
                              <div>2. Please tweet with the Axiomesh faucet and your address.</div>
                              <Button className={styles.followBtn} onClick={() => setVisible(true)}>
                                <span className={styles.btnText}>Tweet</span>
                              </Button>
                            </div>
                            <div>
                              <div style={{color: '#fff', marginTop: 12, fontFamily: 'Inter-Bold'}}>Tweet URL</div>
                              <div style={{marginTop: 12, marginBottom: 16}}>
                                <div className={styles.followBox}>
                                  <Input placeholder="Tweet URL" onChange={handleChangeUrl} onBlur={handleUrlBlur} className={urlErr ? `${styles.followInput} ${styles.inputError}` :styles.followInput} />
                                  <div className={styles.btnBox} style={{marginTop: 0}}>
                                    <Button
                                      loading={urlLoading}
                                      disabled={!isActive}
                                      onClick={handleSubmitUrl}
                                      className={isActive ? styles.btn : styles.disabledBtn}
                                    >
                                      Claim 200 AXM
                                      {urlLoading ?<span role="img" className="ant-btn-icon ant-btn-loading-icon define-loading" style={{marginLeft: 8}}>
                                    <span className="anticon anticon-loading anticon-spin">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6819 14.6666 7.99998C14.6666 4.31808 11.6818 1.33331 7.99992 1.33331C4.31802 1.33331 1.33325 4.31808 1.33325 7.99998C1.33325 11.6819 4.31802 14.6666 7.99992 14.6666Z" stroke="url(#paint0_linear_3379_28339)" strokeWidth="2.66667"/>
                                      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58162 0 0 3.58162 0 8H2.66667C2.66667 5.05438 5.05438 2.66667 8 2.66667C8.73638 2.66667 9.33333 2.06971 9.33333 1.33333C9.33333 0.596954 8.73638 0 8 0Z" fill="white"/>
                                      <defs>
                                      <linearGradient id="paint0_linear_3379_28339" x1="5.08712" y1="9.83198" x2="11.2838" y2="3.70438" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="white"/>
                                      <stop offset="1" stopColor="white" stopOpacity="0"/>
                                      </linearGradient>
                                      </defs>
                                      </svg>
                                    </span>
                                  </span> : null}
                                    </Button>
                                  </div>
                                </div>
                                {urlErr ? <div className={styles.error} style={{width: "calc(100% - 206px)"}}>{urlErr}</div> : null}
                              </div>
                              <div className={styles.itemSubTitle} style={{width: "calc(100% - 206px)"}}>
                                We will automatically generate tweet content for you. Please copy it and send a tweet. Then come back and paste the tweet URL here.
                              </div>
                            </div>
                            <Divider>OR</Divider>
                            <div className={styles.itemSubTitle} style={{fontSize: 16}}>If you don't want to follow @Axiomesh or tweet on Twitter, just click the button below and get 100 AXM.</div>
                            <div className={styles.btnBox}>
                              {submitErrMsg ==='The address already has enough test tokens' || submitErrMsg === 'The address has recently received test tokens' ?<Button
                                  disabled
                                  className={styles.disabledBtn}
                                >{submitErrMsg}</Button> :
                                <Button loading={btnLoading} onClick={handleSubmit} style={{width: 300}} className={btnLoading ? styles.btnLoading :styles.btn} >
                                  No thanks, just send me 100 AXM
                                  {btnLoading ?<span role="img" className="ant-btn-icon ant-btn-loading-icon define-loading" style={{marginLeft: 8}}>
                                    <span className="anticon anticon-loading anticon-spin">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6819 14.6666 7.99998C14.6666 4.31808 11.6818 1.33331 7.99992 1.33331C4.31802 1.33331 1.33325 4.31808 1.33325 7.99998C1.33325 11.6819 4.31802 14.6666 7.99992 14.6666Z" stroke="url(#paint0_linear_3379_28339)" strokeWidth="2.66667"/>
                                      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58162 0 0 3.58162 0 8H2.66667C2.66667 5.05438 5.05438 2.66667 8 2.66667C8.73638 2.66667 9.33333 2.06971 9.33333 1.33333C9.33333 0.596954 8.73638 0 8 0Z" fill="white"/>
                                      <defs>
                                      <linearGradient id="paint0_linear_3379_28339" x1="5.08712" y1="9.83198" x2="11.2838" y2="3.70438" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="white"/>
                                      <stop offset="1" stopColor="white" stopOpacity="0"/>
                                      </linearGradient>
                                      </defs>
                                      </svg>
                                    </span>
                                  </span> : null}
                                </Button>}

                            </div>
                            {submitErrMsg ? <div className={styles.errorBox}>
                              <div className={styles.errorText}>
                                {submitErrMsg}
                              </div>
                            </div> : null}
                          </div>
                        </div>
                      ),
                      dot: <Icon component={step=== 1 ? defaultTimelineIcon : timelineIcon} style={{fontSize: 50}} />
                    },
                  ]}
                />
              </div>
            </div>

          </div>
        </div>
      </Content>
      <Footer className={styles.footer}>
        <div className={styles.first}>
          {/*<img src={footImg} width={234} alt=''/>*/}
          <div style={{display: 'flex', alignItems: "center"}}>
            <img src={logo} alt='logo' />
            <span style={{color: '#fff', fontSize: '20px', marginLeft: 8}}>Axiomesh AXM Faucet</span>
          </div>
          <div style={{display: 'flex', alignItems: "center" }}>
            <Tooltip
              color='#DCDEE8'
              overlayInnerStyle={{color: '#0D0D0D'}}
              title={copyTooltip ? "Copied" : 'Copy'}
            >
              <CopyToClipboard
                onCopy={() => {
                  setCopyTooltip(true);
                  setTimeout(() => {
                    setCopyTooltip(false);
                  }, 1000);
                }}
                text={window.supportMail}
              >
                <div>
                  <div className={styles.mail}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <g filter="url(#filter0_f_5943_7144)">
                        <circle cx="10.3298" cy="10" r="2.5" fill="#ECC94B" fillOpacity="0.2"/>
                      </g>
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.3103 5H5.35427L10.3323 9.04798L15.3103 5ZM3.24836 4.8648C2.98395 5.26131 2.82983 5.73766 2.82983 6.25V13.75C2.82983 15.1307 3.94912 16.25 5.32983 16.25H15.3298C16.7105 16.25 17.8298 15.1307 17.8298 13.75V6.25C17.8298 4.86929 16.7105 3.75 15.3298 3.75H5.32983C4.63819 3.75 4.01214 4.03087 3.55953 4.48478C3.44387 4.60074 3.33953 4.728 3.24831 4.86475L3.24836 4.8648ZM4.22716 5.66073L9.36245 9.83661C9.89807 10.2722 10.7665 10.2722 11.3021 9.83661L16.434 5.6635C16.5271 5.8384 16.5798 6.03804 16.5798 6.25V13.75C16.5798 14.4404 16.0202 15 15.3298 15H5.32983C4.63948 15 4.07983 14.4404 4.07983 13.75V6.25C4.07983 6.03692 4.13315 5.8363 4.22716 5.66073Z" fill="#718096"/>
                      <defs>
                        <filter id="filter0_f_5943_7144" x="2.82983" y="2.5" width="15" height="15" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                          <feGaussianBlur stdDeviation="2.5" result="effect1_foregroundBlur_5943_7144"/>
                        </filter>
                      </defs>
                    </svg>
                    <span>{window.supportMail}</span>
                  </div>
                </div>
              </CopyToClipboard>
            </Tooltip>
            <a rel="noreferrer" target="_blank" href={window.TwitterUrl}  style={{marginLeft: 8}}  className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="15.9993" cy="16.0003" r="12.8333" stroke="currentColor"/>
                <path d="M13.5428 22.9997C11.6557 22.9997 9.89662 22.4508 8.41602 21.5038C9.67309 21.5851 11.8916 21.3903 13.2714 20.0741C11.1956 19.9789 10.2595 18.3868 10.1374 17.7065C10.3138 17.7745 11.1549 17.8562 11.6298 17.6657C9.24196 17.067 8.87564 14.9714 8.95704 14.3319C9.40476 14.6449 10.1645 14.7537 10.463 14.7265C8.23798 13.1345 9.03845 10.7396 9.4319 10.2225C11.0287 12.4347 13.4217 13.6772 16.3822 13.7463C16.3264 13.5015 16.2969 13.2466 16.2969 12.9848C16.2969 11.106 17.8155 9.58301 19.6888 9.58301C20.6675 9.58301 21.5494 9.99878 22.1685 10.6638C22.8225 10.5106 23.8069 10.1518 24.2881 9.84154C24.0455 10.7124 23.2904 11.4389 22.8336 11.7081C22.8299 11.6989 22.8374 11.7173 22.8336 11.7081C23.2349 11.6474 24.3205 11.4388 24.7493 11.1478C24.5373 11.6371 23.7367 12.4505 23.0797 12.9059C23.2019 18.2969 19.0773 22.9997 13.5428 22.9997Z" fill="currentColor"/>
              </svg>
            </a>
            <a rel="noreferrer" target="_blank" href={window.DiscordUrl}   style={{marginLeft: 8}} className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="15.9993" cy="16.0003" r="12.8333" stroke="currentColor"/>
                <path d="M22.016 10.753C20.894 10.2598 19.6942 9.90135 18.44 9.69727C18.2859 9.95891 18.106 10.3108 17.9819 10.5908C16.6486 10.4024 15.3275 10.4024 14.0187 10.5908C13.8947 10.3108 13.7106 9.95891 13.5552 9.69727C12.2996 9.90135 11.0985 10.2611 9.97648 10.7556C7.71336 13.9686 7.09987 17.1019 7.40661 20.1905C8.90763 21.2437 10.3623 21.8834 11.7924 22.302C12.1455 21.8455 12.4605 21.3601 12.7318 20.8486C12.2151 20.6641 11.7202 20.4365 11.2525 20.1722C11.3766 20.0859 11.4979 19.9956 11.6152 19.9028C14.4673 21.156 17.5661 21.156 20.3841 19.9028C20.5027 19.9956 20.624 20.0859 20.7467 20.1722C20.2778 20.4378 19.7815 20.6654 19.2648 20.8499C19.5361 21.3601 19.8497 21.8468 20.2041 22.3033C21.6356 21.8847 23.0916 21.245 24.5927 20.1905C24.9526 16.61 23.9778 13.5055 22.016 10.753ZM13.1203 18.291C12.2641 18.291 11.562 17.5401 11.562 16.6257C11.562 15.7112 12.2491 14.959 13.1203 14.959C13.9915 14.959 14.6936 15.7099 14.6786 16.6257C14.68 17.5401 13.9915 18.291 13.1203 18.291ZM18.879 18.291C18.0228 18.291 17.3207 17.5401 17.3207 16.6257C17.3207 15.7112 18.0078 14.959 18.879 14.959C19.7501 14.959 20.4523 15.7099 20.4373 16.6257C20.4373 17.5401 19.7501 18.291 18.879 18.291Z" fill="currentColor"/>
              </svg>
            </a>
            <a rel="noreferrer" target="_blank" href={window.GitUrl}  style={{marginLeft: 8}} className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8871 4.26666C9.2595 4.26666 3.88525 9.63996 3.88525 16.2685C3.88525 21.5713 7.32413 26.07 12.0928 27.657C12.6926 27.7681 12.9129 27.3967 12.9129 27.0796C12.9129 26.7935 12.9017 25.848 12.8966 24.8451C9.5576 25.5711 8.85305 23.4291 8.85305 23.4291C8.30711 22.0418 7.52048 21.673 7.52048 21.673C6.43161 20.9281 7.60256 20.9433 7.60256 20.9433C8.80778 21.0281 9.44239 22.1802 9.44239 22.1802C10.5128 24.015 12.25 23.4845 12.9349 23.1779C13.0426 22.4021 13.3537 21.8728 13.6969 21.5731C11.0312 21.2695 8.2288 20.2404 8.2288 15.6417C8.2288 14.3314 8.69765 13.2607 9.46545 12.4202C9.34082 12.1179 8.93005 10.8972 9.5817 9.24406C9.5817 9.24406 10.5895 8.92148 12.8831 10.4743C13.8403 10.2083 14.8671 10.075 15.8871 10.0705C16.907 10.075 17.9345 10.2083 18.8937 10.4743C21.1845 8.92148 22.1909 9.24406 22.1909 9.24406C22.8442 10.8972 22.4332 12.1179 22.3086 12.4202C23.0781 13.2607 23.5437 14.3313 23.5437 15.6417C23.5437 20.2513 20.7361 21.2664 18.0636 21.5635C18.494 21.9359 18.8776 22.6664 18.8776 23.786C18.8776 25.3918 18.8637 26.6843 18.8637 27.0796C18.8637 27.399 19.0797 27.7733 19.6881 27.6554C24.4542 26.0666 27.8888 21.5695 27.8888 16.2685C27.8888 9.63996 22.5153 4.26666 15.8871 4.26666Z" fill="currentColor"/>
              </svg>
            </a>

            <a rel="noreferrer" target="_blank" href={window.ForumUrl}  style={{marginLeft: 8}} className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15.9993" cy="16.0003" r="12.8333" stroke="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M23.0312 12.2812C23.0312 10.7279 21.7721 9.46875 20.2188 9.46875H11.7812C10.2279 9.46875 8.96875 10.7279 8.96875 12.2812V17.9062C8.96875 19.4596 10.2279 20.7188 11.7812 20.7188V22.5369C11.7812 23.0861 12.2264 23.5312 12.7756 23.5312C13.0393 23.5312 13.2923 23.4265 13.4787 23.24L16 20.7187L20.2188 20.7188C21.7721 20.7188 23.0312 19.4596 23.0312 17.9062V12.2812ZM18.3584 15.094C18.3584 15.62 18.7847 16.0464 19.3107 16.0464C19.8367 16.0464 20.2631 15.62 20.2631 15.094C20.2631 14.568 19.8367 14.1416 19.3107 14.1416C18.7847 14.1416 18.3584 14.568 18.3584 15.094ZM15.0473 15.094C15.0473 15.62 15.4737 16.0464 15.9997 16.0464C16.5257 16.0464 16.9521 15.62 16.9521 15.094C16.9521 14.568 16.5257 14.1416 15.9997 14.1416C15.4737 14.1416 15.0473 14.568 15.0473 15.094ZM12.6887 16.0464C12.1627 16.0464 11.7363 15.62 11.7363 15.094C11.7363 14.568 12.1627 14.1416 12.6887 14.1416C13.2147 14.1416 13.6411 14.568 13.6411 15.094C13.6411 15.62 13.2147 16.0464 12.6887 16.0464Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
        <div style={{color: '#CBD5E0'}}>Axiomesh all rights reserved.</div>
      </Footer>
      {
        show ? <CanvasPage hash={hash} onCancel={handleCancel} err={maskError} showBtn={showBtn} loading={loading} /> : null
      }


      <CopyModal address={val} visible={visible} onCancel={() => setVisible(false)} />
    </Layout>
  );
};

export default HomePage;

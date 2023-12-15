import { Modal, Button } from 'antd';
import styles from './index.less';


const CopyModal: React.FC = (props: any) => {
  const { visible, onCancel, address} = props;
  const text = `I am getting some free AXMs from Axiomesh Testnet at @Axiomesh for my wallet address ${address} \n https://x.com/axiomesh/status/1735135145391534095?s=20 \n #Axiomesh`

  const onCopy = () => {
    const intentUrl =`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    onCancel();
    window.open(intentUrl, "_blank")
  }
  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      visible={visible}
      footer={null}
      style={{ top: 160 }}
      width="560px"
      onCancel={() => onCancel()}
      title={<div className="text">Please post a tweet on Twitter using the following contents</div>}
    >
      <div className={styles.copyContent}>
        {text}
      </div>
      <div className={styles.btnBox}>
        <Button className={styles.btn} onClick={onCopy} style={{width: '100%'}}>Tweet</Button>
      </div>
    </Modal>
  );
};

export default CopyModal;

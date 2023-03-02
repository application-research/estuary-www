import styles from '@components/Wallet.module.scss';
import * as React from 'react';
import * as R from '@common/requests';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import * as C from '@common/constants';

import Modal from '@components/Modal';
import style from '@pages/StorageProvidersTable.module.scss';
import balance from '@pages/admin/balance';

function Wallet(props: any) {

  const [state, setState] = React.useState({ account: null, fil: null, price: null, balance: null});
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  let web3: any;

  React.useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }
    const run = async () => {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Logout on wallet change
        const token = Cookies.get(C.auth);
        const response = R.del(`/user/api-keys/${token}`, props.api);
        Cookies.remove(C.auth);
        window.location.href = '/';
      })

      // Check if User is already connected by retrieving the accounts
      const accounts = await web3.eth.getAccounts()
      if (accounts) {
        setState({ ...state, account: accounts[0] });
      }
    };

    run();
  }, []);

  React.useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }

    const run = async () => {
      const fil = Web3.utils.fromWei(await web3.eth.getBalance(state.account))
      const transaction = await web3.eth.get

      const url = `https://data.storage.market/api/market/filecoin?amount=${fil}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        return "Error fetching filecoin price from https://data.storage.market"
      }

      const j = await response.json();

      if (fil) {
        setState({ ...state, fil: fil, price: j.price, balance: j.amount_usd });
      }
    };

    if (state.account != null) {
      run();
    }
  }, [showWalletModal, setShowWalletModal]);

  return state.account ? (
    <div className={styles.item}>
      <a
      onClick={() => {setShowWalletModal(true)}}>
        {state.account.slice(0, 6)}...{state.account.slice(state.account.length - 4, state.account.length)}
      </a>
      {showWalletModal && (
        <Modal
          title="Wallet"
          onClose={() => {
            setShowWalletModal(false)
          }}
        >
          <table className={style.table} style={{ marginBottom: '80px', marginTop: '20px'}}>
            <tbody>
              <tr className={style.tr}>
                <td className={style.td} style={{ color: 'black' }}>Address</td>
                <td className={style.td} style={{ color: 'black' }}>{state.account}</td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td} style={{ color: 'black' }}>Filecoin</td>
                <td className={style.td} style={{ color: 'black' }}>{state.fil} FIL</td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td} style={{ color: 'black' }}>Price</td>
                <td className={style.td} style={{ color: 'black' }}>{state.price} USD</td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td} style={{ color: 'black' }}>Balance</td>
                <td className={style.td} style={{ color: 'black' }}>{state.balance} USD</td>
              </tr>
            </tbody>
          </table>
        </Modal>
      )}
    </div>

  ) : null
}

export default Wallet;
import style from '@components/Wallet.module.scss';
import * as React from 'react';
import * as R from '@common/requests';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import * as C from '@common/constants';

import Modal from '@components/Modal';
import { network } from '@common/constants';

function Wallet(props: any) {

  const [state, setState] = React.useState({ account: null, fil: null, price: null, balance: null});
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  let web3: any;

  React.useEffect(() => {
    if (!window.ethereum) {
      return
    }
    web3 = new Web3(window.ethereum);
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
    if (!window.ethereum) {
      return
    }
    web3 = new Web3(window.ethereum);
    const run = async () => {
      const fil = Web3.utils.fromWei(await web3.eth.getBalance(state.account))
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
    <div className={style.item}>
      <a
        onClick={() => {
          setShowWalletModal(true);
        }}>
        {state.account.slice(0, 6)}...{state.account.slice(state.account.length - 4, state.account.length)}
      </a>
      {showWalletModal && (
        <Modal
          title='Wallet'
          onClose={() => {
            setShowWalletModal(false);
          }}
        >
          <table className={style.table}>
            <tbody>
              <tr className={style.tr}>
                <td className={style.td}>Address</td>
                <td className={style.td}>
                  <a className={style.link} target="_blank" href={`${network.blockExplorer}/address/${state.account}`}>{state.account}</a>
                  <button
                    style={{ opacity: 0.5, outline: 'None', fontFamily: 'mono', marginLeft: '10px'}}
                    onClick={(e) => {
                      navigator.clipboard.writeText(state.account);
                      e.currentTarget.textContent = 'Copied!';
                      setTimeout((button) => (button.textContent = 'Copy'), 1000, e.currentTarget);
                    }}
                  >
                    Copy
                  </button>
                </td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td}>Filecoin</td>
                <td className={style.td}>{state.fil} {network.nativeCurrency.symbol}</td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td}>Price</td>
                <td className={style.td}>{state.price} USD</td>
              </tr>
              <tr className={style.tr}>
                <td className={style.td}>Balance</td>
                <td className={style.td}>{state.balance} USD</td>
              </tr>
            </tbody>
          </table>
        </Modal>
      )}
    </div>

  ) : null;
}

export default Wallet;
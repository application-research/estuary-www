import style from '@components/Wallet.module.scss';
import * as React from 'react';
import * as R from '@common/requests';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import * as C from '@common/constants';
import { network } from '@common/constants';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId
} from "@floating-ui/react";
import Button from '@components/Button';
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import LoaderSpinner from '@components/LoaderSpinner';

function Wallet(props) {
  const [open, setOpen] = React.useState(false);
  const { x, y, refs, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift()
    ],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  const headingId = useId();

  const [state, setState] = React.useState({ account: null, fil: null, price: null, balance: null, loading: true});

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
      const attofil = await web3.eth.getBalance(state.account)
      const fil = Web3.utils.fromWei(attofil)
      const url = `https://data.storage.market/api/market/filecoin?attofil=${attofil}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let j;
      try {
        j = await response.json();
      } catch (e) {
        console.log("Error fetching filecoin price from https://data.storage.market")
      }

      if (j != null) {
        setState({ ...state, fil: parseFloat(fil).toFixed(2), price: j.price, balance: j.amount_usd, loading: false });
      } else {
        setState({ ...state, fil: parseFloat(fil).toFixed(2), loading: false });
      }
    };

    if (state.account != null) {
      run();
    }
  }, [open, setOpen]);

  return state.account ? (
    <div>
      <div className={style.item} ref={refs.setReference} {...getReferenceProps()}>
        <a className={style.item} >
          {state.account.slice(0, 6)}...{state.account.slice(state.account.length - 4, state.account.length)}
        </a>
        <div className={style.toggle}>
          { !open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98A1C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98A1C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            )}
        </div>
      </div>
      {open && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={style.Popover}
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y - 25 ?? 0,
              left: x + 65 ?? 0
            }}
            aria-labelledby={headingId}
          >
            <div className={style.header}>
              <div><Identicon account={state.account}/></div>
              <div><h4>{state.account.slice(0, 6)}...{state.account.slice(state.account.length - 4, state.account.length)}</h4></div>
            </div>
            <div className={style.container}>
              <div className={style.description}>Fil Balance</div>
              <div className={style.fil}>{ state.loading ? ( <LoaderSpinner /> ) : ( <span>{state.fil} {network.nativeCurrency.symbol}</span> )}</div>
              { state.balance && state.price ? (
                <div className={style.balance}>${state.balance} USD @ ${state.price} USD</div>
                ) : (
                <div className={style.balance}>Price discovery not available</div>
                )}
              <div className={style.divider} style={{ width: '100%'}}></div>
              <Button style={{ width: '100%', }}
              onClick={() => window.open(`${network.blockExplorer}/address/${state.account}`, '_blank')}>
              Explore
              </Button>
            </div>
        </div>
        </FloatingFocusManager>
      )}
    </div>
  ) : null;
}

export default Wallet;

const StyledIdenticon = styled.div`
  height: 0.8rem;
  width: 0.8rem;
  border-radius: 1.125rem;
  background-color: black;
  margin-right: 5px;
`;

function Identicon(props) {
  const ref = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (props.account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(props.account.slice(2, 10), 16)));
    }
  }, [props.account]);

  return <StyledIdenticon ref={ref as any} />;
}
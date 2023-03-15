import React from 'react';
import { Box, Container, duration, Stack, Tab, Tabs, Typography, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const HomeHero = () => {
  const Samples = [
    {
      type: 'curl',
      lang: 'curl',
      code: `curl -L -X POST 'https://api.estuary.tech/content/add'
       -H 'Accept: application/json' -H 
       'Authorization: Bearer YOUR_API_KEY' -F 'data=@"/path/to/file"'`,
    },
    {
      type: 'node',
      lang: 'node.js',
      code: `const https = require("https");
        const fs = require("fs");
        const FormData = require("form-data");
        const fetch = require("node-fetch");
        
        const key = "YOUR_API_KEY";
        
        var form = new FormData();
        const path = \`\${__dirname}/YOUR_FILE_ON_YOUR_COMPUTER.mp4\`;
        form.append("data", fs.createReadStream(path));
        
        const headers = form.getHeaders();
        console.log(headers);
        
        fetch("https://upload.estuary.tech/content/add", {
          method: "POST",
          body: form,
          headers: {
            Authorization: \`Bearer \${key}\`,
            ...headers,
          },
        })
          .then(function(res) {
            return res.json();
          })
          .then(function(json) {
            console.log(json);
          });`,
    },
    {
      type: 'javascript',
      lang: 'javascript',
      code: `const formData = new FormData();

      const { data } = THE_SOURCE_OF_YOUR_FILE_FROM_INPUT;
      
      formData.append('data', data, data.filename);
      
      let xhr = new XMLHttpRequest();
      
      let targetURL = "https://upload.estuary.tech/content/add";
      
      xhr.open('POST', targetURL);
      xhr.setRequestHeader('Authorization', \`Bearer \${YOUR_API_KEY}\`);
      xhr.send(formData);`,
    },
    {
      type: 'curl',
      lang: 'solidity',
      code: `curl -L -X POST 'https://api.estuary.tech/content/add' -H 'Accept: application/json' -H 'Authorization: Bearer YOUR_API_KEY' -F 'data=@"/path/to/file"'`,
    },
  ];

  const samples = [
    {
      lang: 'solidity',
      label: 'Solidity',
      icon: '/assets/logos/logo-solidity.svg',
      code: `
      pragma solidity 0.8.10;
  
      import "@openzeppelin/.../token/ERC20/IERC20.sol";
      import "@openzeppelin/.../token/ERC20/extensions/IERC20Metadata.sol";
      import "@openzeppelin/.../utils/Context.sol";
      
      contract InSecureum is Context, IERC20, IERC20Metadata {
          mapping(address => uint256) private _balances;
          mapping(address => mapping(address => uint256)) private _allowances;
          uint256 private _totalSupply;
          string private _name;
          string private _symbol;
      
          constructor(string memory name_, string memory symbol_) {
              _name = name_;
              _symbol = symbol_;
          }
      
          function name() public view virtual override returns (string memory) {
              return _name;
          }
          function symbol() public view virtual override returns (string memory) {
              return _symbol;
          }
      
          function decimals() public view virtual override returns (uint8) {
              return 8;
          }
      
          function totalSupply() public view virtual override returns (uint256) {
              return _totalSupply;
          }
      
          function balanceOf(address account)
              public
              view
              virtual
              override
              returns (uint256)
          {
              return _balances[account];
          }
      
          function transfer(address recipient, uint256 amount)
              public
              virtual
              override
              returns (bool)
          {
              _transfer(_msgSender(), recipient, amount);
              return true;
          }
      
          function allowance(address owner, address spender)
              public
              view
              virtual
              override
              returns (uint256)
          {
              return _allowances[owner][spender];
          }
      
          function approve(address spender, uint256 amount)
              public
              virtual
              override
              returns (bool)
          {
              _approve(_msgSender(), spender, amount);
              return true;
          }
      
          function transferFrom(
              address sender,
              address recipient,
              uint256 amount
          ) public virtual override returns (bool) {
              uint256 currentAllowance = _allowances[_msgSender()][sender];
              if (currentAllowance != type(uint256).max) {
                  unchecked {
                      _approve(sender, _msgSender(), currentAllowance - amount);
                  }
              }
              _transfer(sender, recipient, amount);
              return true;
          }
      
          function increaseAllowance(address spender, uint256 addedValue)
              public
              virtual
              returns (bool)
          {
              _approve(
                  _msgSender(),
                  spender,
                  _allowances[_msgSender()][spender] + addedValue
              );
              return true;
          }
      
          function decreaseAllowance(address spender, uint256 subtractedValue)
              public
              virtual
              returns (bool)
          {
              uint256 currentAllowance = _allowances[_msgSender()][spender];
              require(
                  currentAllowance > subtractedValue,
                  "ERC20: decreased allowance below zero"
              );
              _approve(_msgSender(), spender, currentAllowance - subtractedValue);
              return true;
          }
      
          function _transfer(
              address sender,
              address recipient,
              uint256 amount
          ) internal virtual {
              require(sender != address(0), "ERC20: transfer from the zero address");
              require(recipient != address(0), "ERC20: transfer to the zero address");
              uint256 senderBalance = _balances[sender];
              require(
                  senderBalance >= amount,
                  "ERC20: transfer amount exceeds balance"
              );
              unchecked {
                  _balances[sender] = senderBalance - amount;
              }
              _balances[recipient] += amount;
              emit Transfer(sender, recipient, amount);
          }
      
          function _mint(address account, uint256 amount) external virtual {
              _totalSupply += amount;
              _balances[account] = amount;
              emit Transfer(address(0), account, amount);
          }
      
          function _burn(address account, uint256 amount) internal virtual {
              require(account != address(0), "ERC20: burn from the zero address");
              require(
                  _balances[account] >= amount,
                  "ERC20: burn amount exceeds balance"
              );
              unchecked {
                  _balances[account] = _balances[account] - amount;
              }
              _totalSupply -= amount;
              emit Transfer(address(0), account, amount);
          }
      
          function _approve(
              address owner,
              address spender,
              uint256 amount
          ) internal virtual {
              require(spender != address(0), "ERC20: approve from the zero address");
              require(owner != address(0), "ERC20: approve to the zero address");
              _allowances[owner][spender] += amount;
              emit Approval(owner, spender, amount);
          }
      }
  `,
    },
  ];

  return (
    <>
      <Box
        sx={{
          //   border: "2px solid red",

          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
          mb: 15,
          mt: 15,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',

            backgroundColor: 'transparent',
            mt: 15,
          }}
        >
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={7} sx={{ maxWidth: '70%' }}>
            <h2 className="text-4xl text-white items-center font-bold leading-snug">A reliable way to upload public data onto Filecoin and pin it to IPFS</h2>

            <p className="text-xl text-white items-center opacity-95 leading-8">
              Store your public data and guarantee that it is available to everyone around the world. Our technology will restore lost data and guarantee data replication
            </p>

            <Stack direction="row" justifyContent="between" alignItems="center" spacing={8}>
              {/* <div className="text-md border-2 border-neon text-emerald px-6 py-2   hover:scale-105 transition ease-in duration-150">Get Api Key</div> */}
              <Link href="https://docs.estuary.tech/get-invite-key" underline="none" target="_blank" rel="noopener">
                <Typography
                  variant="body2"
                  sx={{
                    border: '2px solid #40B1D4',
                    color: '#62EEDD',
                    px: 4,
                    py: 1,

                    transition: 'ease-in-out',
                    transitionDuration: '300ms',
                    fontSize: '16px',
                    fontWeight: 'bold',

                    '&:hover': {
                      transition: 'ease-in-out',
                      transitionDuration: '300ms',

                      backgroundColor: '#62EEDD',
                      color: 'black',
                      border: '2px solid #62EEDD',
                    },
                  }}
                >
                  Get Api Key
                </Typography>
              </Link>

              <Link href="https://docs.estuary.tech" underline="none" target="_blank" rel="noopener">
                <Typography
                  variant="body2"
                  sx={{
                    border: '2px solid #40B1D4',
                    color: '#62EEDD',
                    px: 4,
                    py: 1,

                    transition: 'ease-in-out',
                    transitionDuration: '300ms',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    '&:hover': {
                      transition: 'ease-in-out',
                      transitionDuration: '300ms',

                      backgroundColor: '#62EEDD',
                      color: 'black',
                      border: '2px solid #62EEDD',
                    },
                  }}
                >
                  View Docs
                </Typography>
              </Link>

              {/* <div className="text-md border-2 border-neon text-emerald px-6 py-2   hover:scale-105 transition ease-in duration-150">View Docs</div> */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default HomeHero;

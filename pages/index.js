import React from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';
import { keyframes, css, Global } from '@emotion/core';

import STYLES_GLOBAL from '~/common/styles/global';

const ComponentLeftColumn = styled.div`
  font-size: 64px;
  width: 320px;
  height: calc(100vh - 48px);
  background: red;

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: white;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: white;
  }
`;

const ComponentRightColumn = styled.div`
  min-width: 20%;
  width: 100%;
  background: blue;
  height: calc(100vh - 48px);

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: white;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: white;
  }
`;

const ComponentNavigation = styled.div`
  height: 48px;
  background: green;
`;

const ComponentPage = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export default class IndexPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Global styles={STYLES_GLOBAL} />
        <Head>
          <title>next-express-emotion</title>
        </Head>
        <ComponentNavigation>A</ComponentNavigation>
        <ComponentPage>
          <ComponentLeftColumn>B</ComponentLeftColumn>
          <ComponentRightColumn>C</ComponentRightColumn>
        </ComponentPage>
      </React.Fragment>
    );
  }
}

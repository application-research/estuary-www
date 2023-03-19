import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from '@mui/material/Link';

import { Box, Collapse, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from '@mui/material';

const faqs = [
  {
    question: 'Will Estuary ever charge money?',
    answer: (
      <p>
        Estuary.tech is free while the service is in development. We will let the public know a year in advance before we charge money for anything you depend on. For now, there is
        no limit to uploads, but for each file there is a 32 GiB max size. Check out{' '}
        <Link
          href="https://storage.market"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          storage.market
        </Link>{' '}
        to see how our price compares to other Web2 and Web3 products.
      </p>
    ),
  },
  {
    question: 'Is there an upload limit?',
    answer: 'For now, there is no limit to uploads, but for each file there is a 32 GiB max size.',
  },
  {
    question: 'Does Estuary use Filecoin?',
    answer: 'Yes, we store your data on Filecoin across 6 storage providers per file.',
  },
  {
    question: 'Will I be able to pay you for namespaced or dedicated infrastructure?',
    answer: (
      <p>
        Yes, check out our{' '}
        <Link
          href="https://fw.services/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          roadmap
        </Link>{' '}
      </p>
    ),
  },
  {
    question: 'Why are you in alpha?',
    answer: (
      <p>
        Waiting for the{' '}
        <Link
          href="https://fvm.filecoin.io/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          FVM
        </Link>{' '}
        launch and Filecoin retrievals to work in the Filecoin Ecosystem. Because we aim to be a complete kitchen sink example of how to build a data onboarding service and
        platform on top of Filecoin, we're going to wait until we are feature complete to fully launch. This includes smaller features like Metamask authentication, and bigger
        features like provisioning our infrastructure for users who need dedicated resources. Check out our{' '}
        <Link
          href="https://fw.services/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          roadmap
        </Link>{' '}
      </p>
    ),
  },

  {
    question: 'Wait are you a pinning service or not?',
    answer: (
      <p>
        Estuary.tech provides storage through{' '}
        <Link
          href="https://proto.school/content-addressing"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          immutable content address pinning
        </Link>{' '}
        . This is just like any{' '}
        <Link
          href="https://github.com/ipfs/kubo"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          IPFS Node
        </Link>{' '}
        , or popular services like{' '}
        <Link
          href="https://www.pinata.cloud/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          pinata
        </Link>{' '}
        and{' '}
        <Link
          href="https://web3.storage/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          web3.storage
        </Link>{' '}
        .
      </p>
    ),
  },

  {
    question: 'Wait I need to prove that I used Filecoin for a grant I have, how do I do this with Estuary?',
    answer: (
      <p>
        All deals have receipts before and after getting on chain. Every piece of data gets uploaded to Filecoin six times. See the example of a{' '}
        <Link
          href="https://estuary.tech/verify-cid?cid=QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          storage data receipt
        </Link>{' '}
        . Each Receipt has instructions of how to retrieve.
      </p>
    ),
  },

  {
    question: 'How is your uptime?',
    answer: (
      <p>
        It needs improvement, check out{' '}
        <Link
          href="https://status.estuary.tech/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          BetterUptime
        </Link>{' '}
        for more stats. We are doing better than 94% for most of our services.
      </p>
    ),
  },

  {
    question: 'Is Estuary open source?',
    answer: (
      <p>
        Every single line, check out{' '}
        <Link
          href="https://github.com/application-research"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          GitHub
        </Link>{' '}
        We also encourage you to run your own Estuary node and rename it to provide your own service.
      </p>
    ),
  },

  {
    question: 'Wait, I can run my own Estuary.tech?',
    answer: (
      <p>
        Yes you just need to fork{' '}
        <Link
          href="https://github.com/application-research/estuary"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          Estuary
        </Link>{' '}
        and{' '}
        <Link
          href="https://github.com/application-research/estuary-www"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          Estuary-WWW
        </Link>{' '}
        and rename everything and you're good to go! You can do everything we can do.
      </p>
    ),
  },

  {
    question: 'Can I talk to you or provide feedback?',
    answer: (
      <p>
        We are available 24/7 in the{' '}
        <Link
          href="https://filecoin.io/slack"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          Filecoin Slack
        </Link>{' '}
        . Join the #ecosystem-dev channel. Or give us feedback through this{' '}
        <Link
          href="https://docs.estuary.tech/give-feedback/"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          form
        </Link>{' '}
        here.
      </p>
    ),
  },

  {
    question: 'What else should I know?',
    answer: (
      <p>
        You can follow us on{' '}
        <Link
          href="https://twitter.com/estuary_tech"
          underline="none"
          target="_blank"
          sx={{ color: '#40B1D4', transition: 'ease-in-out', transitionDuration: '200ms', '&:hover': { color: 'white' } }}
        >
          Twitter
        </Link>{' '}
      </p>
    ),
  },
];

const Faq = (props) => {
  const { answer, question } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack onClick={() => setExpanded((prevState) => !prevState)} spacing={2} sx={{ cursor: 'pointer', width: '50rem' }}>
      <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2} sx={{}}>
        <Typography variant="h2" sx={{ color: 'white', fontSize: '20px' }}>
          {question}
        </Typography>
        <SvgIcon>{expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</SvgIcon>
      </Stack>
      <Collapse in={expanded}>
        <Typography variant="h2" sx={{ color: '#62EEDD', fontSize: '20px', lineHeight: '2.25rem' }}>
          {answer}
        </Typography>
      </Collapse>
    </Stack>
  );
};

export const HomeFaqs = () => {
  return (
    <Box sx={{ py: '120px' }}>
      <Container maxWidth="lg" sx={{}}>
        <Grid container spacing={10} direction="column" sx={{ ml: 10 }}>
          <Grid xs={12} md={6} sx={{ width: '100%' }}>
            <Stack spacing={2} sx={{ width: '50rem' }}>
              <Typography variant="h3" sx={{ font: '1.05rem' }}>
                FAQ (Frequently asked questions)
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack spacing={6}>
              {faqs.map((faq, index) => (
                <Faq key={index} {...faq} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

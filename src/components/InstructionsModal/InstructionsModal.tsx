import React, { useState } from 'react';
import { Button, Modal, Text, Link, Grid } from '@geist-ui/react';

const YOROI_NIGHTLY_URL =
  'https://chrome.google.com/webstore/detail/yoroi-nightly/poonlenmfdfbjfeeballhiibknlknepo';
const YOROI_DAPP_CONNECTOR_URL =
  'https://chrome.google.com/webstore/detail/yoroi-ergo-dapp-connector/chifollcalpmjdiokipacefnpmbgjnle';
const YOROI_URL =
  'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb';

const Instructions = () => {
  return (
    <>
      <Text p type="warning">
        ⚠️ Use Google Chrome, Brave or Sidekick browser to interact with ErgoDEX
        Beta UI
      </Text>
      <Text p type="error">
        ⛔️ Do not use Safari or Mozilla Firefox, because there are no wallet
        extensions yet
      </Text>
      <Text p>
        1. To start interact with ErgoDEX Beta UI you need to install the
        following two extensions:
      </Text>
      <Text p>
        <Link href={YOROI_NIGHTLY_URL} color icon>
          Yoroi Nightly
        </Link>
        <Text span> - Yoroi wallet’s test environment</Text>
      </Text>
      <Text p>
        <Link href={YOROI_DAPP_CONNECTOR_URL} color icon>
          Yoroi-Ergo dApp Connector Nightly
        </Link>
        <Text span> - to enable ErgoDEX UI connect to a wallet</Text>
      </Text>
      <Text p>2. Create new ERG wallet using Yoroi Nightly;</Text>
      <Text p>
        3. Send a small amount of ERG (1-2 ERG) to your Yoroi Nightly Wallet to
        pay protocol fees. For this step use{' '}
        <Link href={YOROI_URL} color icon>
          Yoroi Wallet
        </Link>{' '}
        or withdrawal ERG from your exchange account;
      </Text>
      <Text p>
        4. Congratulations! You are now completely ready to start testing the
        beta interface.
      </Text>
    </>
  );
};

interface InstructionsModalProps {
  className?: string;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={className}
        type="warning"
        ghost
        onClick={() => setIsOpen(true)}
      >
        How to use?
      </Button>
      <Modal width="45rem" open={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Title>How to use guide</Modal.Title>
        <Modal.Content>
          <Instructions />
          <Button type="success" onClick={() => setIsOpen(false)}>
            Use now!
          </Button>
        </Modal.Content>
      </Modal>
    </>
  );
};

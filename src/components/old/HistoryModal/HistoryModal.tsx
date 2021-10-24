// import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
// import { faRedo } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
//
// import { useWalletAddresses, WalletAddressState } from '../../context';
// import { useInterval } from '../../hooks/useInterval';
// import networkHistory from '../../services/networkHistory';
// // import { Content } from './Content';
//
// const content = {
//   title: 'Transactions history',
//   close: 'OK',
// };
//
// type HistoryModalProps = {
//   open?: boolean;
//   onClose?: () => void;
//   onConnectWallet?: () => void;
//   isWalletConnected?: boolean;
// };
//
// // eslint-disable-next-line react/display-name
// export const HistoryModal = (props: HistoryModalProps): JSX.Element => {
//   const { open = false, onClose } = props;
//   const [operations, setOperations] = useState<AmmDexOperation[] | null>(null);
//
//   const walletAddresses = useWalletAddresses();
//
//   const updateOperations = useCallback(() => {
//     if (walletAddresses.state === WalletAddressState.LOADED) {
//       networkHistory
//         .getAllByAddresses(walletAddresses.addresses, 20)
//         .then(setOperations);
//     }
//   }, [walletAddresses]);
//
//   useEffect(() => {
//     if (
//       !(
//         walletAddresses.state === WalletAddressState.LOADED &&
//         operations === null
//       )
//     )
//       return;
//
//     updateOperations();
//   }, [walletAddresses, operations, updateOperations]);
//
//   useInterval(() => {
//     if (
//       !(
//         walletAddresses.state === WalletAddressState.LOADED &&
//         operations === null
//       )
//     )
//       return;
//     updateOperations();
//   }, 10 * 1000);
//
//   return (
//     <Modal open={open} onClose={onClose} width="1000px">
//       <Modal.Title>
//         {content.title}
//         <Button
//           style={{ marginLeft: '10px' }}
//           icon={<FontAwesomeIcon icon={faRedo} />}
//           auto
//           size="small"
//           onClick={() => updateOperations()}
//         />
//       </Modal.Title>
//       <Modal.Content>
//         <Content operations={operations} />
//       </Modal.Content>
//       <Modal.Action onClick={onClose}>{content.close}</Modal.Action>
//     </Modal>
//   );
// };

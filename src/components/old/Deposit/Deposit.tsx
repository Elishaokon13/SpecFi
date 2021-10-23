// import { AmmPool, minValueForOrder } from '@ergolabs/ergo-dex-sdk';
// import {
//   AssetAmount,
//   BoxSelection,
//   DefaultBoxSelector,
//   ergoTxToProxy,
//   publicKeyFromAddress,
// } from '@ergolabs/ergo-sdk';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import { Field, FieldRenderProps, Form } from 'react-final-form';

// import { ERG_DECIMALS, UI_FEE } from '../../constants/erg';
// import { DexFeeDefault } from '../../constants/settings';
// import { useSettings, WalletContext } from '../../context';
// import { useCheckPool } from '../../hooks/useCheckPool';
// import { useGetAllPools } from '../../hooks/useGetAllPools';
// import explorer from '../../services/explorer';
// import { poolActions } from '../../services/poolActions';
// import { makeTarget } from '../../utils/ammMath';
// import { parseUserInputToFractions, renderFractions } from '../../utils/math';
// import { renderPoolPrice } from '../../utils/price';
// import { toFloat } from '../../utils/string';
// import { calculateTotalFee } from '../../utils/transactions';
// import { calculateAvailableAmount } from '../../utils/walletMath';
// import { PoolSelect } from '../PoolSelect/PoolSelect';
// import { getButtonState } from './buttonState';
// import { DepositSummary } from './DepositSummary';
//
// export const Deposit = (): JSX.Element => {
//   const [{ minerFee, address: chosenAddress }] = useSettings();
//   const { isWalletConnected, utxos, ergBalance } = useContext(WalletContext);
//   const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
//   const [exFee] = useState<number>(DexFeeDefault);
//   const [inputAssetAmountX, setInputAssetAmountX] = useState<
//     AssetAmount | undefined
//   >();
//   const [inputAssetAmountY, setInputAssetAmountY] = useState<
//     AssetAmount | undefined
//   >();
//   const [availableInputAmountX, setAvailableInputAmountX] = useState(0n);
//   const [availableInputAmountY, setAvailableInputAmountY] = useState(0n);
//   const [inputAmountX, setInputAmountX] = useState('');
//   const [inputAmountY, setInputAmountY] = useState('');
//   const isPoolValid = useCheckPool(selectedPool);
//   const [isSynchronous, setIsSynchronous] = useState(true);
//
//   const availablePools = useGetAllPools();
//
//   const totalFee = calculateTotalFee(
//     [minerFee, String(exFee), renderFractions(UI_FEE, ERG_DECIMALS)],
//     ERG_DECIMALS,
//   );
//
//   useEffect(() => {
//     if (isWalletConnected && inputAssetAmountX && inputAssetAmountY) {
//       if (utxos) {
//         setAvailableInputAmountX(
//           calculateAvailableAmount(inputAssetAmountX.asset.id, utxos),
//         );
//         setAvailableInputAmountY(
//           calculateAvailableAmount(inputAssetAmountY.asset.id, utxos),
//         );
//       }
//     }
//   }, [isWalletConnected, inputAssetAmountX, inputAssetAmountY, utxos]);
//
//   const lpTokens = useMemo(() => {
//     if (
//       selectedPool &&
//       inputAmountX &&
//       inputAssetAmountX &&
//       inputAmountY &&
//       inputAssetAmountY
//     ) {
//       return selectedPool.rewardLP(
//         new AssetAmount(
//           inputAssetAmountX.asset,
//           parseUserInputToFractions(
//             inputAmountX,
//             inputAssetAmountX.asset.decimals,
//           ),
//         ),
//         new AssetAmount(
//           inputAssetAmountY.asset,
//           parseUserInputToFractions(
//             inputAmountY,
//             inputAssetAmountY.asset.decimals,
//           ),
//         ),
//       ).amount;
//     }
//
//     return '';
//   }, [
//     selectedPool,
//     inputAmountX,
//     inputAssetAmountX,
//     inputAmountY,
//     inputAssetAmountY,
//   ]);
//
//   const updateSelectedPool = useCallback((pool: AmmPool) => {
//     setSelectedPool(pool);
//     setInputAmountX('');
//     setInputAmountY('');
//     setInputAssetAmountX(pool.x);
//     setInputAssetAmountY(pool.y);
//   }, []);
//
//   useEffect(() => {
//     if (
//       selectedPool &&
//       (selectedPool.x.asset.id !== inputAssetAmountX?.asset.id ||
//         selectedPool.y.asset.id !== inputAssetAmountY?.asset.id)
//     ) {
//       setInputAssetAmountX(selectedPool.x);
//       setInputAssetAmountY(selectedPool.y);
//     }
//     if (!selectedPool && availablePools) {
//       updateSelectedPool(availablePools[0]);
//     }
//   }, [
//     availablePools,
//     updateSelectedPool,
//     selectedPool,
//     inputAssetAmountX?.asset.id,
//     inputAssetAmountY?.asset.id,
//   ]);
//
//   const buttonState = useMemo(() => {
//     return getButtonState({
//       isWalletConnected,
//       selectedPool,
//       inputAmountX,
//       inputAmountY,
//       availableInputAmountX,
//       availableInputAmountY,
//       ergBalance,
//       minerFee,
//       dexFee: exFee,
//     });
//   }, [
//     isWalletConnected,
//     selectedPool,
//     inputAmountX,
//     inputAmountY,
//     availableInputAmountX,
//     availableInputAmountY,
//     ergBalance,
//     minerFee,
//     exFee,
//   ]);
//
//   const handleTokenAmountChange = (
//     value: string,
//     token: 'input' | 'output',
//   ) => {
//     if (!selectedPool || !inputAssetAmountX || !inputAssetAmountY) {
//       return;
//     }
//     const cleanValue = toFloat(value);
//
//     if (token === 'input') {
//       setInputAmountX(cleanValue);
//
//       if (Number(cleanValue) > 0 && isSynchronous) {
//         const amount = selectedPool.depositAmount(
//           new AssetAmount(
//             inputAssetAmountX.asset,
//             parseUserInputToFractions(value, inputAssetAmountX.asset.decimals),
//           ),
//         );
//
//         setInputAmountY(
//           renderFractions(amount?.amount, inputAssetAmountY.asset.decimals),
//         );
//       }
//     }
//
//     if (!cleanValue.trim()) {
//       setInputAmountY('');
//     }
//
//     if (token === 'output') {
//       setInputAmountY(cleanValue);
//
//       if (Number(cleanValue) > 0 && isSynchronous) {
//         const amount = selectedPool.depositAmount(
//           new AssetAmount(
//             inputAssetAmountY.asset,
//             parseUserInputToFractions(value, inputAssetAmountY.asset.decimals),
//           ),
//         );
//
//         setInputAmountX(
//           renderFractions(amount?.amount, inputAssetAmountX.asset.decimals),
//         );
//       }
//
//       if (!cleanValue.trim()) {
//         setInputAmountX('');
//       }
//     }
//   };
//
//   const onSubmit = async () => {
//     if (
//       isWalletConnected &&
//       selectedPool &&
//       inputAssetAmountX &&
//       inputAssetAmountY &&
//       chosenAddress &&
//       utxos
//     ) {
//       const network = explorer;
//       const poolId = selectedPool.id;
//
//       const pk = publicKeyFromAddress(chosenAddress) as string;
//
//       const actions = poolActions(selectedPool);
//
//       const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);
//       const exFeeNErgs = parseUserInputToFractions(String(exFee), ERG_DECIMALS);
//
//       const minNErgs = minValueForOrder(minerFeeNErgs, UI_FEE, exFeeNErgs);
//       const inputX = inputAssetAmountX.withAmount(
//         parseUserInputToFractions(
//           inputAmountX,
//           inputAssetAmountX.asset.decimals,
//         ),
//       );
//       const inputY = inputAssetAmountY.withAmount(
//         parseUserInputToFractions(
//           inputAmountY,
//           inputAssetAmountY.asset.decimals,
//         ),
//       );
//       const target = makeTarget([inputX, inputY], minNErgs);
//
//       actions
//         .deposit(
//           {
//             pk,
//             poolId,
//             exFee: exFeeNErgs,
//             uiFee: UI_FEE,
//             x: inputX,
//             y: inputY,
//           },
//           {
//             inputs: DefaultBoxSelector.select(utxos, target) as BoxSelection,
//             changeAddress: chosenAddress,
//             selfAddress: chosenAddress,
//             feeNErgs: minerFeeNErgs,
//             network: await network.getNetworkContext(),
//           },
//         )
//         .then(async (tx) => {
//           await ergo.submit_tx(ergoTxToProxy(tx));
//           toast.success(`Transaction submitted: ${tx.id} `);
//         })
//         .catch((er) => toast.error(JSON.stringify(er)));
//     }
//   };
//
//   if (!isWalletConnected) {
//     return (
//       <Card>
//         <Text h6>Wallet not connected</Text>
//       </Card>
//     );
//   }
//
//   if (!availablePools) {
//     return (
//       <Card>
//         <Loading>Fetching available pools..</Loading>
//       </Card>
//     );
//   }
//
//   if (availablePools?.length === 0) {
//     return (
//       <Card>
//         <Loading>No pools available to redeem from</Loading>
//       </Card>
//     );
//   }
//
//   return (
//     <>
//       <Card>
//         <Form
//           onSubmit={onSubmit}
//           initialValues={{
//             amount: '0',
//             address: '',
//             dexFee: exFee,
//           }}
//           render={({ handleSubmit, errors = {} }) => {
//             const isFormDisabled =
//               buttonState.isDisabled || Object.values(errors).length > 0;
//             return (
//               <form onSubmit={handleSubmit}>
//                 <Grid.Container gap={1}>
//                   <Grid xs={24}>
//                     <Text h5>Pool</Text>
//                   </Grid>
//                   <Grid xs={24}>
//                     <Field name="pool" component="select">
//                       {(props: FieldRenderProps<string>) => (
//                         <PoolSelect
//                           pools={availablePools}
//                           value={selectedPool}
//                           onChangeValue={setSelectedPool}
//                           inputProps={props.input}
//                         />
//                       )}
//                     </Field>
//                   </Grid>
//                   {isPoolValid.isFetching && (
//                     <Grid xs={24}>
//                       <Spacer y={2} />
//                       <Loading>Validating selected pool...</Loading>
//                     </Grid>
//                   )}
//                   {!isPoolValid.isFetching && isPoolValid.result === false && (
//                     <Grid xs={24}>
//                       <Note type="error" label="error" filled>
//                         This pool is invalid. Please select another one.
//                       </Note>
//                     </Grid>
//                   )}
//
//                   {!isPoolValid.isFetching && isPoolValid.result && (
//                     <>
//                       <Grid xs={24}>
//                         <Text small={true} type={'secondary'}>
//                           {'Current price: ' + renderPoolPrice(selectedPool!)}
//                         </Text>
//                       </Grid>
//                       <Grid xs={24}>
//                         <Text h5>Deposit amounts</Text>
//                       </Grid>
//                       <Grid xs={24}>
//                         <Checkbox
//                           checked={isSynchronous}
//                           onClick={() => {
//                             setIsSynchronous((prev) => !prev);
//                           }}
//                         >
//                           Stick to current ratio
//                         </Checkbox>
//                       </Grid>
//                       <Grid xs={24}>
//                         <Field name="inputAmountX">
//                           {(props: FieldRenderProps<string>) => (
//                             <>
//                               <Input
//                                 placeholder="0.0"
//                                 width="100%"
//                                 lang="en"
//                                 label={inputAssetAmountX?.asset.name ?? ''}
//                                 {...props.input}
//                                 disabled={!inputAssetAmountX}
//                                 value={inputAmountX}
//                                 onChange={({ currentTarget }) => {
//                                   const value = currentTarget.value;
//
//                                   if (
//                                     inputAssetAmountX?.asset.decimals === 0 &&
//                                     /[,.]/.test(value)
//                                   ) {
//                                     return;
//                                   }
//
//                                   handleTokenAmountChange(value, 'input');
//                                   props.input.onChange(value);
//                                 }}
//                               />
//                             </>
//                           )}
//                         </Field>
//                       </Grid>
//                       <Grid xs={24}>
//                         <Field name="inputAmountY">
//                           {(props: FieldRenderProps<string>) => (
//                             <Input
//                               placeholder="0.0"
//                               label={inputAssetAmountY?.asset.name ?? ''}
//                               width="100%"
//                               {...props.input}
//                               value={inputAmountY}
//                               onChange={({ currentTarget }) => {
//                                 const value = currentTarget.value;
//
//                                 if (
//                                   inputAssetAmountY?.asset.decimals === 0 &&
//                                   /[,.]/.test(value)
//                                 ) {
//                                   return;
//                                 }
//
//                                 handleTokenAmountChange(value, 'output');
//                                 props.input.onChange(value);
//                               }}
//                             />
//                           )}
//                         </Field>
//                       </Grid>
//                       {!isFormDisabled && (
//                         <Grid
//                           xs={24}
//                           alignItems="flex-start"
//                           direction="column"
//                         >
//                           <Text h5>Deposit summary</Text>
//                           <DepositSummary
//                             lpTokensAmount={String(lpTokens)}
//                             minerFee={minerFee}
//                             dexFee={String(exFee)}
//                             totalFee={totalFee}
//                           />
//                         </Grid>
//                       )}
//                       <Grid xs={24} justify="center">
//                         <Button htmlType="submit" disabled={isFormDisabled}>
//                           {buttonState.text}
//                         </Button>
//                       </Grid>
//                     </>
//                   )}
//                 </Grid.Container>
//               </form>
//             );
//           }}
//         />
//       </Card>
//     </>
//   );
// };

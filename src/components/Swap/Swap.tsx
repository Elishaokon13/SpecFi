import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  Button,
  Card,
  Grid,
  Input,
  Loading,
  Row,
  Spacer,
  Tag,
  Text,
  Note,
  Table,
} from '@geist-ui/react';
import { Form, Field, FieldRenderProps } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { AmmPool, swapVars, T2tPoolOps } from 'ergo-dex-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  DefaultTxAssembler,
} from 'ergo-dex-sdk/build/module/ergo';
import { fromAddress } from 'ergo-dex-sdk/build/module/ergo/entities/publicKey';
import { YoroiProver } from '../../utils/yoroiProver';
import { DefaultSettings, WalletContext } from '../../context';
import { useGetAllPools } from '../../hooks/useGetAllPools';
import { PoolSelect } from '../PoolSelect/PoolSelect';
import {
  DEFAULT_MINER_FEE,
  ERG_TOKEN_NAME,
  ERG_DECIMALS,
  MIN_NITRO,
  MIN_BOX_VALUE,
} from '../../constants/erg';
import { getButtonState } from './buttonState';
import { validateInputAmount } from './validation';
import { useSettings } from '../../context';
import { toast } from 'react-toastify';
import { explorer } from '../../utils/explorer';
import { useCheckPool } from '../../hooks/useCheckPool';
import { ergoTxToProxy } from 'ergo-dex-sdk/build/module/ergo';
import {
  calculateAvailableAmount,
  getBaseInputParameters,
  inputToRender,
  inputToFractions,
} from '../../utils/walletMath';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import SwapSettings from './SwapSettings';
import { SwapExtremums } from 'ergo-dex-sdk/build/module/amm/math/swap';

interface SwapFormProps {
  pools: AmmPool[];
}

const SwapForm: React.FC<SwapFormProps> = ({ pools }) => {
  const { isWalletConnected, utxos } = useContext(WalletContext);
  const [{ minerFee, address: chosenAddress }] = useSettings();
  const [selectedPool, setSelectedPool] = useState<AmmPool | undefined>();
  const [inputAssetAmount, setInputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [outputAssetAmount, setOutputAssetAmount] = useState<
    AssetAmount | undefined
  >();
  const [pivotalAmount, setPivotalAmount] = useState('');
  const [slippage, setSlippage] = useState(DefaultSettings.slippage);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [availableInputAmount, setAvailableInputAmount] = useState(0n);
  const [minDexFee, setMinDexFee] = useState(String(DEFAULT_MINER_FEE));
  const [nitro, setNitro] = useState(String(MIN_NITRO));
  const [currentSwapVars, setCurrentSwapVars] = useState<
    [number, SwapExtremums] | undefined
  >();
  const isPoolValid = useCheckPool(selectedPool);

  const updateSelectedPool = useCallback((pool: AmmPool) => {
    setSelectedPool(pool);
    setInputAssetAmount(pool.x);
    setOutputAssetAmount(pool.y);
  }, []);

  useEffect(() => {
    if (selectedPool === undefined) {
      updateSelectedPool(pools[0]);
    }
  }, [pools, selectedPool, updateSelectedPool]);

  const buttonStatus = useMemo(
    () =>
      getButtonState({
        isWalletConnected,
        inputAssetId: inputAssetAmount?.asset.id,
        outputAssetId: outputAssetAmount?.asset.id,
        inputAmount,
        outputAmount,
        chosenAddress,
        utxos,
        availableInputAmount,
      }),
    [
      isWalletConnected,
      inputAmount,
      outputAmount,
      inputAssetAmount,
      outputAssetAmount,
      chosenAddress,
      utxos,
      availableInputAmount,
    ],
  );

  useEffect(() => {
    if (selectedPool && inputAssetAmount && inputAmount) {
      const { minOutput } = getBaseInputParameters(selectedPool, {
        inputAmount,
        inputAssetAmount,
        slippage,
      });
      const vars = swapVars(BigInt(minDexFee), Number(nitro), minOutput);
      if (vars !== undefined) {
        setCurrentSwapVars(vars);
      }
    }
  }, [slippage, minDexFee, inputAmount, inputAssetAmount, selectedPool, nitro]);

  useEffect(() => {
    if (isWalletConnected && inputAssetAmount) {
      if (utxos) {
        setAvailableInputAmount(
          calculateAvailableAmount(inputAssetAmount.asset.id, utxos),
        );
      }
    }
  }, [isWalletConnected, inputAssetAmount, utxos]);

  const updateInputAmount = useCallback(
    (
      outputAmount: string,
      outputAssetAmount: AssetAmount | undefined,
      inputAssetAmount: AssetAmount | undefined,
    ) => {
      if (
        selectedPool &&
        inputAssetAmount &&
        outputAssetAmount &&
        Number(outputAmount) > 0
      ) {
        const amount = selectedPool.inputAmount(
          new AssetAmount(
            outputAssetAmount.asset,
            inputToFractions(outputAmount, outputAssetAmount.asset.decimals),
          ),
          slippage,
        );
        setInputAmount(
          inputToRender(amount?.amount ?? 0n, inputAssetAmount.asset.decimals),
        );
      }
    },
    [selectedPool, slippage],
  );

  const updateOutputAmount = useCallback(
    (
      inputAmount: string,
      outputAssetAmount: AssetAmount | undefined,
      inputAssetAmount: AssetAmount | undefined,
    ) => {
      if (
        selectedPool &&
        inputAssetAmount &&
        outputAssetAmount &&
        Number(inputAmount) > 0
      ) {
        const amount = selectedPool.outputAmount(
          new AssetAmount(
            inputAssetAmount.asset,
            inputToFractions(inputAmount, inputAssetAmount.asset.decimals),
          ),
          slippage,
        );
        setOutputAmount(
          inputToRender(amount?.amount ?? 0n, outputAssetAmount.asset.decimals),
        );
      }
    },
    [selectedPool, slippage],
  );

  const handleSwitchAssets = useCallback(() => {
    setInputAssetAmount(outputAssetAmount);
    setOutputAssetAmount(inputAssetAmount);
    if (inputAmount === pivotalAmount) {
      setOutputAmount(pivotalAmount);
      updateInputAmount(pivotalAmount, inputAssetAmount, outputAssetAmount);
    } else {
      setInputAmount(pivotalAmount);
      updateOutputAmount(pivotalAmount, inputAssetAmount, outputAssetAmount);
    }
  }, [
    inputAmount,
    pivotalAmount,
    updateInputAmount,
    inputAssetAmount,
    outputAssetAmount,
    setInputAssetAmount,
    setOutputAssetAmount,
    setInputAmount,
    updateOutputAmount,
  ]);

  const handleEnterInputTokenAmount = (value: string) => {
    if (inputAssetAmount && selectedPool) {
      setInputAmount(value);
      setPivotalAmount(value);
      setInputAssetAmount(
        new AssetAmount(
          inputAssetAmount.asset,
          inputToFractions(value, inputAssetAmount.asset.decimals),
        ),
      );
      updateOutputAmount(value, outputAssetAmount, inputAssetAmount);

      if (!value.trim()) {
        setOutputAmount('0');
      }
    }
  };

  const handleFormSubmit = async () => {
    if (
      isWalletConnected &&
      selectedPool &&
      inputAssetAmount &&
      outputAssetAmount &&
      utxos?.length &&
      chosenAddress
    ) {
      const network = explorer;
      const poolId = selectedPool.id;

      const { baseInput, baseInputAmount, minOutput } = getBaseInputParameters(
        selectedPool,
        { inputAmount, inputAssetAmount, slippage },
      );

      const poolOps = new T2tPoolOps(
        new YoroiProver(),
        new DefaultTxAssembler(true),
      );
      const pk = fromAddress(chosenAddress) as string;

      const vars = swapVars(BigInt(minDexFee), Number(nitro), minOutput);

      if (vars !== undefined) {
        const [dexFeePerToken, extremums] = vars;

        const poolFeeNum = selectedPool.poolFeeNum;
        const minerFeeNErgs = inputToFractions(minerFee, ERG_DECIMALS);
        const totalFees =
          BigInt(MIN_BOX_VALUE) + minerFeeNErgs + BigInt(extremums.maxDexFee);

        const networkContext = await network.getNetworkContext();

        const params = {
          pk,
          poolId,
          baseInput,
          minQuoteOutput: minOutput.amount,
          dexFeePerToken,
          quoteAsset: outputAssetAmount.asset.id,
          poolFeeNum,
        };

        const inputs = DefaultBoxSelector.select(utxos, {
          nErgs: totalFees,
          assets: [
            {
              tokenId: inputAssetAmount.asset.id,
              amount: baseInputAmount,
            },
          ],
        });

        if (inputs instanceof BoxSelection) {
          const txContext = {
            inputs,
            changeAddress: chosenAddress,
            selfAddress: chosenAddress,
            feeNErgs: minerFeeNErgs,
            network: networkContext,
          };

          poolOps
            .swap(params, txContext)
            .then(async (tx) => {
              const proxyTx = ergoTxToProxy(tx);
              await ergo.submit_tx(proxyTx);
              toast.success(`Transaction submitted: ${tx} `);
            })
            .catch((er) => toast.error(JSON.stringify(er)));
        } else {
          throw inputs.message;
        }
      }
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={{
        slippage,
        inputAmount: 0.0,
        outputAmount: 0.0,
        address: '',
        poolId: undefined,
        minDexFee: 0,
        nitro: 0,
      }}
      render={({ handleSubmit, errors = {} }) => (
        <form onSubmit={handleSubmit}>
          <Grid.Container gap={1}>
            <Grid xs={12}>
              <Text h4>Pool</Text>
            </Grid>
            <Grid xs={12} justify={'flex-end'}>
              <SwapSettings
                slippage={slippage}
                minDexFee={minDexFee}
                nitro={nitro}
                onChangeSlippage={setSlippage}
                onChangeMinDexFee={setMinDexFee}
                onChangeNitro={setNitro}
              />
            </Grid>
            <Grid xs={24}>
              <Field name="poolId" component="select">
                {(props: FieldRenderProps<string>) => (
                  <PoolSelect
                    pools={pools}
                    value={selectedPool}
                    onChangeValue={(value) => {
                      updateSelectedPool(value);
                    }}
                    inputProps={props.input}
                  />
                )}
              </Field>
            </Grid>
            {isPoolValid.isFetching && (
              <Grid xs={24}>
                <Spacer y={2} />
                <Loading>Validating selected pool...</Loading>
              </Grid>
            )}
            {!isPoolValid.isFetching && !isPoolValid.result && (
              <Grid xs={24}>
                <Note type="error" label="error" filled>
                  This pool is invalid. Please select another one.
                </Note>
              </Grid>
            )}
            {!isPoolValid.isFetching && isPoolValid.result && (
              <>
                <Grid xs={24}>
                  <Text h4>From</Text>
                </Grid>
                <Grid xs={24} direction="column">
                  <Field
                    name="inputAmount"
                    validate={(value) =>
                      validateInputAmount(value, {
                        maxDecimals: inputAssetAmount?.asset.decimals || 0,
                        maxAvailable: availableInputAmount,
                      })
                    }
                  >
                    {(props: FieldRenderProps<string>) => (
                      <>
                        <Row>
                          <Input
                            placeholder="0.0"
                            width="100%"
                            lang="en"
                            label={inputAssetAmount?.asset.name ?? ''}
                            {...props.input}
                            disabled={!inputAssetAmount}
                            value={inputAmount}
                            onChange={({ currentTarget }) => {
                              const value = currentTarget.value;
                              handleEnterInputTokenAmount(value);
                              props.input.onChange(value);
                            }}
                          />
                        </Row>
                        {props.meta.error && (
                          <Row>
                            <Text p small type="error">
                              {props.meta.error}
                            </Text>
                          </Row>
                        )}
                      </>
                    )}
                  </Field>
                </Grid>
                <Grid xs={24} justify="center">
                  <Tag
                    onClick={handleSwitchAssets}
                    type="success"
                    style={{ cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                  </Tag>
                </Grid>
                <Grid xs={24}>
                  <Text h4>To</Text>
                </Grid>
                <Grid xs={24}>
                  <Field name="outputAmount">
                    {(props: FieldRenderProps<string>) => (
                      <Input
                        placeholder="0.0"
                        label={outputAssetAmount?.asset.name ?? ''}
                        width="100%"
                        {...props.input}
                        value={outputAmount}
                        onChange={(e) => {
                          props.input.onChange(e.currentTarget.value);
                        }}
                        disabled
                      />
                    )}
                  </Field>
                </Grid>

                {currentSwapVars && currentSwapVars[1] && (
                  <>
                    <Grid xs={24}>
                      <Text h4>Transaction Details</Text>
                    </Grid>
                    <Grid xs={24}>
                      <Table
                        data={[
                          {
                            prop: 'Miners Fee',
                            value: `${minerFee} ${ERG_TOKEN_NAME}`,
                          },
                          {
                            prop: 'Min DEX Fee',
                            value: `${inputToRender(
                              BigInt(currentSwapVars[1].minDexFee),
                              ERG_DECIMALS,
                            )} ${ERG_TOKEN_NAME}`,
                          },
                          {
                            prop: 'Max DEX Fee',
                            value: `${inputToRender(
                              BigInt(currentSwapVars[1].maxDexFee),
                              ERG_DECIMALS,
                            )} ${ERG_TOKEN_NAME}`,
                          },
                          {
                            prop: 'Minimal receive',
                            value: `${currentSwapVars[1].minOutput.amount} ${currentSwapVars[1].minOutput.asset.name}`,
                          },
                          {
                            prop: 'Maximum receive',
                            value: `${currentSwapVars[1].maxOutput.amount} ${currentSwapVars[1].maxOutput.asset.name}`,
                          },
                        ]}
                      >
                        <Table.Column prop="prop" label="Detail" />
                        <Table.Column prop="value" label="Amount" />
                      </Table>
                    </Grid>
                  </>
                )}
                <Grid xs={24} direction="column">
                  {errors[FORM_ERROR] && (
                    <Row>
                      <Text p small type="error">
                        {errors[FORM_ERROR]}
                      </Text>
                    </Row>
                  )}
                  <Row justify="center">
                    {!isWalletConnected ? (
                      <ConnectWallet />
                    ) : (
                      <Button
                        htmlType="submit"
                        disabled={
                          buttonStatus?.isDisabled ||
                          Object.values(errors).length > 0
                        }
                      >
                        {buttonStatus?.text}
                      </Button>
                    )}
                  </Row>
                </Grid>
              </>
            )}
          </Grid.Container>
        </form>
      )}
    />
  );
};

export const Swap: React.FC = (props) => {
  const pools = useGetAllPools();
  if (pools === undefined) {
    return (
      <Card>
        <Loading>Loading</Loading>
      </Card>
    );
  }

  return <SwapForm pools={pools} {...props} />;
};

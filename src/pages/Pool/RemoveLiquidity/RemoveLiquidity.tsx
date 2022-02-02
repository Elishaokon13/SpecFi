import { PoolId } from '@ergolabs/ergo-dex-sdk';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { skip } from 'rxjs';

import { getPositionByAmmPoolId } from '../../../api/positions';
import {
  useObservable,
  useSubject,
  useSubscription,
} from '../../../common/hooks/useObservable';
import { Currency } from '../../../common/models/Currency';
import { Position } from '../../../common/models/Position';
import { FormPairSection } from '../../../components/common/FormView/FormPairSection/FormPairSection';
import { FormSlider } from '../../../components/common/FormView/FormSlider/FormSlider';
import {
  openConfirmationModal,
  Operation,
} from '../../../components/ConfirmationModal/ConfirmationModal';
import { Page } from '../../../components/Page/Page';
import { PageHeader } from '../../../components/Page/PageHeader/PageHeader';
import { PageSection } from '../../../components/Page/PageSection/PageSection';
import { SubmitButton } from '../../../components/SubmitButton/SubmitButton';
import { Flex, Skeleton } from '../../../ergodex-cdk';
import {
  Form,
  FormGroup,
  useForm,
} from '../../../ergodex-cdk/components/Form/NewForm';
import { RemoveLiquidityConfirmationModal } from './RemoveLiquidityConfirmationModal/RemoveLiquidityConfirmationModal';

interface RemoveFormModel {
  readonly percent: number;
  readonly xAmount?: Currency;
  readonly yAmount?: Currency;
  readonly lpAmount?: Currency;
}

export const RemoveLiquidity: FC = () => {
  const { poolId } = useParams<{ poolId: PoolId }>();
  const [position, updatePosition] = useSubject(getPositionByAmmPoolId);
  const form = useForm<RemoveFormModel>({
    percent: 100,
    xAmount: undefined,
    yAmount: undefined,
    lpAmount: undefined,
  });

  const [formValue] = useObservable(form.valueChangesWithSilent$);

  useEffect(() => updatePosition(poolId), []);

  useSubscription(
    form.controls.percent.valueChanges$.pipe(skip(1)),
    (percent) => {
      form.patchValue({
        xAmount: percent === 100 ? position?.x : position?.x.percent(percent),
        yAmount: percent === 100 ? position?.y : position?.y.percent(percent),
        lpAmount:
          percent === 100 ? position?.lp : position?.lp.percent(percent),
      });
    },
    [position],
  );

  const handleRemove = (
    form: FormGroup<RemoveFormModel>,
    poolData: Position,
  ) => {
    const xAmount = form.value.xAmount || poolData.x;
    const yAmount = form.value.yAmount || poolData.y;
    const lpAmount = form.value.lpAmount || poolData.lp;

    openConfirmationModal(
      (next) => {
        return (
          <RemoveLiquidityConfirmationModal
            onClose={next}
            xAmount={xAmount}
            yAmount={yAmount}
            lpAmount={lpAmount}
            pool={poolData.pool}
          />
        );
      },
      Operation.REMOVE_LIQUIDITY,
      {
        xAsset: xAmount,
        yAsset: yAmount,
      },
    );
  };

  return (
    <Page width={382} title="Remove liquidity" withBackButton>
      {position ? (
        <Form form={form} onSubmit={(form) => handleRemove(form, position)}>
          <Flex direction="col">
            <Flex.Item marginBottom={2}>
              <PageHeader x={position.x} y={position.y} />
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <PageSection title="Amount" noPadding>
                <Form.Item name="percent">
                  {({ value, onChange }) => (
                    <FormSlider value={value} onChange={onChange} />
                  )}
                </Form.Item>
              </PageSection>
            </Flex.Item>

            <Flex.Item marginBottom={4}>
              <FormPairSection
                title="Assets to remove"
                xAmount={formValue?.xAmount || position.x}
                yAmount={formValue?.yAmount || position.y}
              />
            </Flex.Item>

            {/*TODO: ADD_FEES_DISPLAY_AFTER_SDK_UPDATE[EDEX-468]*/}
            {/*<Flex.Item marginBottom={4}>*/}
            {/*  <TokenSpace title="Earned Fees" pair={pair} fees />*/}
            {/*</Flex.Item>*/}

            <Flex.Item>
              <SubmitButton disabled={!formValue?.percent} htmlType="submit">
                Remove
              </SubmitButton>
            </Flex.Item>
          </Flex>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </Page>
  );
};
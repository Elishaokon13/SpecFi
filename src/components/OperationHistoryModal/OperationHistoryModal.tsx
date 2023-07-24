import { Modal, ModalRef } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { OperationHistoryV2 } from './OperationHistory/OperationHistoryV2';

export const OperationHistoryModal: FC<ModalRef> = ({ close }) => {
  return (
    <>
      <Modal.Title>
        <Trans>Orders history</Trans>
      </Modal.Title>
      <Modal.Content width={740}>
        {<OperationHistoryV2 close={close} />}
      </Modal.Content>
    </>
  );
};

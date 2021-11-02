import './TokenListModal.less';

import React, { useState } from 'react';

import {
  Box,
  Col,
  Input,
  Row,
  SearchOutlined,
} from '../../../../../ergodex-cdk/components';
import { TokenListItem } from './TokenListItem';

interface TokenListModalProps {
  close: () => void;
  onSelectChanged?: (name: string) => void | undefined;
}

const tokenList = [
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
  {
    symbol: 'ERG',
    name: 'Ergo',
    iconName: 'erg-orange',
  },
  {
    symbol: 'ADA',
    name: 'Ada',
  },
];

const TokenListModal: React.FC<TokenListModalProps> = ({
  close,
  onSelectChanged,
}) => {
  const [searchWords, setSearchWords] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const handleClick = (symbol: string) => {
    if (onSelectChanged) {
      onSelectChanged(symbol);
    }

    if (close) {
      close();
    }
  };

  return (
    <Box className="token-list-modal" padding={0}>
      <Input
        placeholder="Search"
        size="large"
        prefix={<SearchOutlined />}
        onChange={handleSearch}
      />
      <Row className="token-list-modal__token-list">
        <Col span={24}>
          {tokenList
            .filter((token) => {
              return token.symbol
                .toLowerCase()
                .includes(searchWords.toLowerCase());
            })
            .map((token, key) => (
              <TokenListItem
                key={key}
                symbol={token.symbol}
                name={token.name}
                iconName={token.symbol}
                balance={0.01342}
                onClick={() => handleClick(token.symbol)}
              />
            ))}
        </Col>
      </Row>
    </Box>
  );
};

export { TokenListModal };

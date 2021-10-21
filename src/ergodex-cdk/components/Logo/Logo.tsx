import './Logo.less';

import React from 'react';

import { ReactComponent as LogoLabel } from '../../assets/images/logo-ergodex.svg';
import { ReactComponent as LogoIcon } from '../../assets/images/logoicon.svg';

export interface LogoProps {
  label?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ label }) => {
  return (
    <div className="logo-wrapper">
      <LogoIcon />
      {label && <LogoLabel className="logo-label" />}
    </div>
  );
};

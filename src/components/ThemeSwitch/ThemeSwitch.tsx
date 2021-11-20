import { SwitchProps } from 'antd';
import React, { useCallback, useState } from 'react';

import { useSettings } from '../../context';
import { Switch } from '../../ergodex-cdk';

const ThemeSwitch: React.FC<SwitchProps> = (): JSX.Element => {
  const [settings, setSettings] = useSettings();
  const { theme } = settings;
  const [isDark, setIsDark] = useState(theme === 'dark');

  const handleChangeTheme = useCallback(() => {
    if (isDark) {
      setIsDark(false);
      setSettings({
        ...settings,
        theme: 'light',
      });
    } else {
      setIsDark(true);
      setSettings({
        ...settings,
        theme: 'dark',
      });
    }
  }, [isDark, settings, setSettings]);

  return (
    <Switch defaultChecked={isDark} size="small" onChange={handleChangeTheme} />
  );
};

export { ThemeSwitch };

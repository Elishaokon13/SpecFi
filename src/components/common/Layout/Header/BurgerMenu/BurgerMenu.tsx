import {
  Button,
  Dropdown,
  FileTextOutlined,
  GithubOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  Menu,
  Modal,
  QuestionCircleOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { fireAnalyticsEvent, user } from '@spectrumlabs/analytics';
import { stringify } from 'qs';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
} from '../../../../../common/constants/locales';
import { useApplicationSettings } from '../../../../../context';
import { useQuery } from '../../../../../hooks/useQuery';
import { ThemeSwitch } from '../../../../ThemeSwitch/ThemeSwitch';
import { DotsIcon } from '../../../Icons/DotsIcon';
import { ManualRefundModal } from './ManualRefundModal/ManualRefundModal';

const StyledMenu = styled(Menu)`
  padding: calc(var(--spectrum-base-gutter) * 2);
  min-width: 233px;
`;

const ThemeSwitchContainer = styled.div`
  border-bottom: 1px solid var(--spectrum-box-border-color);
  padding: 0 0 0.5rem;
  margin-bottom: 0.5rem;
`;

const OtherMenuItem = styled(Menu.Item)`
  .ant-dropdown-menu-title-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  padding: 0 calc(var(--spectrum-base-gutter) * 2);
  height: 36px;
`;

const ContributeLanguageButton = styled(Button)`
  margin-top: 8px;
  width: 100%;
`;

const BurgerMenu = (): JSX.Element => {
  const [isMainMenu, setIsMainMenu] = useState<boolean>(true);
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const [settings, setSettings] = useApplicationSettings();
  const location = useLocation();
  const qs = useQuery();

  const menu = [
    {
      title: t`About`,
      icon: <InfoCircleOutlined />,
      link: 'https://docs.spectrum.fi/docs/about-spectrumdex/intro',
    },
    {
      title: t`How to use`,
      icon: <QuestionCircleOutlined />,
      link: 'https://docs.spectrum.fi/docs/user-guides/quick-start',
    },
    {
      title: t`Docs`,
      icon: <FileTextOutlined />,
      link: 'https://docs.spectrum.fi',
    },
    {
      title: 'GitHub',
      icon: <GithubOutlined />,
      link: 'https://github.com/spectrum-finance',
    },
    {
      title: t`Manual Refund`,
      icon: <ReloadOutlined />,
      onClick: () => {
        setMenuVisible(false);
        Modal.open(({ close }) => <ManualRefundModal close={close} />);
      },
    },
    {
      title: t`Language`,
      icon: <GlobalOutlined />,
      additional: <RightOutlined style={{ marginLeft: 36 }} />,
      onClick: () => {
        setIsMainMenu(false);
      },
    },
  ];

  const changeLanguage = (locale: string) => {
    fireAnalyticsEvent('Select Locale', { locale });
    user.set('locale_active', locale);
    setSettings({
      ...settings,
      lang: locale,
    });
  };

  const menuOthers = (
    <StyledMenu>
      <ThemeSwitchContainer>
        <ThemeSwitch />
      </ThemeSwitchContainer>
      {menu.map(
        (item, index) =>
          item && (
            <OtherMenuItem key={index + 1} icon={item.icon}>
              <a
                href={item.link}
                rel="noreferrer"
                target={item.link ? '_blank' : ''}
                onClick={item.onClick}
              >
                {item.title}
              </a>
              {item.additional && item.additional}
            </OtherMenuItem>
          ),
      )}
    </StyledMenu>
  );

  const menuLanguages = (
    <StyledMenu>
      <OtherMenuItem key="langs-back" icon={<LeftOutlined />}>
        <a onClick={() => setIsMainMenu(true)} rel="noopener noreferrer" />
      </OtherMenuItem>
      {SUPPORTED_LOCALES.map((locale) => {
        return (
          <OtherMenuItem key={locale}>
            <Link
              replace={true}
              to={{
                ...location,
                search: stringify({ ...qs, lng: locale }),
              }}
              rel="noopener noreferrer"
              onClick={() => {
                changeLanguage(locale);
              }}
            >
              {LOCALE_LABEL[locale]}
            </Link>
          </OtherMenuItem>
        );
      })}
      <ContributeLanguageButton
        href="https://crowdin.com/project/ergodex-frontend"
        target="_blank"
        type="primary"
        block
      >
        <Trans>Contribute</Trans>
      </ContributeLanguageButton>
    </StyledMenu>
  );

  const onMenuVisibleChange = (flag: boolean) => {
    setMenuVisible(flag);
    if (flag) {
      setIsMainMenu(true);
    }
  };

  return (
    <Dropdown
      overlay={isMainMenu ? menuOthers : menuLanguages}
      trigger={['click']}
      visible={isMenuVisible}
      onVisibleChange={onMenuVisibleChange}
    >
      <Button className="header__btn" size="large" icon={<DotsIcon />} />
    </Dropdown>
  );
};

export { BurgerMenu };

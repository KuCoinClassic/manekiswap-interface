import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { animateScroll, scroller } from 'react-scroll';
import { useMedia } from 'react-use';
import { Flex, Image, Link } from 'theme-ui';

import LogoImg from '../../assets/images/logo.png';
import routes from '../routes';

const hashLinkElement: Record<string, string> = {
  '#about': 'aboutAnchor',
  '#roadmap': 'roadmapAnchor',
  '#distribution': 'distributionAnchor',
  '#contact': 'contactAnchor',
};

export default function Header(props: { paddingX: string }) {
  const { paddingX } = props;
  const isLargerThan1024 = useMedia('(min-width: 1024px)');
  const { t } = useTranslation(['landing']);

  const { hash } = useLocation();

  useEffect(() => {
    bouncingScroll(hashLinkElement[hash]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bouncingScroll = (elementName: string) => {
    const elements = document.getElementsByName(elementName);
    if (elements.length === 0) return;

    const { y } = elements[0].getBoundingClientRect();
    const currentY = window.pageYOffset;

    if (currentY < y) {
      // scroll down
      animateScroll.scrollTo(currentY - 256, {
        duration: 200,
        delay: 0,
        smooth: 'easeInCubic',
      });
    } else {
      // scroll up
      animateScroll.scrollTo(currentY + 256, {
        duration: 200,
        delay: 0,
        smooth: 'easeInCubic',
      });
    }

    setTimeout(() => {
      scroller.scrollTo(elementName, {
        duration: 600,
        delay: 0,
        smooth: 'easeOutCubic',
      });
    }, 200);
  };

  return (
    <Flex
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        height: 80,
        paddingX,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'background',
      }}
    >
      <Image src={LogoImg} sx={{ height: 48, width: 160 }} />
      {isLargerThan1024 && (
        <Flex>
          <Link
            variant="buttons.small-ghost"
            sx={{
              fontWeight: 'medium',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'text',
            }}
            href={`${routes.landing}#about`}
            onClick={(e) => {
              e.preventDefault();
              bouncingScroll(hashLinkElement['#about']);
            }}
          >
            {t('landing:how_it_works')}
          </Link>
          <Link
            variant="buttons.small-ghost"
            sx={{
              fontWeight: 'medium',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'text',
            }}
            href={`${routes.landing}#roadmap`}
            onClick={(e) => {
              e.preventDefault();
              bouncingScroll(hashLinkElement['#roadmap']);
            }}
          >
            {t('landing:roadmap')}
          </Link>
          <Link
            variant="buttons.small-ghost"
            sx={{
              fontWeight: 'medium',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'text',
            }}
            href={`${routes.landing}#distribution`}
            onClick={(e) => {
              e.preventDefault();
              bouncingScroll(hashLinkElement['#distribution']);
            }}
          >
            {t('landing:token_distribution')}
          </Link>
          <Link
            variant="buttons.small-ghost"
            sx={{
              fontWeight: 'medium',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'text',
            }}
            href={`${routes.landing}#contact`}
            onClick={(e) => {
              e.preventDefault();
              bouncingScroll(hashLinkElement['#contact']);
            }}
          >
            {t('landing:contact')}
          </Link>
        </Flex>
      )}
    </Flex>
  );
}

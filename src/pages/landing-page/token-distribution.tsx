import { Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import { Cell, Pie, PieChart, Sector } from 'recharts';

import ChartEyeSVG from '../../assets/images/chart-eye.svg';
import { colors } from '../../themes/colors';

function Distribution(props: { title: string; description?: string; dotColor: string }) {
  const { title, description, dotColor } = props;
  const [isLargerThan1024] = useMediaQuery('(min-width: 1024px)');

  let marginBottom = '0px';
  if (!!description) {
    marginBottom = isLargerThan1024 ? '28px' : '20px';
  }

  return (
    <Flex marginBottom={marginBottom} width={isLargerThan1024 ? '274px' : undefined}>
      <Flex height="21px" width="21px" backgroundColor={dotColor} borderRadius="4px" marginRight="24px"></Flex>
      <Flex flex={1} flexDirection="column" alignItems="flex-start">
        <Text textAlign="left" fontSize="16px" fontWeight="bold" color="white">
          {title}
        </Text>
        {description && (
          <Text textAlign="left" fontSize="12px" marginTop={isLargerThan1024 ? '8px' : '4px'} color={colors.text._03}>
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

type DistributionInfo = {
  title: string;
  description?: string;
  dotColor: string;
  name: string;
  value: number;
};

const distributionConfig: Array<DistributionInfo> = [
  {
    title: '5% Contributors',
    dotColor: '#554423',
    name: 'contributors',
    value: 5,
  },
  {
    title: '10% Investors',
    description: 'TBD after 6 months',
    dotColor: '#8d6b2a',
    name: 'investors',
    value: 10,
  },
  {
    title: '10% Team',
    description: '20% initial after 6 months, remaining vested quarterly',
    dotColor: '#b87c0a',
    name: 'team',
    value: 10,
  },
  {
    title: '15% Founders',
    description: '20% initial after 6 months, remaining vested quarterly',
    dotColor: '#e59701',
    name: 'founders',
    value: 15,
  },
  {
    title: '25% Treasury',
    description: 'For strategic planning (rewards, bounty hunt, finance)',
    dotColor: '#e5b301',
    name: 'treasury',
    value: 25,
  },
  {
    title: '35% Community',
    description: 'Airdrop, IDO, IEO',
    dotColor: '#e5c401',
    name: 'community',
    value: 35,
  },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;

  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 11;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius + 3}
        outerRadius={outerRadius + 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={'#fff'} fill="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="#fff">{`${value}%`}</text>
    </g>
  );
};

export default function TokenDistribution() {
  const [isLargerThan1024] = useMediaQuery('(min-width: 1024px)');
  const { t } = useTranslation();
  const ref = useRef(null);
  const eyeEl: MutableRefObject<HTMLElement | undefined> = useRef(undefined);
  const [activeIndex, setActiveIndex] = useState(distributionConfig.length - 1);
  const { width } = useWindowSize();

  useEffect(() => {
    eyeEl.current = document.getElementById('eye') as HTMLElement;
  }, []);

  const onPieEnter = useCallback(
    (data: { midAngle: number }, index) => {
      const { midAngle } = data;
      const degree = 270 - midAngle;
      eyeEl.current?.style.setProperty('transform', `rotate(${degree}deg)`);
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const pieSize = useMemo(() => {
    return Math.min(540, width);
  }, [isLargerThan1024, width]);

  const outerRadius = useMemo(() => {
    return (pieSize - 170) / 2;
  }, [isLargerThan1024, pieSize]);

  const innerRadius = useMemo(() => {
    return outerRadius - pieSize / 16;
  }, [outerRadius, pieSize]);

  const eyePosition = useMemo(() => {
    return pieSize / 2 - innerRadius + 18;
  }, [isLargerThan1024, innerRadius, pieSize]);

  return (
    <Flex
      id="distribution"
      backgroundColor="#0e0e0e"
      marginX="auto"
      maxWidth="1440px"
      flexDirection="column"
      paddingTop={isLargerThan1024 ? '120px' : '80px'}
    >
      <Heading as="h2" textAlign="center" fontSize="40px" fontWeight="bold" marginBottom="12px" marginX="24px">
        {t('token_distribution')}
      </Heading>
      <Text textAlign="center" color={colors.text._03} fontSize="16px" marginBottom={isLargerThan1024 ? '80px' : '0px'}>
        {t('total_supply', { value: '30,000,000 MNK' })}
      </Text>
      <Flex
        paddingX={isLargerThan1024 ? 0 : '24px'}
        flexDirection={isLargerThan1024 ? 'row-reverse' : 'column'}
        justifyContent={isLargerThan1024 ? 'center' : 'flex-start'}
        overflow="hidden"
      >
        <Flex
          position="relative"
          alignItems="center"
          alignSelf={isLargerThan1024 ? undefined : 'center'}
          justifyContent="center"
          height={pieSize}
          width={pieSize}
        >
          <Flex
            ref={ref}
            id="eye"
            sx={{
              position: 'absolute',
              top: eyePosition,
              right: eyePosition,
              bottom: eyePosition,
              left: eyePosition,
              transform: 'rotate(-169.3deg)',
            }}
            alignItems="center"
            justifyContent="center"
          >
            <ChartEyeSVG />
          </Flex>
          <PieChart width={pieSize} height={pieSize}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={distributionConfig.sort((a, b) => b.value - a.value)}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {distributionConfig.map((el: DistributionInfo) => (
                <Cell key={el.name} fill={el.dotColor} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </Flex>
        <Flex flexDirection="column" justifyContent="center">
          {distributionConfig.map((el) => (
            <Distribution key={el.title} {...el} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

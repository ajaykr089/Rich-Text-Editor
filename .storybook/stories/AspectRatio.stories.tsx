import React from 'react';
import { AspectRatio, Grid, Flex, Box } from '@editora/ui-react';

export default {
  title: 'UI/AspectRatio',
  component: AspectRatio,
};

export const Default = () => (
  <AspectRatio ratio="16/9" style={{ width: 360 }}>
    <img
      src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=960&q=80"
      alt="Office setup"
    />
  </AspectRatio>
);

export const RatioMatrix = () => (
  <Grid style={{ gap: 14 }}>
    <AspectRatio ratio="1/1" style={{ width: 220 }}>
      <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#0284c7', color: '#fff' }}>
        1:1
      </Flex>
    </AspectRatio>
    <AspectRatio ratio="4/3" style={{ width: 280 }}>
      <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#7c3aed', color: '#fff' }}>
        4:3
      </Flex>
    </AspectRatio>
    <AspectRatio ratio="21/9" style={{ width: 420 }}>
      <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#f59e0b', color: '#fff' }}>
        21:9
      </Flex>
    </AspectRatio>
  </Grid>
);

export const FitModes = () => (
  <Grid style={{ gap: 14 }}>
    <Box style={{ fontSize: 12, color: '#64748b' }}>cover</Box>
    <AspectRatio ratio="3:2" fit="cover" style={{ width: 360 }}>
      <img src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=960&q=80" alt="Dog cover fit" />
    </AspectRatio>
    <Box style={{ fontSize: 12, color: '#64748b' }}>contain</Box>
    <AspectRatio ratio="3:2" fit="contain" style={{ width: 360 }}>
      <img src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=960&q=80" alt="Dog contain fit" />
    </AspectRatio>
  </Grid>
);

export const TokenStyled = () => (
  <AspectRatio
    ratio={2.35}
    style={
      {
        width: 420,
        '--ui-aspect-radius': '20px',
        '--ui-aspect-border': '1px solid #c7d2fe',
        '--ui-aspect-bg': '#eef2ff',
      } as any
    }
  >
    <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#4f46e5', color: '#fff' }}>
      Cinematic 2.35:1
    </Flex>
  </AspectRatio>
);

import React from 'react';
import { Avatar, Flex, Grid, Box } from '@editora/ui-react';

export default {
  title: 'UI/Avatar',
  component: Avatar,
};

export const Default = () => <Avatar initials="EA" />;

export const SizeScale = () => (
  <Flex style={{ alignItems: 'center', gap: 12 }}>
    <Avatar initials="XS" size="xs" />
    <Avatar initials="SM" size="sm" />
    <Avatar initials="MD" size="md" />
    <Avatar initials="LG" size="lg" />
    <Avatar initials="XL" size="xl" />
  </Flex>
);

export const ImageAndStatus = () => (
  <Flex style={{ alignItems: 'center', gap: 14 }}>
    <Avatar src="https://randomuser.me/api/portraits/women/65.jpg" alt="Aanya Roy" size={56} status="online" />
    <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Ajay Kumar" size={56} status="away" />
    <Avatar src="https://randomuser.me/api/portraits/men/12.jpg" alt="Ishan Mehta" size={56} status="busy" />
    <Avatar src="https://randomuser.me/api/portraits/women/21.jpg" alt="Niya Shah" size={56} status="offline" />
  </Flex>
);

export const ShapeVariants = () => (
  <Flex style={{ alignItems: 'center', gap: 14 }}>
    <Avatar initials="CI" shape="circle" />
    <Avatar initials="RD" shape="rounded" />
    <Avatar initials="SQ" shape="square" />
  </Flex>
);

export const RingAndCustomTokens = () => (
  <Avatar
    initials="PK"
    ring
    size={64}
    shape="rounded"
    style={
      {
        '--ui-avatar-bg': '#eff6ff',
        '--ui-avatar-color': '#1d4ed8',
        '--ui-avatar-border': '1px solid #bfdbfe',
      } as any
    }
  />
);

export const FallbackLogic = () => (
  <Grid style={{ gap: 10 }}>
    <Flex style={{ alignItems: 'center', gap: 12 }}>
      <Avatar alt="Uma Mahesh" />
      <Box style={{ fontSize: 12, color: '#64748b' }}>Fallback from alt</Box>
    </Flex>
    <Flex style={{ alignItems: 'center', gap: 12 }}>
      <Avatar initials="RT" />
      <Box style={{ fontSize: 12, color: '#64748b' }}>Fallback from initials</Box>
    </Flex>
    <Flex style={{ alignItems: 'center', gap: 12 }}>
      <Avatar>VK</Avatar>
      <Box style={{ fontSize: 12, color: '#64748b' }}>Fallback from slot text</Box>
    </Flex>
  </Grid>
);

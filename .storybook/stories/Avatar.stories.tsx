import React from 'react';
import { Avatar } from '@editora/ui-react';

export default {
  title: 'UI/Avatar',
  component: Avatar,
};


export const Default = () => (
  <Avatar style={{ width: 48, height: 48, borderRadius: '50%', background: '#ccc' }} />
);

export const WithImage = () => (
  <Avatar
    src="https://randomuser.me/api/portraits/men/32.jpg"
    alt="Ajay Kumar"
    style={{ width: 64, height: 64, borderRadius: '50%' }}
  />
);

export const WithInitials = () => (
  <Avatar initials="AK"/>
);

export const WithAltFallback = () => (
  <Avatar alt="Uma Mahesh" />
);

export const WithCustomFallback = () => (
  <Avatar
    size="200"
    bg="#f3e8ff"
    color="#a21caf"
    radius="50%"
    style={{ "--ui-avatar-size": "64px", fontWeight: 600 }}
  >
    PK
  </Avatar>
);

import React from 'react';
import { AspectRatio } from '@editora/ui-react';

export default {
  title: 'UI/AspectRatio',
  component: AspectRatio,
};


export const Default = () => (
  <AspectRatio style={{ width: 300, background: "#eee" }}>
    <img
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Aspect"
      style={{ width: "100%", height: "auto" }}
    />
  </AspectRatio>
);

export const SixteenByNine = () => (
  <AspectRatio ratio={16/9} style={{ width: 320, background: '#e0e7ff' }}>
    <div style={{ background: '#2563eb', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      16:9 (ratio={16/9})
    </div>
  </AspectRatio>
);

export const FourByThree = () => (
  <AspectRatio ratio={4/3} style={{ width: 320, background: '#fef9c3' }}>
    <div style={{ background: '#f59e42', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      4:3 (ratio={4/3})
    </div>
  </AspectRatio>
);

export const OneByOne = () => (
  <AspectRatio ratio={1} style={{ width: 200, background: '#f3f4f6' }}>
    <div style={{ background: '#10b981', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      1:1 (ratio={1})
    </div>
  </AspectRatio>
);

export const CustomDecimal = () => (
  <AspectRatio ratio={2.35} style={{ width: 320, background: '#f3e8ff' }}>
    <div style={{ background: '#a21caf', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      2.35:1 (ratio={2.35})
    </div>
  </AspectRatio>
);

export const StringRatio = () => (
  <AspectRatio ratio="21/9" style={{ width: 320, background: '#e0f2fe' }}>
    <div style={{ background: '#0284c7', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      21:9 (ratio="21/9")
    </div>
  </AspectRatio>
);

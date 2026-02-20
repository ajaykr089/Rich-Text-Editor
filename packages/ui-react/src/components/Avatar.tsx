
import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number;
  bg?: string;
  color?: string;
  radius?: string;
  fontWeight?: number | string;
}

/**
 * Avatar component
 * @param src - image url
 * @param alt - alt text (used for fallback initials)
 * @param initials - fallback initials (overrides alt)
 * @param size - shorthand for avatar size in px
 * @param bg - shorthand for background color
 * @param color - shorthand for text color
 * @param radius - shorthand for border radius
 * @param fontWeight - shorthand for font weight
 * @example <Avatar src="..." alt="Ajay Kumar" initials="AK" size={64} bg="#e0e7ff" color="#2563eb" fontWeight={600} />
 */
export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(({ src, alt, initials, size, bg, color, radius, fontWeight, children, ...rest }, ref) => {
  // Fallback: use initials prop, else alt initials, else children, else '?'
  let fallback = initials;
  if (!fallback && alt) {
    fallback = alt
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  if (!fallback && typeof children === 'string') {
    fallback = children.slice(0, 2).toUpperCase();
  }
  if (!fallback) fallback = '?';
  return React.createElement(
    'ui-avatar',
    {
      ref,
      src,
      alt,
      size,
      bg,
      color,
      radius,
      fontweight: fontWeight,
      ...rest
    },
    fallback
  );
});
Avatar.displayName = 'Avatar';

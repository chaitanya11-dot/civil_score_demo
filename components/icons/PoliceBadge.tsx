
import React from 'react';
import type { IconProps } from './Icon';

const PoliceBadge: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v6" />
    <path d="M10 10l4 4" />
    <path d="M10 14l4-4" />
  </svg>
);

export default PoliceBadge;

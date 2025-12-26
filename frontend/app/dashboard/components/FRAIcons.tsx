// Exact dashboard replication from DashboardModule
// FRA Icon Components
// Custom SVG icons for IFR, CR, CFR, Assets, and Schemes

import React from 'react';

interface IconProps {
    className?: string;
    size?: number;
    color?: string;
}

// Individual Forest Rights (IFR) Icon
export const IFRIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2C10.34 2 9 3.34 9 5C9 6.66 10.34 8 12 8C13.66 8 15 6.66 15 5C15 3.34 13.66 2 12 2Z"
            fill={color}
        />
        <path
            d="M12 10C9.79 10 8 11.79 8 14V22H10V14C10 12.9 10.9 12 12 12C13.1 12 14 12.9 14 14V22H16V14C16 11.79 14.21 10 12 10Z"
            fill={color}
        />
        <rect x="2" y="18" width="20" height="4" rx="1" fill={color} opacity="0.3" />
    </svg>
);

// Community Forest Rights (CFR) Icon
export const CFRIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="7" cy="5" r="2" fill={color} />
        <circle cx="12" cy="5" r="2" fill={color} />
        <circle cx="17" cy="5" r="2" fill={color} />
        <path
            d="M7 9C5.34 9 4 10.34 4 12V18H6V12C6 11.45 6.45 11 7 11C7.55 11 8 11.45 8 12V18H10V12C10 10.34 8.66 9 7 9Z"
            fill={color}
        />
        <path
            d="M12 9C10.34 9 9 10.34 9 12V18H11V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V18H15V12C15 10.34 13.66 9 12 9Z"
            fill={color}
        />
        <path
            d="M17 9C15.34 9 14 10.34 14 12V18H16V12C16 11.45 16.45 11 17 11C17.55 11 18 11.45 18 12V18H20V12C20 10.34 18.66 9 17 9Z"
            fill={color}
        />
        <rect x="2" y="19" width="20" height="3" rx="1" fill={color} opacity="0.3" />
    </svg>
);

// Conversion Rights (CR) Icon
export const CRIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2L2 7V12C2 17.55 6.84 22.74 12 24C17.16 22.74 22 17.55 22 12V7L12 2Z"
            stroke={color}
            strokeWidth="2"
            fill="none"
        />
        <path
            d="M9 12L11 14L15 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Farmland Asset Icon
export const FarmlandIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect x="2" y="18" width="20" height="4" fill={color} opacity="0.3" />
        <path
            d="M4 18V10C4 8.9 4.9 8 6 8H8C9.1 8 10 8.9 10 10V18"
            stroke={color}
            strokeWidth="2"
            fill="none"
        />
        <path
            d="M14 18V6C14 4.9 14.9 4 16 4H18C19.1 4 20 4.9 20 6V18"
            stroke={color}
            strokeWidth="2"
            fill="none"
        />
    </svg>
);

// Water Body Icon
export const WaterBodyIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2C8 8 4 12 4 16C4 19.31 6.69 22 10 22H14C17.31 22 20 19.31 20 16C20 12 16 8 12 2Z"
            fill={color}
            opacity="0.7"
        />
        <path
            d="M12 6C10 10 8 12 8 14C8 16.21 9.79 18 12 18C14.21 18 16 16.21 16 14C16 12 14 10 12 6Z"
            fill="white"
            opacity="0.3"
        />
    </svg>
);

// Homestead Icon
export const HomesteadIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M12 3L2 12H5V20H19V12H22L12 3Z" fill={color} />
        <rect x="9" y="14" width="6" height="6" fill="white" opacity="0.5" />
    </svg>
);

// Scheme Icon (Government Program)
export const SchemeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
        <path d="M3 8H21" stroke={color} strokeWidth="2" />
        <circle cx="7" cy="14" r="1.5" fill={color} />
        <circle cx="12" cy="14" r="1.5" fill={color} />
        <circle cx="17" cy="14" r="1.5" fill={color} />
    </svg>
);

// Forest Cover Icon
export const ForestCoverIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M7 22V16L4 13L7 10L4 7L7 4L10 7L7 10L10 13L7 16V22H7Z" fill={color} />
        <path d="M12 22V14L9 11L12 8L9 5L12 2L15 5L12 8L15 11L12 14V22H12Z" fill={color} opacity="0.7" />
        <path d="M17 22V16L14 13L17 10L14 7L17 4L20 7L17 10L20 13L17 16V22H17Z" fill={color} opacity="0.5" />
        <rect x="2" y="21" width="20" height="2" fill={color} opacity="0.3" />
    </svg>
);

// Export all icons
export const FRAIcons = {
    IFR: IFRIcon,
    CFR: CFRIcon,
    CR: CRIcon,
    Farmland: FarmlandIcon,
    WaterBody: WaterBodyIcon,
    Homestead: HomesteadIcon,
    Scheme: SchemeIcon,
    ForestCover: ForestCoverIcon,
};

export default FRAIcons;

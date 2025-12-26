// Exact dashboard replication from DashboardModule
// Government Portal Theme Configuration
// Inspired by Bhuvan and PM Gati Shakti design systems

export const governmentTheme = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Primary blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Success green
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },
        accent: {
            50: '#fef3c7',
            100: '#fde68a',
            200: '#fcd34d',
            300: '#fbbf24',
            400: '#f59e0b', // Warning orange
            500: '#d97706',
            600: '#b45309',
            700: '#92400e',
            800: '#78350f',
            900: '#451a03',
        },
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Error red
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },
        neutral: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
        // Government-specific colors
        government: {
            saffron: '#FF9933',
            white: '#FFFFFF',
            green: '#138808',
            navy: '#000080',
            ashoka: '#000080', // Ashoka Chakra blue
        },
    },

    typography: {
        fontFamily: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            secondary: "'Roboto', sans-serif",
            mono: "'Fira Code', 'Courier New', monospace",
        },
        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem',    // 48px
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },

    spacing: {
        0: '0',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
    },

    borderRadius: {
        none: '0',
        sm: '0.25rem',   // 4px
        base: '0.5rem',  // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },

    // Component-specific styles
    components: {
        card: {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '1rem',
            padding: '1.5rem',
            shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        button: {
            primary: {
                background: '#3b82f6',
                color: '#ffffff',
                hover: '#2563eb',
            },
            secondary: {
                background: '#22c55e',
                color: '#ffffff',
                hover: '#16a34a',
            },
            outline: {
                background: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                hover: '#eff6ff',
            },
        },
        badge: {
            success: {
                background: '#dcfce7',
                color: '#166534',
            },
            warning: {
                background: '#fef3c7',
                color: '#92400e',
            },
            danger: {
                background: '#fee2e2',
                color: '#991b1b',
            },
            info: {
                background: '#dbeafe',
                color: '#1e40af',
            },
        },
    },

    // Traffic light indicators for scheme coverage
    trafficLights: {
        green: {
            background: '#dcfce7',
            border: '#22c55e',
            icon: '🟢',
            threshold: 75, // >75%
        },
        yellow: {
            background: '#fef3c7',
            border: '#f59e0b',
            icon: '🟡',
            threshold: 40, // 40-75%
        },
        red: {
            background: '#fee2e2',
            border: '#ef4444',
            icon: '🔴',
            threshold: 0, // <40%
        },
    },

    // Layer colors for GIS map
    mapLayers: {
        ifr: {
            fill: 'rgba(59, 130, 246, 0.3)',   // Blue
            stroke: '#3b82f6',
            strokeWidth: 2,
        },
        cr: {
            fill: 'rgba(34, 197, 94, 0.3)',    // Green
            stroke: '#22c55e',
            strokeWidth: 2,
        },
        cfr: {
            fill: 'rgba(249, 115, 22, 0.3)',   // Orange
            stroke: '#f97316',
            strokeWidth: 2,
        },
        potential: {
            fill: 'rgba(168, 85, 247, 0.2)',   // Purple heatmap
            stroke: '#a855f7',
        },
        farmland: {
            fill: 'rgba(234, 179, 8, 0.4)',    // Yellow
            stroke: '#eab308',
        },
        waterBodies: {
            fill: 'rgba(14, 165, 233, 0.5)',   // Cyan
            stroke: '#0ea5e9',
        },
        habitation: {
            fill: 'rgba(168, 85, 247, 0.3)',   // Purple
            stroke: '#a855f7',
        },
    },
};

export default governmentTheme;

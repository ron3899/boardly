import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Linear/Modern Style
        brand: {
          DEFAULT: '#5B6EF5',
          hover: '#4A5CE4',
          light: '#EEF0FE',
          dark: '#3648D0',
        },
        // Surface Colors (Dark Mode Default)
        surface: {
          DEFAULT: '#0F0F14',
          mid: '#17171F',
          light: '#1E1E2A',
          card: '#1A1A26',
          overlay: '#252535',
        },
        // Border Colors
        border: {
          subtle: '#2A2A38',
          DEFAULT: '#333347',
          strong: '#4A4A65',
        },
        // Text Colors
        text: {
          primary: '#F0F0F5',
          secondary: '#9090A8',
          disabled: '#5A5A70',
          inverse: '#0F0F14',
        },
        // Status Colors
        status: {
          backlog: '#6B7280',
          todo: '#64748B',
          'in-progress': '#F59E0B',
          review: '#A855F7',
          done: '#22C55E',
          cancelled: '#9CA3AF',
          blocked: '#EF4444',
        },
        // Priority Colors
        priority: {
          urgent: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#6B7280',
        },

        // Legacy Monday.com colors for compatibility
        'monday-purple': '#6161FF',
        'monday-purple-hover': '#4B4BE8',
        'monday-dark': '#1C1F3B',
        'monday-bg': '#F6F7FB',
        'monday-success': '#00C875',
        'monday-warning': '#FDAB3D',
        'monday-danger': '#E2445C',
        'monday-info': '#579BFC',

        // shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

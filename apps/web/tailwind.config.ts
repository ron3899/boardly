import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tailwind CSS system colors (HSL-based)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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

        // Monday.com Color Palette - Direct hex values
        'monday-purple': {
          DEFAULT: '#6C6CFF',
          dark: '#5959D1',
          light: '#F0F0FF',
        },
        'monday-green': '#00C875',
        'monday-orange': '#FF7B54',
        'monday-blue': '#579BFC',
        'monday-red': '#E44258',
        'monday-yellow': '#FDAB3D',
        'monday-pink': '#FF69B4',
        'monday-sidebar': '#2B2C5E',
        'monday-bg': '#F6F7FB',
        'monday-text': {
          primary: '#323338',
          secondary: '#676879',
          muted: '#C5C7D0',
        },
        'monday-border': '#E6E9EF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Figtree', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'monday-sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'monday-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'monday-lg': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cores temáticas doces
				sweet: {
					50: '#fdf7f4',
					100: '#fae9e3',
					200: '#f4d3c7',
					300: '#ecb4a1',
					400: '#e08975',
					500: '#d66850',
					600: '#c7533f',
					700: '#a54635',
					800: '#883d31',
					900: '#70362b',
					950: '#3c1b15'
				},
				pink: {
					50: '#fef7f3',
					100: '#feebe6',
					200: '#fdd5c8',
					300: '#fab59e',
					400: '#f58a6c',
					500: '#ee6444',
					600: '#dc4a2a',
					700: '#b83a21',
					800: '#973220',
					900: '#7d2e20',
					950: '#44140e'
				},
				lavender: {
					50: '#f7f6fb',
					100: '#efecf7',
					200: '#e1dbf0',
					300: '#cac0e4',
					400: '#ad9dd5',
					500: '#9279c4',
					600: '#7d5faf',
					700: '#6c4f97',
					800: '#5a427d',
					900: '#4c3866',
					950: '#302243'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bounce-soft': {
					'0%, 20%, 53%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%, 43%': {
						transform: 'translateY(-8px)'
					},
					'70%': {
						transform: 'translateY(-4px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-soft': 'bounce-soft 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

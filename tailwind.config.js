/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '1620px',
        '3xl': '1920px',
       
      },
    },
    extend: {
      screens: {
        'max-680': { 'max': '680px' },
      },
      colors: {
        // Please write the variable as design variable name, if it is not exist, then please report to design team

        //black
        'rs-v2-linear-black': '#2A313A',
        'rs-v2-black-text-button': '#13131A',
        'rs-v2-black-toast-text-button': '#263238',
        'rs-v2-dark-toast-background': '#242C32',

        //blue
        'rs-v2-navy-blue': '#1F262F',
        'rs-v2-navy-blue-60%': '#354358AD',
        'rs-v2-slate-blue-60%': '#2C394AAD',
        'rs-v2-slate-blue': '#252E3B',
        'rs-v2-shadow-blue': '#303746',
        'rs-v2-thunder-blue': '#354358',
        'rs-v2-galaxy-blue': '#374151',
        'rs-v2-deep-indigo': '#13181F',
        'rs-v2-gunmetal-blue': '#58657A',
        'rs-v2-midnight-blue': '#003465',
        'rs-neutral-nero': '#1C1C24',
        'rs-yale-blue': '#376EB5',
        'rs-azure-blue': '#3699FF',
        'rs-light-blue': '#E3F1FF',
        'rs-baltic-blue': '#1486DC', // "baltic" in design
        'rs-v2-sky-blue': '#0088D1',

        //green
        'rs-alert-green': '#20C997',
        'rs-alert-green-30%': '#20C9974D',
        'rs-alert-green-20%': '#E4F7E633',
        'rs-v2-green-2': '#169E50',
        'rs-v2-green-3': '#43A047',
        'rs-v2-green-4': '#2ECC5A',
        'rs-v2-green-toast': '#00DF80',
        'rs-v2-green-60%': '#E8F5E9',
        'rs-v2-aqua': '#77C3BE',
        'rs-v2-pie-mint-green': '#6ED37B',
        'rs-green-header': '#028366',

        //red
        'rs-v2-red': '#FC5A5A',
        'rs-v2-red-60%': '#FC5A5A4D',
        'rs-v2-red-bg': '#453131',
        'rs-v2-red-warning': '#F44336',

        //grey
        'rs-v2-dark-grey': '#18202A',
        'rs-v2-light-grey': '#A6A6A6',
        'rs-v2-toast-grey': '#546E7A',
        'rs-v2-grey-disable': '#5F5F5F',
        'rs-v2-space': '#67737F',
        'rs-v2-charcoal': '#505050',
        'rs-neutral-gray-gull': '#C4CDE0',
        'rs-neutral-dark-platinum': '#687484',
        'rs-neutral-chromium': '#A5AEC2',
        'rs-neutral-steel-gray': '#8997A9',
        'rs-divider-gray': '#D4D4D4',

        //white / silver
        'rs-v2-silver': '#F3F3F3',
        'rs-neutral-silver-lining': '#EEF1F8',
        'rs-fg-white' : '#FFFFFF',

        //mint
        'rs-v2-mint': '#36E2D7',
        'rs-v2-mint-20%': '#61F9F033',
        'rs-alert-bg-yellow': '#6A584B',
        'rs-dataset-2-bg': '#5AF2FC',
        'rs-dataset-2-bg-30%': '#5AF2FC4D',
        'rs-dataset-2': '#00BCD4',

        //yellow
        'rs-alert-yellow': '#FDAA09',
        'rs-gold-yellow': '#FFD700',
        'rs-sun-yellow': '#FDBF46',

        //***These variables below have no variable color name yet in design (Please help to refactor step by step)***
        //Transparent
        'rs-dark-card': 'rgba(31, 42, 55, 0.68)',
        'rs-dark-card2': 'rgba(53, 67, 88, 0.68)',
        'rs-dark-card3': 'rgba(44, 57, 74, 0.68)',
        'rs-dark-card4': 'rgba(42, 49, 58, 0)',
        'rs-deep-navy': 'rgba(53, 67, 88, 0.68)',

        //Alert
        'rs-alert-danger': '#FC5A5A',
        'rs-alert-warning': '#FDAA09',
        'rs-alert-normal': '#20C997',

        // Default
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        wave: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'slide-id': {
          from: { left: '4px' },
          to: { left: 'calc(100% - 20px)' },
        },
        'slide-en': {
          from: { left: 'calc(100% - 20px)' },
          to: { left: '4px' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'liquid-wave': 'wave 8s linear infinite',
        'switch-id': 'slide-id 0.2s linear forwards',
        'switch-en': 'slide-en 0.2s linear forwards',
      },
      backgroundImage: {
        'gradient-green-1':
          'linear-gradient(to top right, rgba(16, 120, 113, 1), rgba(16, 175, 137, 1), rgba(46, 116, 124, 1))',
        'gradient-blue-1':
          'linear-gradient(to top right, rgba(54, 153, 255, 1), rgba(0, 187, 213, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

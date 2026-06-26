/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        igf: {
          red:       '#8B0000',
          'red-bright': '#C41E3A',
          crimson:   '#DC143C',
          'dark-red':'#3D0000',
          black:     '#0A0000',
          'dark-bg': '#110000',
          'card-bg': '#1A0000',
          'border':  '#3D0000',
          text:      '#F5F5F5',
          muted:     '#A89090',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Impact', 'sans-serif'],
      },
      backgroundImage: {
        'igf-gradient': 'linear-gradient(135deg, #0A0000 0%, #1A0000 50%, #3D0000 100%)',
        'card-gradient': 'linear-gradient(145deg, #1A0000, #110000)',
        'red-glow': 'radial-gradient(ellipse at center, #8B000040 0%, transparent 70%)',
      },
      boxShadow: {
        'red-glow': '0 0 20px #8B000060, 0 0 40px #8B000030',
        'red-sm': '0 0 10px #8B000040',
        'card': '0 4px 24px #00000080',
      },
      animation: {
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 20px #8B000060' },
          '50%':      { boxShadow: '0 0 40px #C41E3A90' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        }
      }
    }
  },
  plugins: []
}

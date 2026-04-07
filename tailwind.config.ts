
// tailwind.config.ts
import type { Config } from 'tailwindcss'


const config: Config = {
  darkMode: 'class', // <-- add this
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes:{
        shake:{
          '0%, 100%':{transform:'translateX(0)'},
          '25%':{transform:'translateX(-5px)'},
          '75%':{transform: 'transalateX(5px)'}
        },
        wiggle:{
          '0%, 100%':{transform:'rotate(-3deg)'},
          '50%':{transform:'rotate(3deg'},

        },
      },
      
      animation:{shake:'shake 0.2s ease-in-out 0s 2', wiggle:'wiggle 0.2s ease-in-out infinite'},
      boxShadow: {
        'custom-gray-shadow': '0 4px 6px -1px rgba(107, 114, 128, 0.3)',
      },
      colors: {
        silverGray: '#bdc3c7',
        darkBlueGray: '#2c3e50',
        brand: {
          DEFAULT: "#2f556f",
          active: "#233947",
        },
      },
    },
  },
  plugins: [],
}

export default config

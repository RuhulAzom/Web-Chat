/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mb': '480px',
      'sm': '640px',
      'md': '770px',
      'md2': '991px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        // "body": "#202022",
        // "body-hover": "#464646",
        "body": "rgb(18,27,34)",
        "body-hover": "rgb(31,44,52)",
        "text-gray": "#898787",
        "main-red": "#fd7955",
        "main-search": "#dbdcff",
        "main-purple": "#7678ed",
        "main-border-gray": "#cecece",
        // "hover-mobile": "rgb(65,73,76)",
        "hover-mobile": "rgba(65,73,76,0.64)",
        "text-gray-black": "rgb(111,122,128)",
        "main-auth": "rgb(164,170,227)"
      },
      backgroundImage: {
        "wallpaper": "url(./src/assets/wallpaper/message2.jpg)"
      },
      boxShadow: {
        "auth": "0 0 90px #00000087"
      }
    },
  },
  plugins: [],
}


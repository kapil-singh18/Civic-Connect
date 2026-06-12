export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civic: {
          green: '#2E7D32',
          blue: '#1565C0',
          dark: '#212121',
          gray: '#F5F7FA',
          border: '#E5E7EB',
          success: '#4CAF50',
          warning: '#FF9800',
          danger: '#F44336'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

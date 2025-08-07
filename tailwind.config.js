/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',         // thêm toàn bộ src/pages
    './src/components/**/*.{js,ts,jsx,tsx}',    // thêm toàn bộ src/components
    // nếu bạn có folder khác chứa component, thêm tương tự ở đây
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Roboto"',
          '"Helvetica Neue"',
          '"Arial"',
          '"Noto Sans"',
          '"Liberation Sans"',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Ubuntu"',
          '"Cantarell"',
          '"Open Sans"',
        ],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border:     'var(--color-border)',
        input:      'var(--color-input)',
        ring:       'var(--color-ring)',
        primary:    'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary:  'var(--color-secondary)',
        destructive: 'var(--color-destructive)',
        success:    'var(--color-success)',
        warning:    'var(--color-warning)',
        error:      'var(--color-error)',
        card:       'var(--color-card)',
        popover:    'var(--color-popover)',
        muted:      'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        // bạn có thể thêm các màu custom khác ở đây
        lime:        '#B3FFAB',
        'mid-lime':  '#9EFF88',
        bright:      '#12FF75',
        emerald:     '#0AC909',
        neon:        '#00FF33',
        // …
      },
      fontWeight: {
        mid: 400,
      }
    },
  },
  plugins: [
    // ví dụ: require('@tailwindcss/forms'),
  ],
};

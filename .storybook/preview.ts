import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import '../app/styles.css';

const preview: Preview = {
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? themes.dark : themes.light,
    },
  },
};

export default preview;

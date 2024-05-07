// jest.setup.js
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

require('dotenv').config();

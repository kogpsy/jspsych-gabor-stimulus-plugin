/*
 * jspsych-library-template
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This is the file that tests 'lib.ts'.
 */

import {HELLO_CONSUMER} from './lib';

test('HELLO_CONSUMER contains "Hello consumer!"', () => {
  expect(HELLO_CONSUMER).toBe('Hello consumer!');
});
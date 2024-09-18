// @ref: https://dev.to/codeparrot/test-your-react-apps-with-vitest-2llb
// @ref: https://www.machinet.net/tutorial-eng/vitest-coverage-comprehensive-guide

import { installGlobals } from '@remix-run/node'
import { getClientEnv } from '#/utils/env.server'
import '@testing-library/jest-dom/vitest'

installGlobals()

global.ENV = getClientEnv()

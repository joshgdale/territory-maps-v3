/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| Login uses limiter.multi().penalize() in LoginController (failed attempts
| only). Keep this file for any future HTTP throttle middleware.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(60).every('1 minute')
})

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.get('/healthcheck', [controllers.Healthcheck, 'handle']).as('healthcheck')

router.get('/login', [controllers.auth.Login, 'show']).as('login.show').use(middleware.guest())
router.post('/login', [controllers.auth.Login, 'store']).as('login.store').use(middleware.guest())
router.post('/logout', [controllers.auth.Logout, 'handle']).as('logout').use(middleware.auth())

router
  .group(() => {
    router.get('/', [controllers.Dashboard, 'index']).as('dashboard.index')

    router.post('/working-note', [controllers.WorkingNote, 'store']).as('working_note.store')
    router.put('/working-note/:id', [controllers.WorkingNote, 'update']).as('working_note.update')
    router.delete('/working-note/:id', [controllers.WorkingNote, 'destroy']).as('working_note.destroy')

    router.get('/search', [controllers.Search, 'index']).as('search.index')

    router.get('/maps', [controllers.Maps, 'index']).as('maps.index')
    router.post('/maps', [controllers.Maps, 'store']).as('maps.store')
    router.get('/maps/:id', [controllers.Maps, 'show']).as('maps.show')
    router.put('/maps/:id', [controllers.Maps, 'update']).as('maps.update')
    router.delete('/maps/:id', [controllers.Maps, 'destroy']).as('maps.destroy')

    router
      .put('/maps/:id/messages/from-servant', [controllers.Maps, 'messageFromServant'])
      .as('maps.messages.fromServant')
    router
      .delete('/maps/:id/messages/from-servant', [controllers.Maps, 'deleteMessageFromServant'])
      .as('maps.messages.deleteFromServant')
    router
      .delete('/maps/:id/messages/to-servant', [controllers.Maps, 'deleteMessageToServant'])
      .as('maps.messages.deleteToServant')

    router.post('/maps/:id/activity', [controllers.Activity, 'store']).as('maps.activity.store')
    router
      .put('/maps/:id/activity/:activityId', [controllers.Activity, 'update'])
      .as('maps.activity.update')
    router
      .delete('/maps/:id/activity/:activityId', [controllers.Activity, 'destroy'])
      .as('maps.activity.destroy')

    router.post('/maps/:id/dnc', [controllers.DoNotCall, 'store']).as('maps.dnc.store')
    router.put('/maps/:id/dnc/:dncId', [controllers.DoNotCall, 'update']).as('maps.dnc.update')
    router.delete('/maps/:id/dnc/:dncId', [controllers.DoNotCall, 'destroy']).as('maps.dnc.destroy')

    router.post('/maps/:id/street', [controllers.Streets, 'store']).as('maps.street.store')
    router.put('/maps/:id/street/:streetId', [controllers.Streets, 'update']).as('maps.street.update')
    router.delete('/maps/:id/street/:streetId', [controllers.Streets, 'destroy']).as('maps.street.destroy')
    router
      .put('/maps/:id/street/:streetId/toggle-complete', [controllers.Streets, 'toggleComplete'])
      .as('maps.street.toggleComplete')

    router.post('/maps/:id/rural', [controllers.Rurals, 'store']).as('maps.rural.store')
    router.put('/maps/:id/rural/:ruralId', [controllers.Rurals, 'update']).as('maps.rural.update')
    router.delete('/maps/:id/rural/:ruralId', [controllers.Rurals, 'destroy']).as('maps.rural.destroy')
    router
      .put('/maps/:id/rural/:ruralId/toggle-complete', [controllers.Rurals, 'toggleComplete'])
      .as('maps.rural.toggleComplete')

    router.get('/documents', [controllers.Documents, 'index']).as('documents.index')
    router.get('/documents/export/s-13', [controllers.Documents, 'exportS13']).as('documents.export.s13')
    router
      .get('/documents/export/s-12/:id', [controllers.Documents, 'exportS12'])
      .as('documents.export.s12')
    router
      .get('/documents/export/dnc-worksheet', [controllers.Documents, 'exportDncWorksheet'])
      .as('documents.export.dncWorksheet')
    router
      .post('/documents/records/delete-non-compliant', [
        controllers.Documents,
        'deleteNonCompliantRecords',
      ])
      .as('documents.records.deleteNonCompliant')

    router.get('/settings', [controllers.Settings, 'index']).as('settings.index')
    router
      .put('/settings/share-message', [controllers.Settings, 'updateShareMessage'])
      .as('settings.updateShareMessage')
    router
      .put('/settings/confirmation-message', [controllers.Settings, 'updateConfirmationMessage'])
      .as('settings.updateConfirmationMessage')
    router.post('/settings/map-types', [controllers.Settings, 'addMapType']).as('settings.addMapType')
    router
      .delete('/settings/map-types/:id', [controllers.Settings, 'deleteMapType'])
      .as('settings.deleteMapType')
    router
      .post('/settings/street-categories', [controllers.Settings, 'addStreetCategory'])
      .as('settings.addStreetCategory')
    router
      .delete('/settings/street-categories/:id', [controllers.Settings, 'deleteStreetCategory'])
      .as('settings.deleteStreetCategory')
    router
      .post('/settings/roll-security-token', [controllers.Settings, 'rollSecurityToken'])
      .as('settings.rollSecurityToken')
  })
  .use(middleware.auth())

router.group(() => {
  router.get('/go', [controllers.Go, 'index']).as('go.index')

  router.get('/view/map/:id', [controllers.PublicMap, 'show']).as('public.map')
  router
    .put('/view/map/:id/messages/to-servant', [controllers.PublicMap, 'messageToServant'])
    .as('public.map.messages.toServant')
  router
    .put('/view/map/:id/street/:streetId/toggle-complete', [
      controllers.Streets,
      'toggleCompleteWithSecurityToken',
    ])
    .as('public.map.street.toggleComplete')
  router
    .put('/view/map/:id/rural/:ruralId/toggle-complete', [
      controllers.Rurals,
      'toggleCompleteWithSecurityToken',
    ])
    .as('public.map.rural.toggleComplete')

  router
    .get('/api/pdf/:template/:jobId', [controllers.Documents, 'renderTemplate'])
    .as('pdf.renderTemplate')
})

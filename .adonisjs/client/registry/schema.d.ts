/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'healthcheck': {
    methods: ["GET","HEAD"]
    pattern: '/healthcheck'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/healthcheck_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/healthcheck_controller').default['handle']>>>
    }
  }
  'login.show': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/login_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/login_controller').default['show']>>>
    }
  }
  'login.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').LoginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').LoginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/login_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/login_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'logout': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/logout_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/logout_controller').default['handle']>>>
    }
  }
  'dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'working_note.store': {
    methods: ["POST"]
    pattern: '/working-note'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/working_note').NewAndUpdateWorkingNoteValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/working_note').NewAndUpdateWorkingNoteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'working_note.update': {
    methods: ["PUT"]
    pattern: '/working-note/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/working_note').NewAndUpdateWorkingNoteValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/working_note').NewAndUpdateWorkingNoteValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'working_note.destroy': {
    methods: ["DELETE"]
    pattern: '/working-note/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/working_note_controller').default['destroy']>>>
    }
  }
  'search.index': {
    methods: ["GET","HEAD"]
    pattern: '/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
    }
  }
  'maps.index': {
    methods: ["GET","HEAD"]
    pattern: '/maps'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['index']>>>
    }
  }
  'maps.store': {
    methods: ["POST"]
    pattern: '/maps'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/map').CreateMapValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/map').CreateMapValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.show': {
    methods: ["GET","HEAD"]
    pattern: '/maps/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['show']>>>
    }
  }
  'maps.update': {
    methods: ["PUT"]
    pattern: '/maps/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/map').UpdateMapValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/map').UpdateMapValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.destroy': {
    methods: ["DELETE"]
    pattern: '/maps/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['destroy']>>>
    }
  }
  'maps.messages.fromServant': {
    methods: ["PUT"]
    pattern: '/maps/:id/messages/from-servant'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/map').UpdateMapMessageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/map').UpdateMapMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['messageFromServant']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['messageFromServant']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.messages.deleteFromServant': {
    methods: ["DELETE"]
    pattern: '/maps/:id/messages/from-servant'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['deleteMessageFromServant']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['deleteMessageFromServant']>>>
    }
  }
  'maps.messages.deleteToServant': {
    methods: ["DELETE"]
    pattern: '/maps/:id/messages/to-servant'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['deleteMessageToServant']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maps_controller').default['deleteMessageToServant']>>>
    }
  }
  'maps.activity.store': {
    methods: ["POST"]
    pattern: '/maps/:id/activity'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/activity').CreateActivityValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/activity').CreateActivityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.activity.update': {
    methods: ["PUT"]
    pattern: '/maps/:id/activity/:activityId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/activity').UpdateActivityValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; activityId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/activity').UpdateActivityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.activity.destroy': {
    methods: ["DELETE"]
    pattern: '/maps/:id/activity/:activityId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; activityId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/activity_controller').default['destroy']>>>
    }
  }
  'maps.dnc.store': {
    methods: ["POST"]
    pattern: '/maps/:id/dnc'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/do_not_call').CreateDoNotCallValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/do_not_call').CreateDoNotCallValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.dnc.update': {
    methods: ["PUT"]
    pattern: '/maps/:id/dnc/:dncId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/do_not_call').UpdateDoNotCallValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; dncId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/do_not_call').UpdateDoNotCallValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.dnc.destroy': {
    methods: ["DELETE"]
    pattern: '/maps/:id/dnc/:dncId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; dncId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/do_not_call_controller').default['destroy']>>>
    }
  }
  'maps.street.store': {
    methods: ["POST"]
    pattern: '/maps/:id/street'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/street').CreateStreetValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/street').CreateStreetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.street.update': {
    methods: ["PUT"]
    pattern: '/maps/:id/street/:streetId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/street').UpdateStreetValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; streetId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/street').UpdateStreetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.street.destroy': {
    methods: ["DELETE"]
    pattern: '/maps/:id/street/:streetId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; streetId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['destroy']>>>
    }
  }
  'maps.street.toggleComplete': {
    methods: ["PUT"]
    pattern: '/maps/:id/street/:streetId/toggle-complete'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; streetId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['toggleComplete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['toggleComplete']>>>
    }
  }
  'maps.rural.store': {
    methods: ["POST"]
    pattern: '/maps/:id/rural'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/rural').CreateRuralValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/rural').CreateRuralValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.rural.update': {
    methods: ["PUT"]
    pattern: '/maps/:id/rural/:ruralId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/rural').UpdateRuralValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; ruralId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/rural').UpdateRuralValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'maps.rural.destroy': {
    methods: ["DELETE"]
    pattern: '/maps/:id/rural/:ruralId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; ruralId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['destroy']>>>
    }
  }
  'maps.rural.toggleComplete': {
    methods: ["PUT"]
    pattern: '/maps/:id/rural/:ruralId/toggle-complete'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; ruralId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['toggleComplete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['toggleComplete']>>>
    }
  }
  'documents.index': {
    methods: ["GET","HEAD"]
    pattern: '/documents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['index']>>>
    }
  }
  'documents.export.s13': {
    methods: ["GET","HEAD"]
    pattern: '/documents/export/s-13'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportS13']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportS13']>>>
    }
  }
  'documents.export.s12': {
    methods: ["GET","HEAD"]
    pattern: '/documents/export/s-12/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportS12']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportS12']>>>
    }
  }
  'documents.export.dncWorksheet': {
    methods: ["GET","HEAD"]
    pattern: '/documents/export/dnc-worksheet'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportDncWorksheet']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['exportDncWorksheet']>>>
    }
  }
  'documents.records.deleteNonCompliant': {
    methods: ["POST"]
    pattern: '/documents/records/delete-non-compliant'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/documents').DeleteNonCompliantRecordsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/documents').DeleteNonCompliantRecordsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['deleteNonCompliantRecords']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['deleteNonCompliantRecords']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
    }
  }
  'settings.updateShareMessage': {
    methods: ["PUT"]
    pattern: '/settings/share-message'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').UpdateShareMessageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').UpdateShareMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateShareMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateShareMessage']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.updateConfirmationMessage': {
    methods: ["PUT"]
    pattern: '/settings/confirmation-message'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').UpdateConfirmationMessageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').UpdateConfirmationMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateConfirmationMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateConfirmationMessage']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.addMapType': {
    methods: ["POST"]
    pattern: '/settings/map-types'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').AddMapTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').AddMapTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['addMapType']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['addMapType']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.deleteMapType': {
    methods: ["DELETE"]
    pattern: '/settings/map-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteMapType']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteMapType']>>>
    }
  }
  'settings.addStreetCategory': {
    methods: ["POST"]
    pattern: '/settings/street-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').AddStreetCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').AddStreetCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['addStreetCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['addStreetCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.deleteStreetCategory': {
    methods: ["DELETE"]
    pattern: '/settings/street-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteStreetCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteStreetCategory']>>>
    }
  }
  'settings.rollSecurityToken': {
    methods: ["POST"]
    pattern: '/settings/roll-security-token'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').RollSecurityTokenValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').RollSecurityTokenValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['rollSecurityToken']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['rollSecurityToken']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'go.index': {
    methods: ["GET","HEAD"]
    pattern: '/go'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/go_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/go_controller').default['index']>>>
    }
  }
  'public.map': {
    methods: ["GET","HEAD"]
    pattern: '/view/map/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_map_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_map_controller').default['show']>>>
    }
  }
  'public.map.messages.toServant': {
    methods: ["PUT"]
    pattern: '/view/map/:id/messages/to-servant'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/map').UpdateMapMessageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/map').UpdateMapMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public_map_controller').default['messageToServant']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public_map_controller').default['messageToServant']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'public.map.street.toggleComplete': {
    methods: ["PUT"]
    pattern: '/view/map/:id/street/:streetId/toggle-complete'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; streetId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['toggleCompleteWithSecurityToken']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/streets_controller').default['toggleCompleteWithSecurityToken']>>>
    }
  }
  'public.map.rural.toggleComplete': {
    methods: ["PUT"]
    pattern: '/view/map/:id/rural/:ruralId/toggle-complete'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; ruralId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['toggleCompleteWithSecurityToken']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rurals_controller').default['toggleCompleteWithSecurityToken']>>>
    }
  }
  'pdf.renderTemplate': {
    methods: ["GET","HEAD"]
    pattern: '/api/pdf/:template/:jobId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { template: ParamValue; jobId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['renderTemplate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/documents_controller').default['renderTemplate']>>>
    }
  }
}

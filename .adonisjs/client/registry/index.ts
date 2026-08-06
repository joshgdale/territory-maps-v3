/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'healthcheck': {
    methods: ["GET","HEAD"],
    pattern: '/healthcheck',
    tokens: [{"old":"/healthcheck","type":0,"val":"healthcheck","end":""}],
    types: placeholder as Registry['healthcheck']['types'],
  },
  'login.show': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.show']['types'],
  },
  'login.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.store']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'working_note.store': {
    methods: ["POST"],
    pattern: '/working-note',
    tokens: [{"old":"/working-note","type":0,"val":"working-note","end":""}],
    types: placeholder as Registry['working_note.store']['types'],
  },
  'working_note.update': {
    methods: ["PUT"],
    pattern: '/working-note/:id',
    tokens: [{"old":"/working-note/:id","type":0,"val":"working-note","end":""},{"old":"/working-note/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['working_note.update']['types'],
  },
  'working_note.destroy': {
    methods: ["DELETE"],
    pattern: '/working-note/:id',
    tokens: [{"old":"/working-note/:id","type":0,"val":"working-note","end":""},{"old":"/working-note/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['working_note.destroy']['types'],
  },
  'search.index': {
    methods: ["GET","HEAD"],
    pattern: '/search',
    tokens: [{"old":"/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['search.index']['types'],
  },
  'maps.index': {
    methods: ["GET","HEAD"],
    pattern: '/maps',
    tokens: [{"old":"/maps","type":0,"val":"maps","end":""}],
    types: placeholder as Registry['maps.index']['types'],
  },
  'maps.store': {
    methods: ["POST"],
    pattern: '/maps',
    tokens: [{"old":"/maps","type":0,"val":"maps","end":""}],
    types: placeholder as Registry['maps.store']['types'],
  },
  'maps.show': {
    methods: ["GET","HEAD"],
    pattern: '/maps/:id',
    tokens: [{"old":"/maps/:id","type":0,"val":"maps","end":""},{"old":"/maps/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['maps.show']['types'],
  },
  'maps.update': {
    methods: ["PUT"],
    pattern: '/maps/:id',
    tokens: [{"old":"/maps/:id","type":0,"val":"maps","end":""},{"old":"/maps/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['maps.update']['types'],
  },
  'maps.destroy': {
    methods: ["DELETE"],
    pattern: '/maps/:id',
    tokens: [{"old":"/maps/:id","type":0,"val":"maps","end":""},{"old":"/maps/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['maps.destroy']['types'],
  },
  'maps.messages.fromServant': {
    methods: ["PUT"],
    pattern: '/maps/:id/messages/from-servant',
    tokens: [{"old":"/maps/:id/messages/from-servant","type":0,"val":"maps","end":""},{"old":"/maps/:id/messages/from-servant","type":1,"val":"id","end":""},{"old":"/maps/:id/messages/from-servant","type":0,"val":"messages","end":""},{"old":"/maps/:id/messages/from-servant","type":0,"val":"from-servant","end":""}],
    types: placeholder as Registry['maps.messages.fromServant']['types'],
  },
  'maps.messages.deleteFromServant': {
    methods: ["DELETE"],
    pattern: '/maps/:id/messages/from-servant',
    tokens: [{"old":"/maps/:id/messages/from-servant","type":0,"val":"maps","end":""},{"old":"/maps/:id/messages/from-servant","type":1,"val":"id","end":""},{"old":"/maps/:id/messages/from-servant","type":0,"val":"messages","end":""},{"old":"/maps/:id/messages/from-servant","type":0,"val":"from-servant","end":""}],
    types: placeholder as Registry['maps.messages.deleteFromServant']['types'],
  },
  'maps.messages.deleteToServant': {
    methods: ["DELETE"],
    pattern: '/maps/:id/messages/to-servant',
    tokens: [{"old":"/maps/:id/messages/to-servant","type":0,"val":"maps","end":""},{"old":"/maps/:id/messages/to-servant","type":1,"val":"id","end":""},{"old":"/maps/:id/messages/to-servant","type":0,"val":"messages","end":""},{"old":"/maps/:id/messages/to-servant","type":0,"val":"to-servant","end":""}],
    types: placeholder as Registry['maps.messages.deleteToServant']['types'],
  },
  'maps.activity.store': {
    methods: ["POST"],
    pattern: '/maps/:id/activity',
    tokens: [{"old":"/maps/:id/activity","type":0,"val":"maps","end":""},{"old":"/maps/:id/activity","type":1,"val":"id","end":""},{"old":"/maps/:id/activity","type":0,"val":"activity","end":""}],
    types: placeholder as Registry['maps.activity.store']['types'],
  },
  'maps.activity.update': {
    methods: ["PUT"],
    pattern: '/maps/:id/activity/:activityId',
    tokens: [{"old":"/maps/:id/activity/:activityId","type":0,"val":"maps","end":""},{"old":"/maps/:id/activity/:activityId","type":1,"val":"id","end":""},{"old":"/maps/:id/activity/:activityId","type":0,"val":"activity","end":""},{"old":"/maps/:id/activity/:activityId","type":1,"val":"activityId","end":""}],
    types: placeholder as Registry['maps.activity.update']['types'],
  },
  'maps.activity.destroy': {
    methods: ["DELETE"],
    pattern: '/maps/:id/activity/:activityId',
    tokens: [{"old":"/maps/:id/activity/:activityId","type":0,"val":"maps","end":""},{"old":"/maps/:id/activity/:activityId","type":1,"val":"id","end":""},{"old":"/maps/:id/activity/:activityId","type":0,"val":"activity","end":""},{"old":"/maps/:id/activity/:activityId","type":1,"val":"activityId","end":""}],
    types: placeholder as Registry['maps.activity.destroy']['types'],
  },
  'maps.dnc.store': {
    methods: ["POST"],
    pattern: '/maps/:id/dnc',
    tokens: [{"old":"/maps/:id/dnc","type":0,"val":"maps","end":""},{"old":"/maps/:id/dnc","type":1,"val":"id","end":""},{"old":"/maps/:id/dnc","type":0,"val":"dnc","end":""}],
    types: placeholder as Registry['maps.dnc.store']['types'],
  },
  'maps.dnc.update': {
    methods: ["PUT"],
    pattern: '/maps/:id/dnc/:dncId',
    tokens: [{"old":"/maps/:id/dnc/:dncId","type":0,"val":"maps","end":""},{"old":"/maps/:id/dnc/:dncId","type":1,"val":"id","end":""},{"old":"/maps/:id/dnc/:dncId","type":0,"val":"dnc","end":""},{"old":"/maps/:id/dnc/:dncId","type":1,"val":"dncId","end":""}],
    types: placeholder as Registry['maps.dnc.update']['types'],
  },
  'maps.dnc.destroy': {
    methods: ["DELETE"],
    pattern: '/maps/:id/dnc/:dncId',
    tokens: [{"old":"/maps/:id/dnc/:dncId","type":0,"val":"maps","end":""},{"old":"/maps/:id/dnc/:dncId","type":1,"val":"id","end":""},{"old":"/maps/:id/dnc/:dncId","type":0,"val":"dnc","end":""},{"old":"/maps/:id/dnc/:dncId","type":1,"val":"dncId","end":""}],
    types: placeholder as Registry['maps.dnc.destroy']['types'],
  },
  'maps.street.store': {
    methods: ["POST"],
    pattern: '/maps/:id/street',
    tokens: [{"old":"/maps/:id/street","type":0,"val":"maps","end":""},{"old":"/maps/:id/street","type":1,"val":"id","end":""},{"old":"/maps/:id/street","type":0,"val":"street","end":""}],
    types: placeholder as Registry['maps.street.store']['types'],
  },
  'maps.street.update': {
    methods: ["PUT"],
    pattern: '/maps/:id/street/:streetId',
    tokens: [{"old":"/maps/:id/street/:streetId","type":0,"val":"maps","end":""},{"old":"/maps/:id/street/:streetId","type":1,"val":"id","end":""},{"old":"/maps/:id/street/:streetId","type":0,"val":"street","end":""},{"old":"/maps/:id/street/:streetId","type":1,"val":"streetId","end":""}],
    types: placeholder as Registry['maps.street.update']['types'],
  },
  'maps.street.destroy': {
    methods: ["DELETE"],
    pattern: '/maps/:id/street/:streetId',
    tokens: [{"old":"/maps/:id/street/:streetId","type":0,"val":"maps","end":""},{"old":"/maps/:id/street/:streetId","type":1,"val":"id","end":""},{"old":"/maps/:id/street/:streetId","type":0,"val":"street","end":""},{"old":"/maps/:id/street/:streetId","type":1,"val":"streetId","end":""}],
    types: placeholder as Registry['maps.street.destroy']['types'],
  },
  'maps.street.toggleComplete': {
    methods: ["PUT"],
    pattern: '/maps/:id/street/:streetId/toggle-complete',
    tokens: [{"old":"/maps/:id/street/:streetId/toggle-complete","type":0,"val":"maps","end":""},{"old":"/maps/:id/street/:streetId/toggle-complete","type":1,"val":"id","end":""},{"old":"/maps/:id/street/:streetId/toggle-complete","type":0,"val":"street","end":""},{"old":"/maps/:id/street/:streetId/toggle-complete","type":1,"val":"streetId","end":""},{"old":"/maps/:id/street/:streetId/toggle-complete","type":0,"val":"toggle-complete","end":""}],
    types: placeholder as Registry['maps.street.toggleComplete']['types'],
  },
  'maps.rural.store': {
    methods: ["POST"],
    pattern: '/maps/:id/rural',
    tokens: [{"old":"/maps/:id/rural","type":0,"val":"maps","end":""},{"old":"/maps/:id/rural","type":1,"val":"id","end":""},{"old":"/maps/:id/rural","type":0,"val":"rural","end":""}],
    types: placeholder as Registry['maps.rural.store']['types'],
  },
  'maps.rural.update': {
    methods: ["PUT"],
    pattern: '/maps/:id/rural/:ruralId',
    tokens: [{"old":"/maps/:id/rural/:ruralId","type":0,"val":"maps","end":""},{"old":"/maps/:id/rural/:ruralId","type":1,"val":"id","end":""},{"old":"/maps/:id/rural/:ruralId","type":0,"val":"rural","end":""},{"old":"/maps/:id/rural/:ruralId","type":1,"val":"ruralId","end":""}],
    types: placeholder as Registry['maps.rural.update']['types'],
  },
  'maps.rural.destroy': {
    methods: ["DELETE"],
    pattern: '/maps/:id/rural/:ruralId',
    tokens: [{"old":"/maps/:id/rural/:ruralId","type":0,"val":"maps","end":""},{"old":"/maps/:id/rural/:ruralId","type":1,"val":"id","end":""},{"old":"/maps/:id/rural/:ruralId","type":0,"val":"rural","end":""},{"old":"/maps/:id/rural/:ruralId","type":1,"val":"ruralId","end":""}],
    types: placeholder as Registry['maps.rural.destroy']['types'],
  },
  'maps.rural.toggleComplete': {
    methods: ["PUT"],
    pattern: '/maps/:id/rural/:ruralId/toggle-complete',
    tokens: [{"old":"/maps/:id/rural/:ruralId/toggle-complete","type":0,"val":"maps","end":""},{"old":"/maps/:id/rural/:ruralId/toggle-complete","type":1,"val":"id","end":""},{"old":"/maps/:id/rural/:ruralId/toggle-complete","type":0,"val":"rural","end":""},{"old":"/maps/:id/rural/:ruralId/toggle-complete","type":1,"val":"ruralId","end":""},{"old":"/maps/:id/rural/:ruralId/toggle-complete","type":0,"val":"toggle-complete","end":""}],
    types: placeholder as Registry['maps.rural.toggleComplete']['types'],
  },
  'documents.index': {
    methods: ["GET","HEAD"],
    pattern: '/documents',
    tokens: [{"old":"/documents","type":0,"val":"documents","end":""}],
    types: placeholder as Registry['documents.index']['types'],
  },
  'documents.export.s13': {
    methods: ["GET","HEAD"],
    pattern: '/documents/export/s-13',
    tokens: [{"old":"/documents/export/s-13","type":0,"val":"documents","end":""},{"old":"/documents/export/s-13","type":0,"val":"export","end":""},{"old":"/documents/export/s-13","type":0,"val":"s-13","end":""}],
    types: placeholder as Registry['documents.export.s13']['types'],
  },
  'documents.export.s12': {
    methods: ["GET","HEAD"],
    pattern: '/documents/export/s-12/:id',
    tokens: [{"old":"/documents/export/s-12/:id","type":0,"val":"documents","end":""},{"old":"/documents/export/s-12/:id","type":0,"val":"export","end":""},{"old":"/documents/export/s-12/:id","type":0,"val":"s-12","end":""},{"old":"/documents/export/s-12/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['documents.export.s12']['types'],
  },
  'documents.export.dncWorksheet': {
    methods: ["GET","HEAD"],
    pattern: '/documents/export/dnc-worksheet',
    tokens: [{"old":"/documents/export/dnc-worksheet","type":0,"val":"documents","end":""},{"old":"/documents/export/dnc-worksheet","type":0,"val":"export","end":""},{"old":"/documents/export/dnc-worksheet","type":0,"val":"dnc-worksheet","end":""}],
    types: placeholder as Registry['documents.export.dncWorksheet']['types'],
  },
  'documents.records.deleteNonCompliant': {
    methods: ["POST"],
    pattern: '/documents/records/delete-non-compliant',
    tokens: [{"old":"/documents/records/delete-non-compliant","type":0,"val":"documents","end":""},{"old":"/documents/records/delete-non-compliant","type":0,"val":"records","end":""},{"old":"/documents/records/delete-non-compliant","type":0,"val":"delete-non-compliant","end":""}],
    types: placeholder as Registry['documents.records.deleteNonCompliant']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
  'settings.updateShareMessage': {
    methods: ["PUT"],
    pattern: '/settings/share-message',
    tokens: [{"old":"/settings/share-message","type":0,"val":"settings","end":""},{"old":"/settings/share-message","type":0,"val":"share-message","end":""}],
    types: placeholder as Registry['settings.updateShareMessage']['types'],
  },
  'settings.updateConfirmationMessage': {
    methods: ["PUT"],
    pattern: '/settings/confirmation-message',
    tokens: [{"old":"/settings/confirmation-message","type":0,"val":"settings","end":""},{"old":"/settings/confirmation-message","type":0,"val":"confirmation-message","end":""}],
    types: placeholder as Registry['settings.updateConfirmationMessage']['types'],
  },
  'settings.addMapType': {
    methods: ["POST"],
    pattern: '/settings/map-types',
    tokens: [{"old":"/settings/map-types","type":0,"val":"settings","end":""},{"old":"/settings/map-types","type":0,"val":"map-types","end":""}],
    types: placeholder as Registry['settings.addMapType']['types'],
  },
  'settings.deleteMapType': {
    methods: ["DELETE"],
    pattern: '/settings/map-types/:id',
    tokens: [{"old":"/settings/map-types/:id","type":0,"val":"settings","end":""},{"old":"/settings/map-types/:id","type":0,"val":"map-types","end":""},{"old":"/settings/map-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['settings.deleteMapType']['types'],
  },
  'settings.addStreetCategory': {
    methods: ["POST"],
    pattern: '/settings/street-categories',
    tokens: [{"old":"/settings/street-categories","type":0,"val":"settings","end":""},{"old":"/settings/street-categories","type":0,"val":"street-categories","end":""}],
    types: placeholder as Registry['settings.addStreetCategory']['types'],
  },
  'settings.deleteStreetCategory': {
    methods: ["DELETE"],
    pattern: '/settings/street-categories/:id',
    tokens: [{"old":"/settings/street-categories/:id","type":0,"val":"settings","end":""},{"old":"/settings/street-categories/:id","type":0,"val":"street-categories","end":""},{"old":"/settings/street-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['settings.deleteStreetCategory']['types'],
  },
  'settings.rollSecurityToken': {
    methods: ["POST"],
    pattern: '/settings/roll-security-token',
    tokens: [{"old":"/settings/roll-security-token","type":0,"val":"settings","end":""},{"old":"/settings/roll-security-token","type":0,"val":"roll-security-token","end":""}],
    types: placeholder as Registry['settings.rollSecurityToken']['types'],
  },
  'go.index': {
    methods: ["GET","HEAD"],
    pattern: '/go',
    tokens: [{"old":"/go","type":0,"val":"go","end":""}],
    types: placeholder as Registry['go.index']['types'],
  },
  'public.map': {
    methods: ["GET","HEAD"],
    pattern: '/view/map/:id',
    tokens: [{"old":"/view/map/:id","type":0,"val":"view","end":""},{"old":"/view/map/:id","type":0,"val":"map","end":""},{"old":"/view/map/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['public.map']['types'],
  },
  'public.map.messages.toServant': {
    methods: ["PUT"],
    pattern: '/view/map/:id/messages/to-servant',
    tokens: [{"old":"/view/map/:id/messages/to-servant","type":0,"val":"view","end":""},{"old":"/view/map/:id/messages/to-servant","type":0,"val":"map","end":""},{"old":"/view/map/:id/messages/to-servant","type":1,"val":"id","end":""},{"old":"/view/map/:id/messages/to-servant","type":0,"val":"messages","end":""},{"old":"/view/map/:id/messages/to-servant","type":0,"val":"to-servant","end":""}],
    types: placeholder as Registry['public.map.messages.toServant']['types'],
  },
  'public.map.street.toggleComplete': {
    methods: ["PUT"],
    pattern: '/view/map/:id/street/:streetId/toggle-complete',
    tokens: [{"old":"/view/map/:id/street/:streetId/toggle-complete","type":0,"val":"view","end":""},{"old":"/view/map/:id/street/:streetId/toggle-complete","type":0,"val":"map","end":""},{"old":"/view/map/:id/street/:streetId/toggle-complete","type":1,"val":"id","end":""},{"old":"/view/map/:id/street/:streetId/toggle-complete","type":0,"val":"street","end":""},{"old":"/view/map/:id/street/:streetId/toggle-complete","type":1,"val":"streetId","end":""},{"old":"/view/map/:id/street/:streetId/toggle-complete","type":0,"val":"toggle-complete","end":""}],
    types: placeholder as Registry['public.map.street.toggleComplete']['types'],
  },
  'public.map.rural.toggleComplete': {
    methods: ["PUT"],
    pattern: '/view/map/:id/rural/:ruralId/toggle-complete',
    tokens: [{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":0,"val":"view","end":""},{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":0,"val":"map","end":""},{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":1,"val":"id","end":""},{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":0,"val":"rural","end":""},{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":1,"val":"ruralId","end":""},{"old":"/view/map/:id/rural/:ruralId/toggle-complete","type":0,"val":"toggle-complete","end":""}],
    types: placeholder as Registry['public.map.rural.toggleComplete']['types'],
  },
  'pdf.renderTemplate': {
    methods: ["GET","HEAD"],
    pattern: '/api/pdf/:template/:jobId',
    tokens: [{"old":"/api/pdf/:template/:jobId","type":0,"val":"api","end":""},{"old":"/api/pdf/:template/:jobId","type":0,"val":"pdf","end":""},{"old":"/api/pdf/:template/:jobId","type":1,"val":"template","end":""},{"old":"/api/pdf/:template/:jobId","type":1,"val":"jobId","end":""}],
    types: placeholder as Registry['pdf.renderTemplate']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}

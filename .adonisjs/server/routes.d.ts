import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'healthcheck': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'working_note.store': { paramsTuple?: []; params?: {} }
    'working_note.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'working_note.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'search.index': { paramsTuple?: []; params?: {} }
    'maps.index': { paramsTuple?: []; params?: {} }
    'maps.store': { paramsTuple?: []; params?: {} }
    'maps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.fromServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.deleteFromServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.deleteToServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.activity.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.activity.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'activityId': ParamValue} }
    'maps.activity.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'activityId': ParamValue} }
    'maps.dnc.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.dnc.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'dncId': ParamValue} }
    'maps.dnc.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'dncId': ParamValue} }
    'maps.street.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.street.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.street.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.street.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.rural.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.rural.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'maps.rural.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'maps.rural.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.export.s13': { paramsTuple?: []; params?: {} }
    'documents.export.s12': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.export.dncWorksheet': { paramsTuple?: []; params?: {} }
    'documents.records.deleteNonCompliant': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'settings.updateShareMessage': { paramsTuple?: []; params?: {} }
    'settings.updateConfirmationMessage': { paramsTuple?: []; params?: {} }
    'settings.addMapType': { paramsTuple?: []; params?: {} }
    'settings.deleteMapType': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.addStreetCategory': { paramsTuple?: []; params?: {} }
    'settings.deleteStreetCategory': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.rollSecurityToken': { paramsTuple?: []; params?: {} }
    'go.index': { paramsTuple?: []; params?: {} }
    'public.map': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public.map.messages.toServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public.map.street.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'public.map.rural.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'pdf.renderTemplate': { paramsTuple: [ParamValue,ParamValue]; params: {'template': ParamValue,'jobId': ParamValue} }
  }
  GET: {
    'healthcheck': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'search.index': { paramsTuple?: []; params?: {} }
    'maps.index': { paramsTuple?: []; params?: {} }
    'maps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.export.s13': { paramsTuple?: []; params?: {} }
    'documents.export.s12': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.export.dncWorksheet': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'go.index': { paramsTuple?: []; params?: {} }
    'public.map': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pdf.renderTemplate': { paramsTuple: [ParamValue,ParamValue]; params: {'template': ParamValue,'jobId': ParamValue} }
  }
  HEAD: {
    'healthcheck': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'search.index': { paramsTuple?: []; params?: {} }
    'maps.index': { paramsTuple?: []; params?: {} }
    'maps.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.index': { paramsTuple?: []; params?: {} }
    'documents.export.s13': { paramsTuple?: []; params?: {} }
    'documents.export.s12': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.export.dncWorksheet': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'go.index': { paramsTuple?: []; params?: {} }
    'public.map': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pdf.renderTemplate': { paramsTuple: [ParamValue,ParamValue]; params: {'template': ParamValue,'jobId': ParamValue} }
  }
  POST: {
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'working_note.store': { paramsTuple?: []; params?: {} }
    'maps.store': { paramsTuple?: []; params?: {} }
    'maps.activity.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.dnc.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.street.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.rural.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'documents.records.deleteNonCompliant': { paramsTuple?: []; params?: {} }
    'settings.addMapType': { paramsTuple?: []; params?: {} }
    'settings.addStreetCategory': { paramsTuple?: []; params?: {} }
    'settings.rollSecurityToken': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'working_note.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.fromServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.activity.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'activityId': ParamValue} }
    'maps.dnc.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'dncId': ParamValue} }
    'maps.street.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.street.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.rural.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'maps.rural.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'settings.updateShareMessage': { paramsTuple?: []; params?: {} }
    'settings.updateConfirmationMessage': { paramsTuple?: []; params?: {} }
    'public.map.messages.toServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'public.map.street.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'public.map.rural.toggleComplete': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
  }
  DELETE: {
    'working_note.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.deleteFromServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.messages.deleteToServant': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'maps.activity.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'activityId': ParamValue} }
    'maps.dnc.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'dncId': ParamValue} }
    'maps.street.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'streetId': ParamValue} }
    'maps.rural.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'ruralId': ParamValue} }
    'settings.deleteMapType': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.deleteStreetCategory': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
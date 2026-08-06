/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  healthcheck: typeof routes['healthcheck']
  login: {
    show: typeof routes['login.show']
    store: typeof routes['login.store']
  }
  logout: typeof routes['logout']
  dashboard: {
    index: typeof routes['dashboard.index']
  }
  workingNote: {
    store: typeof routes['working_note.store']
    update: typeof routes['working_note.update']
    destroy: typeof routes['working_note.destroy']
  }
  search: {
    index: typeof routes['search.index']
  }
  maps: {
    index: typeof routes['maps.index']
    store: typeof routes['maps.store']
    show: typeof routes['maps.show']
    update: typeof routes['maps.update']
    destroy: typeof routes['maps.destroy']
    messages: {
      fromServant: typeof routes['maps.messages.fromServant']
      deleteFromServant: typeof routes['maps.messages.deleteFromServant']
      deleteToServant: typeof routes['maps.messages.deleteToServant']
    }
    activity: {
      store: typeof routes['maps.activity.store']
      update: typeof routes['maps.activity.update']
      destroy: typeof routes['maps.activity.destroy']
    }
    dnc: {
      store: typeof routes['maps.dnc.store']
      update: typeof routes['maps.dnc.update']
      destroy: typeof routes['maps.dnc.destroy']
    }
    street: {
      store: typeof routes['maps.street.store']
      update: typeof routes['maps.street.update']
      destroy: typeof routes['maps.street.destroy']
      toggleComplete: typeof routes['maps.street.toggleComplete']
    }
    rural: {
      store: typeof routes['maps.rural.store']
      update: typeof routes['maps.rural.update']
      destroy: typeof routes['maps.rural.destroy']
      toggleComplete: typeof routes['maps.rural.toggleComplete']
    }
  }
  documents: {
    index: typeof routes['documents.index']
    export: {
      s13: typeof routes['documents.export.s13']
      s12: typeof routes['documents.export.s12']
      dncWorksheet: typeof routes['documents.export.dncWorksheet']
    }
    records: {
      deleteNonCompliant: typeof routes['documents.records.deleteNonCompliant']
    }
  }
  settings: {
    index: typeof routes['settings.index']
    updateShareMessage: typeof routes['settings.updateShareMessage']
    updateConfirmationMessage: typeof routes['settings.updateConfirmationMessage']
    addMapType: typeof routes['settings.addMapType']
    deleteMapType: typeof routes['settings.deleteMapType']
    addStreetCategory: typeof routes['settings.addStreetCategory']
    deleteStreetCategory: typeof routes['settings.deleteStreetCategory']
    rollSecurityToken: typeof routes['settings.rollSecurityToken']
  }
  go: {
    index: typeof routes['go.index']
  }
  public: {
    map: typeof routes['public.map'] & {
      messages: {
        toServant: typeof routes['public.map.messages.toServant']
      }
      street: {
        toggleComplete: typeof routes['public.map.street.toggleComplete']
      }
      rural: {
        toggleComplete: typeof routes['public.map.rural.toggleComplete']
      }
    }
  }
  pdf: {
    renderTemplate: typeof routes['pdf.renderTemplate']
  }
}

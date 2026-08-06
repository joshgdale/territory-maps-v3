import '@adonisjs/inertia/types'
import type {
  Activity,
  BasicMap,
  DoNotCall,
  MapFilters,
  MapListItem,
  MapSummary,
  MapType,
  MapTypeWithCanDelete,
  NextMapToHandOut,
  RecordsManagement,
  SettingsCongregation,
  StreetCategory,
  StreetCategoryWithCanDelete,
  WhatsNewItem,
  WorkingNote,
} from '../../inertia/lib/types.js'

/**
 * Explicit Inertia page props (JSON-serializable).
 * Auto ExtractProps from React page modules resolves to `never` when pages
 * attach a `.layout` helper, so we maintain this registry by hand.
 */
declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': {}
    'dashboard/index': {
      workingNotes: WorkingNote[]
      overdueMaps: Activity[]
      mapsWithMessages: MapSummary[]
      nextMapsToHandOut: NextMapToHandOut[]
      whatsNew: WhatsNewItem[]
    }
    'documents/index': {
      canDownload: boolean
      currentServiceYear: string
      previousServiceYear: string
      maps: BasicMap[]
      recordsManagement: RecordsManagement
    }
    'errors/not_found': {}
    'errors/server_error': {}
    'maps/index': {
      maps: MapListItem[]
      mapTypes: MapType[]
      filters: MapFilters
    }
    'maps/show': {
      map: MapSummary
      imageUrl: string | null
      mapTypes: MapType[]
      streetCategories: StreetCategory[]
      isOverdue: boolean
      shareableLink: string
      shareMessage: string
    }
    'public/map': {
      map: MapSummary | null
      imageUrl: string | null
      token: string
    }
    'search/index': {
      query: string
      mapResults: MapSummary[]
      dncResults: DoNotCall[]
    }
    'settings/index': {
      congregation: SettingsCongregation
      mapTypes: MapTypeWithCanDelete[]
      streetCategories: StreetCategoryWithCanDelete[]
    }
  }
}

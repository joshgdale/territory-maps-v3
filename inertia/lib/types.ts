export type WorkingNoteColour = 'GRAY' | 'YELLOW' | 'GREEN' | 'ORANGE' | 'BLUE' | 'PURPLE' | 'PINK'

export type ActivityStatus = 'IN' | 'OUT'

export interface CongregationUser {
  number: string
  name: string
}

export interface MapType {
  id: string
  name: string
  congregationNumber?: string
}

export interface MapTypeWithCanDelete extends MapType {
  canDelete: boolean
  maps?: { id: string }[]
}

export interface StreetCategory {
  id: string
  name: string
  congregationNumber?: string
}

export interface StreetCategoryWithCanDelete extends StreetCategory {
  canDelete: boolean
  streets?: { id: string }[]
}

export interface Activity {
  id: string
  mapId: string
  status: ActivityStatus
  publisher: string
  outDate: string
  inDate: string | null
  notes: string | null
  map?: MapSummary
}

export interface DoNotCall {
  id: string
  mapId: string
  address: string
  lastCalled: string
}

export interface Street {
  id: string
  mapId: string
  name: string
  isComplete: boolean
  categories?: StreetCategory[]
}

export interface Rural {
  id: string
  mapId: string
  latitude: number
  longitude: number
  what3words: string
  description: string
  isComplete: boolean
}

export interface MapSummary {
  id: string
  code: string
  name: string
  imageName?: string
  messageFromServant?: string
  messageToServant?: string
  typeId?: string
  congregationNumber?: string
  type?: MapType
  congregation?: { name: string; number?: string }
  activities?: Activity[]
  doNotCalls?: DoNotCall[]
  streets?: Street[]
  rurals?: Rural[]
}

export interface WorkingNote {
  id: string
  content: string
  colour: WorkingNoteColour
  lastUpdated: string
  congregationNumber: string
  formattedContent?: string
}

export interface WhatsNewItem {
  id: string
  content: string
  addedAt: string
}

export interface MapListItem extends MapSummary {
  isOverdue?: boolean
}

export interface MapFilters {
  sort: string
  type?: string
  status?: string
}

export interface BasicMap {
  id: string
  name: string
  code: string
}

export interface RecordsManagement {
  recordCount: number
  mapCount: number
  maps: BasicMap[]
}

export interface NextMapToHandOut extends BasicMap {
  lastInDate: string | null
}

export interface SettingsCongregation {
  number: string
  name: string
  shareMessage: string
  broughtBackConfirmationMessage: string
  securityToken: string
}

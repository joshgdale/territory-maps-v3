import type { WorkingNoteColour } from '~/lib/types'

export const WORKING_NOTE_COLOUR_CLASS: Record<WorkingNoteColour, string> = {
  GRAY: 'bg-gray-200',
  YELLOW: 'bg-[#FFFABE]',
  GREEN: 'bg-[#DCF2CA]',
  ORANGE: 'bg-[#FFDDC5]',
  BLUE: 'bg-[#CBEBFF]',
  PURPLE: 'bg-[#E0D3F0]',
  PINK: 'bg-[#FBCBDD]',
}

export const WORKING_NOTE_COLOURS: WorkingNoteColour[] = [
  'GRAY',
  'YELLOW',
  'GREEN',
  'ORANGE',
  'BLUE',
  'PURPLE',
  'PINK',
]

export const WORKING_NOTE_COLOUR_OPTIONS = WORKING_NOTE_COLOURS.map((colour) => ({
  option: colour,
}))

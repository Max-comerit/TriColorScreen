export interface TextEntry {
  text: string
  fontFamily: string
  fontWeight: number | string
  isItalic: boolean
  color: string
}

export interface SideTextInfo {
  side: string
  texts: TextEntry[]
}

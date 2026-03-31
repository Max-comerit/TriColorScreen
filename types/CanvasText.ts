export interface TextEntry {
  text: string
  fontFamily: string
  fontWeight: number | string
  color: string
}

export interface SideTextInfo {
  side: string
  texts: TextEntry[]
}

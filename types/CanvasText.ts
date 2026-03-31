export interface TextEntry {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number | string
  color: string
  textAlign: string
  textRadius: number
}

export interface SideTextInfo {
  side: string
  texts: TextEntry[]
}

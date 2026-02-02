/**
 * Graphic Production Services Data
 *
 * Hardcoded services for graphic production category
 */

interface IGraphicProductionService {
  title: string
  description: string
  imageSrc: string
  alt: string
}

export const graphicProductionServices: IGraphicProductionService[] = [
  {
    title: 'Logotyper',
    description: 'Har ni en idé eller ingen aning hur er logo ska se ut – Lugn! vi hjälper er.',
    imageSrc: '',
    alt: 'Logotyper',
  },
  {
    title: 'Broschyrer / Folders / Affischer',
    description: 'Har ni en Logotyp och vill ha en folder med info kring ert företag? En affisch med info kring ett event?',
    imageSrc: '',
    alt: 'Broschyrer / Folders / Affischer',
  },
  {
    title: 'Skyltar / Rollups / Banderoller',
    description: 'Vi hjälper er att få till den där  alldeles speciella skylten för ert företag eller en kreativ rollup för  mässan!',
    imageSrc: '',
    alt: 'Skyltar / Rollups / Banderoller',
  },
  {
    title: 'Visitkort / Kuvert / Presentationsmaterial / Menyer',
    description: 'Vi har hjälp många  företag med all sorters Grafisk produktion inom alla element, har ni  frågor?',
    imageSrc: '',
    alt: 'Visitkort / Kuvert / Presentationsmaterial / Menyer',
  },
]

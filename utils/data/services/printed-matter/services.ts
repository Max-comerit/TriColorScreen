/**
 * Printed Matter Services Data
 *
 * Hardcoded services for printed matter category
 */

interface IPrintedMatterService {
  title: string
  description: string
  imageSrc: string
  alt: string
}

export const printedMatterServices: IPrintedMatterService[] = [
  {
    title: 'Kuvert',
    description: 'Kuvert för alla ändamål. Stick ut i mottagarens brevskörd med tryck på dina kuvert. Med fantasins hjälp är möjligheterna oändliga.',
    imageSrc: '',
    alt: 'Kuvert',
  },
  {
    title: 'Foldrar',
    description: 'Vi har lång erfarenhet av att trycka foldrar och vägleder er gärna till en säljande och attraktiv slutprodukt. Levereras vikta och färdiga i  kartong. Reda att börja göra nytta för er direkt.',
    imageSrc: '',
    alt: 'Foldrar',
  },
  {
    title: 'Broschyrer',
    description: 'När ni har lite mer att säga. Det är inte för inte som broschyren är en klassiker. Där står allt vad kunden behöver veta och snyggt presenterat är det också.',
    imageSrc: '',
    alt: 'Broschyrer',
  },
]

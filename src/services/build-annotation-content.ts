import { AnnotationItem } from '../interfaces'

export const buildAnnotationContent = (annotation: AnnotationItem): string => {
  const text = annotation.annotationText.trim()
  const pageLabel = annotation.annotationPageLabel?.trim()
  if (!text || !pageLabel) return text
  return `${text} (pp ${pageLabel})`
}

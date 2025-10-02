import { pad } from '../utils/array'
import { getString } from '../macros/types'
import { Feature } from './class'
import { parseMarkdownTable } from '../utils/stringOutput'

export const joinFeatures = (...features: string[][][]) =>
  features.reduce((acc, cur) =>
    acc.map((levelFeatures, i) => [...levelFeatures, ...cur[i]])
  )

export const parseFeatures = (featuresMarkdown: string = ""): Feature[] => {

  const features = parseMarkdownTable(featuresMarkdown)
    .filter(([level]) => !isNaN(parseInt(level)))
    .map(([level, name, description]): Feature => ({ level: parseInt(level), name, description }))

  return features
}

export const parseFeaturesList = (featuresMarkdown: string) => {
  const featuresArray = parseMarkdownTable(getString(featuresMarkdown) ?? '')
    .map(
      ([level, features]) =>
        [parseInt(level), features.split(',').map(f => f.trim())] as const
    )
    .reduce<string[][]>((acc, [level, features]) => {
      acc[level - 1] ??= []
      acc[level - 1] = [...acc[level - 1], ...features]
      return acc
    }, [])

  return pad(featuresArray, 20, [])
}

export const parseMultiFeatures = (multiFeaturesMarkdown: string) => {
  const featuresArray = parseMarkdownTable(multiFeaturesMarkdown, true).map(
    row => row.slice(1)
  )

  if (featuresArray.every(row => row.length === 1 && row[0] === ''))
    return pad([], 21, [])
  return pad(featuresArray, 21, [])
}

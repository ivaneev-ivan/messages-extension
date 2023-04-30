export interface IKeyArray {
  ru: string
  eng: string
}

export const nextKey: IKeyArray[] = [
  { eng: "a", ru: "ф" },
  { eng: "b", ru: "и" },
  { eng: "c", ru: "с" },
  { eng: "g", ru: "п" },
  { eng: "h", ru: "р" },
  { eng: "i", ru: "ш" },
  { eng: "j", ru: "о" },
  { eng: "k", ru: "л" },
  { eng: "l", ru: "д" },
  { eng: "m", ru: "ь" },
  { eng: "n", ru: "т" },
  { eng: "o", ru: "щ" },
  { eng: "p", ru: "з" },
  { eng: "q", ru: "й" },
  { eng: "s", ru: "ы" },
  { eng: "t", ru: "е" },
  { eng: "u", ru: "г" },
  { eng: "v", ru: "м" },
  { eng: "w", ru: "ц" },
  { eng: "x", ru: "ч" },
  { eng: "y", ru: "н" },
]

export const translKeys = {
  olga: "ольга",
  sch: "щ",
  ch: "ч",
  sh: "ш",

  yu: "ю",
  ya: "я",
  yo: "ё",
  zh: "ж",
  kh: "х",
  eh: "э",

  jo: "ё",
  ly: "ли",
  a: "а",
  b: "б",
  v: "в",
  g: "г",

  d: "д",
  e: "е",
  z: "з",
  i: "и",
  j: "й",
  k: "к",
  l: "л",

  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  t: "т",

  u: "у",
  f: "ф",
  h: "х",
  c: "ц",
  "“": "ъ",
  "‘": "ь",
  q: "?",

  w: "в",
  x: "х",
  y: "у",
}

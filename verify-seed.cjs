const fs = require('fs')
const seed = fs.readFileSync('src/db/seed.ts', 'utf8')
const md = fs.readFileSync('docs/RGAA.md', 'utf8')

const seedIds = [...seed.matchAll(/id: '(\d+\.\d+)'/g)].map((m) => m[1])
const seedOrders = [...seed.matchAll(/sortOrder: (\d+)/g)].map((m) => +m[1])
const mdIds = [...md.matchAll(/^## (\d+\.\d+) /gm)].map((m) => m[1])

const setSeed = new Set(seedIds)
const setMd = new Set(mdIds)
const missing = mdIds.filter((id) => !setSeed.has(id))
const extra = seedIds.filter((id) => !setMd.has(id))
const dupSeed = seedIds.filter((id, i) => seedIds.indexOf(id) !== i)

console.log('seed ids:', seedIds.length, '| md criteria (## X.Y):', mdIds.length)
console.log('missing (in RGAA.md, absent from seed):', missing)
console.log('extra (in seed, absent from RGAA.md):', extra)
console.log('duplicate ids in seed:', dupSeed)
const orderOk =
    seedOrders.length === 106 && seedOrders.every((v, i) => v === i + 1)
console.log('sortOrder 1..106 contiguous & in order:', orderOk)

// Cross-check each seed title against the matching ## heading in RGAA.md
const mdTitles = {}
for (const m of md.matchAll(/^## (\d+\.\d+) (.+)$/gm)) mdTitles[m[1]] = m[2].trim()
const titleMismatches = []
for (const m of seed.matchAll(/id: '(\d+\.\d+)',[\s\S]*?title:\s*\n?\s*'([^']*)'/g)) {
    const id = m[1]
    const t = m[2]
    if (mdTitles[id] && mdTitles[id] !== t) titleMismatches.push({ id, seed: t, md: mdTitles[id] })
}
console.log('title mismatches vs RGAA.md:', titleMismatches.length)
for (const mm of titleMismatches.slice(0, 10)) console.log('  -', mm.id, '\n     seed:', mm.seed, '\n     md  :', mm.md)

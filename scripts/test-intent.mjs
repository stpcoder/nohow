import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const source = await readFile(new URL('../extension/intent-engine.js', import.meta.url), 'utf8')
const context = { globalThis: {} }
vm.runInNewContext(source, context)
const { infer } = context.globalThis.YogimanIntent

const trace = (labels) => labels.map((label, index) => ({
  id: String(index), label, group: '가상 포털', at: index,
}))

assert.equal(infer(trace(['복지 포인트', '제휴 복지몰']))?.ready, false)
const withdrawal = infer(trace(['복지 포인트', '제휴 복지몰', '회원관리']))
assert.equal(withdrawal?.id, 'withdraw')
assert.equal(withdrawal?.ready, true)
assert.equal(withdrawal?.evidence.length, 3)

const reservation = infer(trace(['예약·시설', '회의실 예약', '일정']))
assert.equal(reservation?.id, 'reserve')
assert.equal(reservation?.ready, true)

assert.equal(infer(trace(['공지사항', '도움말'])), null)
console.log('Recent menu × work map tests passed.')

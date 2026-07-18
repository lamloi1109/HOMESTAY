# Vibecoding Workflow 2026 — Phiên bản Karpathy-style cho Agent-first Stack

> **Triết lý:** Bạn không "chat với AI" nữa. Bạn **viết spec, thiết kế guardrail, và kiểm duyệt kết quả**. Agents tự đọc file, chạy test, preview browser, commit code.

---

## I. Mô hình "The Forge" (Lò Rèn) — Thay thế Hourglass

Hourglass cũ giả định dữ liệu chảy tuyến tính: search → filter → think → execute → archive.
Trong agent-first stack, dữ liệu chảy theo **vòng lặp** và nhiều nhánh chạy **song song**.

```
                    ┌─────────────────────────────────┐
                    │       QUARRY (Mỏ đá)            │
                    │  Thu thập nguyên liệu thô       │
                    │                                 │
                    │  • Claude.ai + Web Search       │
                    │  • NotebookLM (ingest docs)     │
                    │  • Google Stitch (UI concepts)  │
                    └───────────────┬─────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │       ANVIL (Đe)                │
                    │  Rèn thành kế hoạch              │
                    │                                 │
                    │  • NotebookLM → Source of Truth │
                    │  • Claude.ai / CC Plan Mode     │
                    │    → PRD + Task breakdown       │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ ANTIGRAVITY  │ │ CLAUDE CODE  │ │    STITCH    │
            │  (song song) │ │  (deep work) │ │   (UI gen)   │
            │              │ │              │ │              │
            │ UI/frontend  │ │ Backend      │ │ Mockup →     │
            │ Browser test │ │ Refactor     │ │ React/HTML   │
            │ Multi-agent  │ │ CLI/scripts  │ │              │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   └────────────────┼────────────────┘
                                    ▼
                    ┌─────────────────────────────────┐
                    │    TEMPERING (Tôi luyện)        │
                    │  Verify + Archive + Feedback    │
                    │                                 │
                    │  • Antigravity browser verify   │
                    │  • /docs trong repo (CodeWiki)  │
                    │  • NotebookLM update (learnings)│
                    └─────────────────────────────────┘
                                    │
                                    └──── vòng lặp ────┐
                                                       │
                                                       ▼
                                                  (project tiếp)
```

---

## II. Vai trò từng tool (phân công rõ ràng)

| Tool | Dùng khi | KHÔNG dùng khi | Pro tip |
|---|---|---|---|
| **Claude.ai (web/desktop)** | Deep research, viết PRD, bàn kiến trúc cao level | Khi cần đọc/sửa file thật | Bật web search cho research |
| **NotebookLM** | Nén 5-20 nguồn thành 1 knowledge base, nghe Audio Overview để catch lỗ hổng | Làm coder/executor | Dùng Audio Overview như QA pass |
| **Google Stitch** | Cần mockup UI nhanh, có code React/HTML export | Design phức tạp cần identity rõ | Feed output Stitch vào Antigravity như starting point |
| **Antigravity Pro** | UI work, browser verification cần, multi-agent parallel exploration | Task đơn luồng thuần backend | Bật nhiều agent chạy 3-4 approach song song |
| **Claude Code Pro (Plan Mode)** | Bàn kiến trúc với AI đã đọc code base thật | Muốn execute ngay | Plan xong mới exit plan mode |
| **Claude Code Pro (Execute)** | Refactor lớn, backend, CLI tools, script automation | UI visual work | Commit nhỏ, `--continue` để giữ context |

**Luật vàng:** Một task — một tool. Đừng để Antigravity và Claude Code cùng sờ vào một file cùng lúc. Merge conflict là cách chắc nhất để phá workflow.

---

## III. Quy trình 5 bước (Step-by-Step)

### Bước 1: Quarry — Gom dữ liệu thô

**Làm:**
1. Mở **Claude.ai** với web search bật
2. Dùng **Prompt #1 (Research Scanner)** hoặc **#2 (Technical Audit)** tùy task
3. Lưu output ra file `.md` → drop vào **NotebookLM**
4. Nếu có UI: mở **Google Stitch**, dùng **Prompt #6 (Stitch Brief)**

**Checkpoint:** NotebookLM có ≥3 source, Stitch có ≥2 mockup variant. Thiếu thì đừng sang bước 2.

---

### Bước 2: Anvil — Rèn kế hoạch

**Làm:**
1. Trong **NotebookLM**, hỏi: *"Viết briefing cho kỹ sư thực thi dự án này. Gồm: mục tiêu, constraint, tech stack đề xuất, risk."* → copy ra
2. Mở **Claude.ai** hoặc **Claude Code Plan Mode** (`claude --plan` hoặc gõ "plan this" trong session)
3. Dán briefing + dùng **Prompt #3 (Architect)**
4. Output: một PRD + task breakdown, mỗi task được gán cho Antigravity hoặc Claude Code

**Khi nào dùng Plan Mode của Claude Code thay Claude.ai?**
- Khi project đã có codebase: Plan Mode đọc được file thật, tránh kiến trúc "trên giấy" không khớp thực tế.
- Khi làm greenfield (project mới): Claude.ai đủ, không cần overhead.

**Checkpoint:** Mỗi task trong breakdown phải có: mô tả, file đụng tới, acceptance criteria, verify steps. Thiếu 1 trong 4 là chưa sẵn sàng execute.

---

### Bước 3: Forge — Thực thi song song

Đây là bước khác biệt **lớn nhất** so với workflow cũ. Bạn không còn tuần tự copy-paste nữa.

**Phân luồng:**

**Luồng A — Antigravity Pro (cho UI/frontend/browser task):**
1. Mở Antigravity, tạo workspace mới
2. Cho agent đọc design file từ Stitch (drop file vào chat)
3. Dùng **Prompt #4 (Antigravity Task Spec)**
4. Chạy **nhiều agent song song** với approach khác nhau nếu bạn chưa chắc solution nào tốt
5. Agent tự preview browser, tự verify visual

**Luồng B — Claude Code Pro (cho backend/refactor/script):**
1. `cd` vào repo, gõ `claude`
2. Dùng **Prompt #5 (Claude Code Task Spec)**
3. Yêu cầu commit nhỏ sau mỗi acceptance criterion pass
4. Dùng `/compact` khi context dài, `--continue` khi cần resume

**Luồng C — Google Stitch (bổ sung khi cần UI iteration):**
- Khi Antigravity báo "thiếu component UI X", quay lại Stitch generate, rồi đưa ngược lại Antigravity.

**Checkpoint:** Mỗi luồng phải có git commit độc lập. Không merge cho tới khi cả 3 luồng xong.

---

### Bước 4: Tempering — Verify và hoàn thiện

**Làm:**
1. Trong Antigravity, yêu cầu agent chạy full browser verification
2. Trong Claude Code, chạy test suite: `claude` → *"chạy test và fix mọi failure"*
3. Nếu có mâu thuẫn giữa Antigravity và Claude Code output → **Prompt #7 (Conflict Resolver)** trong Claude.ai

**Checkpoint cuối:** build pass, test xanh, visual review pass. Nếu bất kỳ cái nào fail → quay lại Forge, không skip.

---

### Bước 5: Archive — Đóng gói + feedback loop

**Làm:**
1. Trong Claude Code: *"viết docs cho PR này vào /docs/<feature>.md theo convention repo"*
2. Export file đó → upload vào **NotebookLM** (cùng notebook với briefing ban đầu)
3. Trong NotebookLM, generate **Audio Overview** — nghe khi đi đường về
4. Note lại những điểm 2 AI host trong Audio chỉ ra mà bạn chưa nghĩ tới → đó là QA pass miễn phí

**Long-term payoff:** Sau 10 project, NotebookLM của bạn thành "Second Brain" đã được huấn luyện bằng chính code của bạn.

---

## IV. Bộ 7 Master Prompts

### Prompt #1 — Research Scanner (cho Claude.ai + Web Search)

```markdown
# NHIỆM VỤ: Quét thị trường & tổng hợp dữ liệu

**Chủ đề:** [CHỦ ĐỀ]

**Vai trò:** Bạn là Strategic Analyst. Output của bạn sẽ được nạp vào
NotebookLM làm knowledge base, nên phải chính xác tuyệt đối — không bịa,
không "theo tôi biết".

**Quy trình bắt buộc:**
1. Web search ít nhất 5 lần với các keyword khác nhau.
2. Ưu tiên nguồn: official docs, papers (arxiv), Github issues/PRs,
   HN discussions. Tránh content farm, SEO spam.
3. Thông tin phải trong 6 tháng gần nhất, trừ khi chủ đề là nền tảng.
4. Nếu nguồn mâu thuẫn → ghi rõ mâu thuẫn, không tự hòa giải.

**Format output (Markdown thuần, tôi sẽ nạp nguyên văn vào NotebookLM):**

## 1. Executive Summary (3-5 bullets)
## 2. Deep Dive
   - Bảng so sánh nếu có ≥2 đối tượng
   - Số liệu cụ thể kèm nguồn
## 3. Contrarian View (cộng đồng đang cãi nhau gì?)
## 4. Known Unknowns (câu hỏi chưa có đáp án rõ ràng)
## 5. Sources (URL + 1 dòng mô tả mỗi link)

Bắt đầu.
```

---

### Prompt #2 — Technical Audit (cho Claude.ai + Web Search)

```markdown
# NHIỆM VỤ: Điều tra kỹ thuật chuyên sâu

**Vấn đề:** [VẤN ĐỀ CỤ THỂ]
**Stack hiện tại:** [LIỆT KÊ]
**Đã thử:** [NHỮNG GÌ ĐÃ FAIL]

**Vai trò:** Principal Engineer làm technical audit. Mục tiêu: tìm root
cause và đưa ra giải pháp chạy được, không phải giải pháp "theo lý thuyết".

**Quy trình:**
1. Tìm Github issues tương tự (ưu tiên issue đã close với fix).
2. Tìm StackOverflow answer có score ≥20 trong 12 tháng gần.
3. Kiểm tra official docs của từng thư viện liên quan.
4. Loại giải pháp deprecated (check changelog thư viện).

**Format output:**

## 1. Diagnosis (root cause, không chỉ symptom)
## 2. 3 Solutions (Dễ → Tối ưu)
   - Từng solution kèm: code snippet, tradeoff, effort ước tính
## 3. Technical Caveats (version conflict, breaking change cần tránh)
## 4. Verification Plan (test nào confirm fix đúng)
## 5. Sources (link cụ thể, không "tôi đọc đâu đó")

Bắt đầu.
```

---

### Prompt #3 — Architect / Orchestrator (cho Claude.ai hoặc Claude Code Plan Mode)

```markdown
# VAI TRÒ: Chief Architect cho dự án agent-first

Bạn là kiến trúc sư trưởng. Nhiệm vụ: biến briefing thành kế hoạch thực
thi mà agent (Antigravity, Claude Code) có thể chạy ngay.

## Input
- Briefing từ NotebookLM (tôi paste bên dưới).
- Context repo hiện tại (nếu có, Plan Mode tự đọc).

## Bạn phải output 3 artefacts:

### A. PRD ngắn (1 trang)
- Problem statement
- Success criteria (đo được)
- Non-goals (thứ KHÔNG làm để tránh scope creep)
- Tech stack đề xuất + lý do

### B. Task Breakdown
Mỗi task theo schema:
```
Task ID: T-001
Title: ...
Assigned to: [ANTIGRAVITY | CLAUDE_CODE | STITCH | MANUAL]
Files touched: [list]
Acceptance criteria:
  - [ ] Criterion 1 (đo được)
  - [ ] Criterion 2
Verification:
  - How to prove it works (command, URL, screenshot...)
Depends on: [T-XXX, ...]
Estimated complexity: [S | M | L]
```

### C. Risk Register
3-5 rủi ro lớn nhất + mitigation cụ thể.

## Luật
- KHÔNG tự bịa tech chưa có trong briefing. Nếu thiếu thông tin → hỏi tôi.
- Task nào mơ hồ → break nhỏ hơn, đừng giao cho agent task không verify được.
- Đọc xong briefing, trả lời: "KẾ HOẠCH SẴN SÀNG" trước khi output.

---
**BRIEFING TỪ NOTEBOOKLM:**
[PASTE VÀO ĐÂY]
```

---

### Prompt #4 — Antigravity Task Spec

```markdown
# Task: [T-XXX — Title từ PRD]

## Context
[1-2 đoạn: tại sao task này tồn tại, liên quan gì tới user]

## Design reference
[Link tới Stitch mockup hoặc paste image]

## Acceptance Criteria
- [ ] [Criterion đo được 1]
- [ ] [Criterion 2]
- [ ] Visual match với mockup ≥90%
- [ ] Responsive: mobile (375px), tablet (768px), desktop (1440px)
- [ ] Không console error, không network 4xx/5xx

## Constraint kỹ thuật
- Framework: [ví dụ: React 18 + Tailwind]
- Không thêm dependency mới nếu chưa hỏi tôi
- File đụng tới: [list file]

## Verification steps
1. Chạy dev server
2. Mở browser, test 3 viewport
3. Screenshot từng viewport, attach vào response
4. Chạy lint + build, paste output

## Nếu bạn bí
- Đừng mock data giả rồi coi như xong
- Đừng comment out code lỗi
- Hỏi tôi câu hỏi cụ thể

Start.
```

---

### Prompt #5 — Claude Code Task Spec

```markdown
# Task: [T-XXX — Title]

## Trước khi code
- Đọc [file A, file B, file C] để hiểu convention repo
- Nếu convention không rõ, hỏi tôi trước khi code

## Yêu cầu
[Mô tả ngắn gọn]

## Acceptance Criteria
- [ ] [AC1]
- [ ] Test coverage cho logic mới ≥80%
- [ ] Không break test hiện tại
- [ ] Follow convention repo (xem file đã đọc ở trên)

## Verification
- Chạy: `[test command]`
- Output phải: [expected]

## Commit plan
Commit nhỏ, 1 commit per AC. Message format: "[type]: [what]"

## Nếu stuck
- Không monkey-patch
- Không swallow exception ("except: pass")
- Hỏi tôi rõ ràng: "Tôi stuck ở X vì Y, có 2 hướng Z1/Z2, anh chọn?"

Start. Confirm "UNDERSTOOD" trước khi đụng file.
```

---

### Prompt #6 — Google Stitch Design Brief

```markdown
# UI Brief: [Screen/Component name]

## Target user
[1 dòng: ai dùng, trong hoàn cảnh nào]

## User job
[Họ vào screen này để làm gì? Tối đa 3 jobs, ưu tiên 1]

## Must-have elements
- [Element 1 + lý do]
- [Element 2]

## Style direction
- Mood: [ví dụ: "minimal, Linear-esque, dark mode default"]
- Typography: [sans/serif/mono mix]
- Color palette: [hex codes hoặc brand reference]
- Density: [cozy / compact / spacious]

## Constraint
- Framework target: [React + Tailwind / plain HTML]
- Viewport priority: [mobile-first / desktop-first]

## Không muốn
- [ví dụ: "không dùng modal, không carousel, không gradient màu mè"]

## Deliverable
- 2 variants khác nhau về approach (không phải khác màu)
- Export code React + Tailwind
- List component reusable
```

---

### Prompt #7 — Conflict Resolver (cho Claude.ai khi Antigravity và Claude Code mâu thuẫn)

```markdown
# NHIỆM VỤ: Hòa giải kỹ thuật

Hai agent đã làm cùng một phần, output khác nhau. Tôi cần phán quyết cuối.

## Context gốc (từ PRD)
[PASTE PRD section liên quan]

## Solution từ Antigravity
```
[PASTE code]
```
**Verification Antigravity đã chạy:** [paste output]

## Solution từ Claude Code
```
[PASTE code]
```
**Verification Claude Code đã chạy:** [paste output]

## Yêu cầu phân tích
1. Solution nào đúng spec PRD hơn? (Ref PRD cụ thể)
2. Solution nào maintainable hơn? (Tại sao?)
3. Có solution thứ 3 lai ghép tốt hơn cả 2?
4. Nếu phải chọn 1, chọn cái nào + tại sao?
5. Risk khi chọn cái đó?

KHÔNG trả lời "cả 2 đều tốt, tùy bạn". Tôi cần phán quyết.
```

---

## V. Pro Tips — Những sai lầm đắt giá tôi đã thấy

### 1. "Garbage In, Garbage Out" vẫn đúng, nhưng nhân 10 với agent
Agent có thể chạy 20 phút mà bạn không biết nó đi sai. **Spec mơ hồ = đốt 20 phút + tốn token + có khi hỏng code**. Prompt #3 (Architect) yêu cầu task breakdown chặt chính là để tránh chuyện này.

### 2. Đừng để 2 agent sờ cùng 1 file
Antigravity và Claude Code đều có thể tự commit. Nếu chạy song song trên cùng file → merge hell. **Luật:** 1 file — 1 agent — 1 branch.

### 3. Plan Mode của Claude Code > Claude.ai khi có codebase
Claude.ai viết PRD trên không khí. Claude Code Plan Mode đọc được code → đưa ra plan khớp với reality. Nếu project đã có code, **luôn dùng Plan Mode cho bước Anvil**.

### 4. Audio Overview của NotebookLM là QA miễn phí
Sau khi xong project, nạp docs + code summary vào NotebookLM → generate Audio Overview → nghe khi đi về. Bạn sẽ nghe 2 AI host "tranh luận" về code của bạn. **Mỗi câu họ confused chính là một lỗ hổng thiết kế.** Đây là mẹo Karpathy style — dùng AI làm gương soi chính mình.

### 5. Antigravity multi-agent = A/B test rẻ
Khi không chắc solution nào tốt (ví dụ: state management dùng Zustand hay Jotai), mở 2 agent parallel với 2 approach. Sau 15 phút có 2 implementation thật → so sánh → merge cái tốt hơn. **Nhanh hơn 10x so với bàn lý thuyết.**

### 6. Đừng skip Tempering
Skip verify = debt tích lũy. Mỗi project skip là một project tiếp theo sẽ bug chồng bug. Workflow này chỉ hoạt động nếu **Tempering không thương lượng được**.

---

## VI. Cheatsheet — Khi nào dùng gì?

| Tình huống | Tool ưu tiên |
|---|---|
| "Có tool mới X tên Y vừa ra, tìm hiểu đi" | Claude.ai + web search → Prompt #1 |
| "Code chạy chậm, không biết tại sao" | Claude.ai + web search → Prompt #2 |
| "Cần design UI cho screen Z" | Stitch → Prompt #6 |
| "Có PRD rồi, triển khai" | Claude Code Plan Mode → Prompt #3, rồi split sang Antigravity/CC |
| "Cần mock data hay scaffold nhanh" | Antigravity (multi-agent explore) |
| "Refactor 20 file, đổi API signature" | Claude Code (single-thread deep) |
| "Đã xong, cần viết docs" | Claude Code → upload vào NotebookLM |
| "Ôn lại project cũ trước khi start project mới" | NotebookLM Audio Overview |

---

## VII. Trạng thái hiện tại của bạn (PhuocLoi)

Áp dụng ngay vào CV page đang build trong Antigravity:

1. **Quarry (skip được):** Bạn đã biết mình cần gì cho CV.
2. **Anvil:** Viết 1 PRD nhỏ bằng Prompt #3 trong Claude.ai. 15 phút.
3. **Forge:**
   - Stitch (Prompt #6): gen 2 variant layout CV.
   - Antigravity (Prompt #4): implement variant bạn thích.
4. **Tempering:** Browser verify trên 3 viewport.
5. **Archive:** Deploy xong, drop URL + repo link vào NotebookLM, Audio Overview → nghe xem mình miss gì trong CV content.

Total: 1 buổi tối. Không phải 1 tuần.

---

*End of workflow.*

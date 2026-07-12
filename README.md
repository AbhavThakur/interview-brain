# Interview Brain

Lifetime interview-prep knowledge base. Plain markdown, git-versioned, no vendor lock-in.
Open this folder in VS Code and ask Copilot questions against it — that's the "ask my notes" workflow.

## The system

| Folder                         | What lives here                                      | When you touch it                                 |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------- |
| [00-inbox.md](00-inbox.md)     | Quick capture — raw questions, thoughts              | During/right after every interview                |
| [01-topics/](01-topics/)       | Evergreen tech knowledge (JS, RN, perf)              | Written once, refined forever                     |
| [02-qa-bank/](02-qa-bank/)     | Every question ever asked + your best answer         | After every interview (**the compounding asset**) |
| [03-stories/](03-stories/)     | STAR project stories, reusable across companies      | When you ship something big                       |
| [04-companies/](04-companies/) | Per-interview prep — thin files linking to the above | New file per interview                            |
| [05-resume/](05-resume/)       | Metrics inventory, resume versions                   | When numbers change                               |
| [templates/](templates/)       | Blank templates for the above                        | Copy, don't edit                                  |

## The protocol (this is what makes it work)

**When an interview is scheduled:**

1. Copy `templates/company-prep.md` → `04-companies/<company>-<date>.md`
2. Fill in JD keywords, interviewer research, which stories/topics to lead with
3. Self-quiz from `02-qa-bank/` — read each question heading, answer OUT LOUD, then read the answer

**Within 24h after every interview (non-negotiable):**

1. Dump every question you remember into `00-inbox.md`
2. Move them into `02-qa-bank/<category>.md` with your best answer (including the answer you WISH you'd given)
3. Note what went well/badly in the company file

**Self-quiz format:** every Q&A entry has the question as a `## Q:` heading and the answer below.
Scroll slowly — answer before you peek.

## Rules

- One concept per topic file. Link between files instead of duplicating.
- Answers in your own voice — written the way you'd actually say them.
- Update stale content; never let two versions of the same answer exist.
- Commit after every editing session: `git add -A && git commit -m "notes: <what>"`

## App roadmap (later)

Phase 2: React + Vite + Firebase app on top of this data — searchable Q&A bank,
tag filters, "quiz me" random mode, spaced repetition. The markdown here stays the
source of truth; `## Q:` headings are the parse format. Doubles as a portfolio project.

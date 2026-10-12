-EXECUTIVE SUMMARY
FOLIO — AI SUPPORTED LEARNING APP FOR FIRST YEAR ACCOUNTING STUDENTS
We propose to develop Folio, a mobile-friendly learning app that helps first-year accounting students study, practise, and obtain support when they are stuck. The app will bring lecturer-approved study materials, practice questions, and an AI learning assistant into one place, accessible beyond scheduled class hours.
Students will be able to ask the AI assistant questions about accounting concepts and receive clear explanations based on approved course materials. During practice, the assistant will give hints, help students identify mistakes, and guide them towards a solution. Interactive exercises will allow students to work through journal entries and other foundational accounting tasks, while a personal dashboard will show their progress and suggest topics to revisit.
Lecturers will be able to upload and update materials, create practice questions, and review which concepts students find most difficult. Student accounts will keep learning records private and allow support to be tailored to each learner. The AI assistant will support teaching; lecturers will retain control over course content, answer keys, and the feedback used for assessment.
The proposed first phase is a pilot in one first-year accounting course. It will include student accounts, a materials library, a lecturer-managed question bank, interactive practice, and basic progress reporting. The AI assistant will then be tested against lecturer-reviewed questions and materials before wider use. Student and lecturer feedback, engagement data, and evidence of learning improvement will guide further development.
This project offers a practical way to extend academic support to students who need more time, more practice, or an explanation outside class. It will also give lecturers better information about where students struggle. We seek management’s support to develop and evaluate the pilot, with the aim of building a reliable tool that can later serve additional accounting courses.
First Year Accounting Learning App Guide — Folio
Product requirements and implementation brief | Draft for developer discussion | 25 September 2026
Build a mobile friendly learning platform for first year accounting students. Lecturers must be able to enrol students, publish course materials and practice questions, and identify learning difficulties. Students must be able to learn, attempt accounting problems, receive accurate feedback, and revisit weak concepts. This brief defines the recommended first release, later enhancements, data and security expectations, and the evidence required before launch. University, hosting, and budget decisions remain to be confirmed with the project owner. Product name: **Folio**.
1 Product goals and users
Primary goal: help students practise a concept, understand the precise reason for an error, and know what to study next.
Primary users: first year students; lecturers and teaching assistants; a limited system administrator.
Initial curriculum: ACC101 and ACC102, configured by course, term, topic, learning outcome and difficulty. Content must remain editable by a lecturer.
Design for small phone screens, intermittent connectivity, low data usage and accessible text. A responsive progressive web app is the recommended first delivery; native apps can be assessed after the pilot.
2 Roles and permissions
Role
Permitted actions
Student
View enrolled course content; attempt published questions; use tutor; view own feedback, progress and saved materials.
Lecturer
Manage own course topics; upload, review and publish materials and questions; view course analytics and student submissions subject to access policy.
Teaching assistant
Review flagged submissions and discussions within assigned courses; content publishing only if delegated.
Administrator
Manage accounts, roles, enrolments, course creation, retention settings and audit logs; no routine access to private learning conversations.


3 First release functional requirements
Accounts and courses
Invite or enrol students by course code or controlled CSV import; verify account ownership; allow password reset and course withdrawal. Support institutional single sign on later if available.
Provide a student home page with current topics, suggested practice, recent feedback and progress. Provide lecturer and administrator dashboards with role-based navigation.
Study materials library
Lecturers upload PDF, DOCX, slides, short video links and accessible text summaries; tag each item with course, topic, learning outcome, version, author, source, licence and publication state.
Students search or filter by course and topic, open on a phone, and download approved materials. Log material version so older tutor responses can be traced.
Uploads start unpublished; check file type and size, scan files, limit access by course, and permit replacement or withdrawal without erasing audit history. Do not ingest third-party textbooks into AI features without permission.
Question bank and attempts
Lecturers create questions individually or import a reviewed CSV template. Include type, prompt, topic, difficulty, marks, solution, hints, rationale, common misconceptions, source and publication state.
Support multiple choice, numerical answers and journal entries in release one. Journal entries must accept account, debit or credit and amount, including multi-line entries and more than one valid account label where approved.
Give immediate, specific feedback on account choice, direction and amount. Save attempts and allow a second attempt after a hint. Keep correct answers hidden until the configured reveal point.
Provide topic quizzes, lecturer-set practice sets and untimed personal revision. Show students what they missed and a linked lesson; export course-level analytics.
Tutor behaviour
Default sequence: ask the student to attempt → identify error → offer one targeted hint → ask for a correction → provide a worked explanation on request or after the permitted attempts.
Use the deterministic marking engine as the authority for accounting answers. AI may explain reviewed solutions and retrieved approved materials, but must not invent a mark, journal entry or citation.
If the answer is absent or contradictory in approved content, say so, flag the issue and offer lecturer escalation. Show the material title and page or section when answering from uploaded documents.
Lecturers may preview AI answers and see flagged responses. The assistant must distinguish formative practice from assessed work and follow configurable answer reveal rules.
4 Learning features to add after the pilot
Feature
Student value and prerequisite
Adaptive revision
Schedule fresh problems for weak topics using attempt history; start with transparent rules rather than opaque prediction.
Business simulation
Record transactions for a café or shop, post to ledgers, prepare a trial balance and produce statements across connected stages.
Explain your reasoning
Short written explanation after selected answers; lecturer reviewed rubric and optional AI draft feedback.
Study groups and peer discussion
Course moderated discussion on concepts, with reporting and lecturer escalation; protect individual attempt data.
Accessibility enhancements
Audio explanations, captions and optional local language support after quality review of accounting terms.
Photo of handwritten work
Optional later feature requiring image parsing, manual correction and explicit confidence indication.


5 Key user journeys
Student: sign in → choose enrolled course → open topic and approved material → attempt question → receive component-specific feedback → request hint → retry → view worked explanation → add weak topic to revision.
Lecturer: create topic → upload and tag material → add or import question and model answer → preview as student → publish → review analytics and flagged explanations → revise content with version history.
6 Suggested data model
Entity
Core fields or relations
User and role
user_id, verified identifier, display name, role, status, created_at; role assignments scoped to course.
Course and enrolment
course_id, code, term, owner; enrolment(user_id, course_id, role, status).
Topic and outcome
topic_id, course_id, sequence; outcome_id, topic_id, description.
Material
material_id, topic_id, file reference, type, title, source, licence, version, status, uploader, timestamps.
Question and answer key
question_id, topic_id, type, prompt, difficulty, marks, status; accepted solutions, hints, rationale, misconception tags, version.
Attempt and response
attempt_id, student_id, question_version, response payload, component marks, feedback, hint events, submitted_at.
Tutor interaction
interaction_id, user_id, course_id, retrieved material version and section, prompt, response, flag, timestamp; retention configurable.
Progress and audit
topic mastery summary derived from attempts; immutable logs of enrolment, publication, role and answer-key changes.


Use a relational database for users, courses, content metadata and attempts, plus protected object storage for uploaded files. Apply foreign keys, migrations, routine backups and restoration tests. Store secrets outside source control.
7 Architecture and engineering rules
Frontend: responsive web interface with accessible controls, clear offline or slow-network states, and keyboard support. Backend: documented API with server-side permission checks. Database: managed relational database. File storage: private bucket with controlled downloads.
Keep the grading service separate from the AI explanation service. Validate amounts using decimal arithmetic, configurable rounding and question-specific tolerances; never grade financial values with binary floating point comparisons.
Retrieval pipeline for AI: extract approved text, retain page or section metadata, index per course and version, enforce course access at retrieval, then cite sources in the response. Published material changes trigger re-indexing.
Question imports require schema validation, duplicate detection, preview, and all-or-nothing publication. Keep a staging environment and an automated deployment pipeline. Provide project owner with repository access, technical documentation and administrator instructions.
8 Security privacy and academic integrity
Collect only needed student information. Explain to students what activity is recorded, who sees it, retention period and how to request correction or deletion under the institution’s approved policy. Obtain institutional review for any research use of identifiable learning data.
Use secure authentication, hashed passwords or managed identity, encrypted transport, least-privilege access, backups, audit logs, rate limits and monitoring. Verify every course-level permission on the server.
Prevent prompt injection through uploaded documents: treat retrieved content as data, never instructions; restrict file types; log and review unsafe or unsupported answers. Do not expose other students’ records to the tutor.
Separate practice and summative assessment modes. Provide configurable answer release, attempt limits and question variants; do not present AI-generated feedback as an official grade unless approved.
9 Delivery phases and acceptance tests
Phase
Deliverable and approval test
0 Discovery and design
Confirm course outline, user counts, hosting, budget, data policy and sample content. Produce clickable screens, schema, API outline and 20–30 lecturer-reviewed pilot questions.
1 Working pilot
Accounts, enrolment, material upload and publication, question bank, journal-entry marking, student progress and lecturer analytics. Demonstrate complete student and lecturer journeys on a phone.
2 Grounded tutor
Hint-first explanations tied to reviewed answer keys and approved materials; display source section; test with a lecturer-approved set of correct, incorrect, ambiguous and adversarial questions.
3 Classroom evaluation
Pilot in one course, fix usability and marking defects, measure participation and topic-level improvement, gather student and lecturer feedback. Release expansion only after sign-off.


Acceptance examples: (1) a student cannot access another course’s files or attempts; (2) a valid alternative journal entry is accepted when configured; (3) an incorrect debit or credit receives the correct misconception-specific hint; (4) replacing a PDF updates future tutor citations but preserves prior attempt evidence; (5) a lecturer can upload questions, preview them and publish without developer intervention; (6) a tutor says it lacks sufficient evidence when approved content does not answer a question.
10 Decisions for the project owner and developer
Confirm first institution and cohort, approximate number of concurrent users, ACC101/102 topic map and whether students use university email or a course invitation.
Choose institutional or independent ownership, hosting location, approved privacy and retention rules, and whether offline downloads are allowed.
Provide sample notes, five representative question types, marking rules and known acceptable alternative answers; agree on who reviews the question bank and AI responses.
Agree on milestone dates, budget ceiling, source-code ownership, maintenance responsibility and support process. Request a fixed-price estimate for phases 0–1 and a separate estimate for phase 2.

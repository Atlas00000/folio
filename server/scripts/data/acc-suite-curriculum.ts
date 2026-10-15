/**
 * ACC102–ACC110 suite — distinct undergraduate accounting modules.
 * Progression mirrors common degree pathways (managerial → intermediate →
 * cost → tax → audit → AIS → finance → reporting → ethics).
 * Lean: 4 topics each, one summary + 1–2 practice items — not bloated.
 */

import type { Acc101QuestionSeed, Acc101TopicSeed } from './acc101-curriculum';

export type AccCourseSeed = {
  code: string;
  title: string;
  term: string;
  description: string;
  joinCode: string;
  topics: Acc101TopicSeed[];
};

function t(
  sequence: number,
  title: string,
  description: string,
  learningOutcome: string,
  materialTitle: string,
  materialBody: string,
  questions: Acc101QuestionSeed[],
): Acc101TopicSeed {
  return {
    sequence,
    title,
    description,
    learningOutcome,
    materialTitle,
    materialBody,
    questions,
  };
}

function mcq(
  prompt: string,
  correct: 'a' | 'b' | 'c',
  options: [string, string, string],
  hint: string,
  difficulty: 'intro' | 'core' | 'stretch' = 'intro',
): Acc101QuestionSeed {
  return {
    type: 'mcq',
    prompt,
    difficulty,
    marks: '1',
    options: [
      { id: 'a', label: options[0] },
      { id: 'b', label: options[1] },
      { id: 'c', label: options[2] },
    ],
    acceptedSolutions: { mcqCorrectOptionId: correct },
    hints: [hint],
  };
}

function num(
  prompt: string,
  value: string,
  hint: string,
  difficulty: 'intro' | 'core' | 'stretch' = 'intro',
): Acc101QuestionSeed {
  return {
    type: 'numerical',
    prompt,
    difficulty,
    marks: '1',
    acceptedSolutions: { numericalValue: value, numericalTolerance: '0.01' },
    hints: [hint],
  };
}

export const ACC_SUITE: AccCourseSeed[] = [
  {
    code: 'ACC102',
    title: 'Introduction to Managerial Accounting',
    term: '2026-T1',
    joinCode: 'acc102demo',
    description:
      'Internal decision support: cost behaviour, CVP, budgeting, and variance signals for managers — distinct from external financial reporting.',
    topics: [
      t(
        1,
        'Cost classification for decisions',
        'Fixed, variable, mixed, direct, and indirect costs — and why the labels change with the decision.',
        'Classify a cost as fixed or variable for a short-run volume decision.',
        'Cost behaviour — manager’s view',
        'Managerial accounting serves internal users. Variable costs change with activity; fixed costs stay constant in a relevant range. Direct costs trace to a cost object; indirect costs are allocated. The same cost can be direct for one object and indirect for another.',
        [
          mcq(
            'Which cost typically changes in total when production volume rises within the relevant range?',
            'a',
            ['Variable cost', 'Fixed cost', 'Sunk cost'],
            'Think which total rises as more units are made.',
          ),
        ],
      ),
      t(
        2,
        'Cost–volume–profit analysis',
        'Break-even and contribution margin as planning tools.',
        'Compute break-even units given price, variable cost, and fixed cost.',
        'CVP — contribution and break-even',
        'Contribution margin = Sales − Variable costs. Break-even units = Fixed costs ÷ contribution margin per unit. CVP assumes linear costs/revenues in the relevant range and a constant sales mix when multiple products exist.',
        [
          num(
            'Price 40, variable cost 25, fixed costs 7,500. Break-even units?',
            '500.00',
            'Fixed ÷ (price − variable).',
          ),
        ],
      ),
      t(
        3,
        'Budgeting and responsibility',
        'Master budget building blocks and controllable vs uncontrollable items.',
        'Identify which budget typically starts the master-budget sequence for a manufacturer.',
        'Budgets — planning then control',
        'The sales budget usually drives production, purchases, and cash budgets. Responsibility accounting evaluates managers on controllable items. Budgets are plans; variances compare plan to actual for learning, not blame alone.',
        [
          mcq(
            'For a manufacturer, which budget most often comes first in the master budget?',
            'b',
            ['Cash budget', 'Sales budget', 'Direct labour budget'],
            'Volume of sales drives almost everything else.',
          ),
        ],
      ),
      t(
        4,
        'Flexible budgets and variances',
        'Why flexible budgets beat static comparisons when volume changes.',
        'State why a flexible budget is fairer than a static budget when actual volume differs from plan.',
        'Flexible budgets — apples to apples',
        'A static budget is fixed at planned volume. A flexible budget restates variable items at actual volume so volume effects are separated from price/efficiency effects. Sales-volume and flexible-budget variances tell different stories.',
        [
          mcq(
            'A flexible budget primarily adjusts which kind of costs for actual activity?',
            'a',
            ['Variable costs', 'Sunk costs only', 'Equity dividends'],
            'Variable items scale with activity; fixed often stay put in the relevant range.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC103',
    title: 'Intermediate Financial Accounting I',
    term: '2026-T1',
    joinCode: 'acc103demo',
    description:
      'Deepens financial reporting: conceptual framework, revenue, receivables, and inventory measurement beyond ACC101 basics.',
    topics: [
      t(
        1,
        'Conceptual framework and recognition',
        'Qualitative characteristics and when an item enters the statements.',
        'Name the twin fundamental qualitative characteristics of useful financial information.',
        'Framework — relevance and faithful representation',
        'Useful information is relevant and faithfully represented. Enhancing characteristics include comparability, verifiability, timeliness, and understandability. Recognition requires a definition met, measurable reliably enough, and useful to users.',
        [
          mcq(
            'The two fundamental qualitative characteristics are:',
            'b',
            [
              'Timeliness and verifiability',
              'Relevance and faithful representation',
              'Prudence and materiality only',
            ],
            'Enhancing traits support the fundamentals; they are not the fundamentals.',
          ),
        ],
      ),
      t(
        2,
        'Revenue recognition essentials',
        'Performance obligations and recognising revenue when control transfers.',
        'Identify when revenue is typically recognised under a performance-obligation model.',
        'Revenue — control and obligations',
        'Contracts may contain multiple performance obligations. Revenue is recognised when (or as) the entity satisfies an obligation by transferring control of a good or service to the customer — not merely when cash is collected.',
        [
          mcq(
            'Under a performance-obligation model, revenue is recognised when:',
            'c',
            [
              'The order is signed',
              'Cash is always received in full',
              'Control of the promised good or service transfers',
            ],
            'Focus on transfer of control, not cash timing alone.',
          ),
        ],
      ),
      t(
        3,
        'Receivables measurement',
        'Gross vs net receivables and subsequent measurement of expected credit losses.',
        'Compute net realisable value of receivables given gross and allowance.',
        'Receivables — net of allowance',
        'Trade receivables are often presented net of an allowance for expected credit losses. The allowance is a contra-asset. Writing off a specific account against an adequate allowance does not usually hit profit again.',
        [
          num(
            'Gross receivables 50,000. Allowance 3,500. Net receivables?',
            '46500.00',
            'Gross minus allowance.',
          ),
        ],
      ),
      t(
        4,
        'Inventory measurement beyond basics',
        'Lower of cost and net realisable value; why write-downs matter.',
        'State the measurement rule commonly applied when NRV falls below cost.',
        'Inventory — cost and NRV',
        'Inventories are typically measured at the lower of cost and net realisable value. A write-down recognises that expected selling proceeds (net of costs to sell) no longer support cost. Reversals depend on the framework in force.',
        [
          mcq(
            'If NRV is below cost, inventory is usually carried at:',
            'a',
            ['NRV', 'Replacement cost always', 'Original cost forever'],
            'Lower of cost and NRV protects against overstated assets.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC104',
    title: 'Intermediate Financial Accounting II',
    term: '2026-T2',
    joinCode: 'acc104demo',
    description:
      'Liabilities, leases overview, income taxes in the statements, and the statement of cash flows.',
    topics: [
      t(
        1,
        'Current vs non-current liabilities',
        'Classification on the statement of financial position and why it matters to users.',
        'Classify a bank loan due in nine months.',
        'Liability classification',
        'Current liabilities are expected to be settled within the normal operating cycle or twelve months (framework-dependent wording). Classification affects liquidity analysis. Refinancing completed after the reporting date may not reclassify under some standards.',
        [
          mcq(
            'A trade payable due in 60 days is generally:',
            'a',
            ['Current', 'Non-current', 'Equity'],
            'Short settlement horizon → current.',
          ),
        ],
      ),
      t(
        2,
        'Leases — recognition overview',
        'Why many leases bring an asset and liability onto the lessee’s statement of financial position.',
        'Identify the typical lessee balance-sheet effect at lease commencement (right-of-use model).',
        'Leases — ROU asset and liability',
        'Under a right-of-use model, lessees often recognise a right-of-use asset and a lease liability equal to the present value of lease payments (subject to exemptions). Subsequent depreciation and interest replace straight rent expense for many contracts.',
        [
          mcq(
            'At commencement under a right-of-use model, the lessee typically recognises:',
            'b',
            [
              'Only a rent expense note',
              'A right-of-use asset and a lease liability',
              'Share capital',
            ],
            'Both an asset and a liability appear for many leases.',
          ),
        ],
      ),
      t(
        3,
        'Income taxes in financial reporting',
        'Current tax vs deferred tax — timing differences at a conceptual level.',
        'Distinguish current tax expense from deferred tax in one sentence.',
        'Tax — current and deferred',
        'Current tax is tax payable on taxable profit for the period. Deferred tax arises from temporary differences between carrying amounts and tax bases. Accounting profit and taxable profit often diverge in timing.',
        [
          mcq(
            'Deferred tax primarily relates to:',
            'c',
            [
              'Owner drawings',
              'Bank reconciliations only',
              'Temporary differences between carrying amounts and tax bases',
            ],
            'Timing / temporary differences drive deferred tax.',
          ),
        ],
      ),
      t(
        4,
        'Statement of cash flows',
        'Operating, investing, and financing sections; indirect method intuition.',
        'Classify purchase of equipment for cash.',
        'Cash flows — three sections',
        'Operating activities relate to revenue-producing activities. Investing covers long-term assets. Financing covers owners and lenders. The indirect method starts from profit and adjusts for non-cash items and working-capital changes.',
        [
          mcq(
            'Cash paid to acquire equipment is classified as:',
            'b',
            ['Operating', 'Investing', 'Financing'],
            'Long-lived productive assets → investing.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC105',
    title: 'Cost and Management Accounting',
    term: '2026-T2',
    joinCode: 'acc105demo',
    description:
      'Product costing systems: job costing, process costing intuition, overhead, and relevant costs for decisions.',
    topics: [
      t(
        1,
        'Job costing',
        'Tracing and applying costs to distinct jobs or batches.',
        'Identify which cost is usually applied using a predetermined overhead rate in job costing.',
        'Job costing — DM, DL, applied OH',
        'Job costing assigns direct materials and direct labour to jobs, then applies manufacturing overhead using a predetermined rate (e.g. per machine hour). Over/under-applied overhead is cleared at period end.',
        [
          mcq(
            'In job costing, manufacturing overhead is commonly:',
            'b',
            [
              'Traced kilogram-by-kilogram as direct material',
              'Applied using a predetermined rate',
              'Ignored until cash is paid',
            ],
            'OH is indirect — applied, not usually traced unit-by-unit.',
          ),
        ],
      ),
      t(
        2,
        'Process costing intuition',
        'Homogeneous output and equivalent units at a conceptual level.',
        'State when process costing is more suitable than job costing.',
        'Process costing — continuous flow',
        'Process costing suits continuous, homogeneous production (e.g. chemicals, beverages). Equivalent units convert WIP into completed-unit equivalents for costing. Costs are averaged across units.',
        [
          mcq(
            'Process costing fits best when output is:',
            'a',
            [
              'Homogeneous and continuous',
              'Unique custom contracts only',
              'Always a single one-off prototype',
            ],
            'Think oil refining vs custom yacht builds.',
          ),
        ],
      ),
      t(
        3,
        'Overhead rates and drivers',
        'Choosing activity drivers and the risk of distorted product costs.',
        'Explain why a single plant-wide rate can distort product costs.',
        'Drivers — cause and effect',
        'A predetermined OH rate = estimated OH ÷ estimated driver. If products consume resources differently, a single plant-wide rate can overcost simple products and undercost complex ones. Multiple pools improve cause-and-effect.',
        [
          mcq(
            'A single plant-wide overhead rate is most risky when products:',
            'c',
            [
              'Use identical processes and drivers',
              'Have no overhead at all',
              'Consume support resources very differently',
            ],
            'Distortion appears when consumption patterns diverge.',
          ),
        ],
      ),
      t(
        4,
        'Relevant costs for decisions',
        'Ignore sunk costs; focus on incremental cash flows.',
        'Identify a sunk cost in a keep-or-drop decision.',
        'Relevant costs — future and differential',
        'Relevant costs are future cash flows that differ among alternatives. Sunk costs are already incurred and do not change with the decision. Opportunity cost is the benefit forgone from the next-best use of a resource.',
        [
          mcq(
            'Which item is typically irrelevant to a forward-looking keep-or-drop decision?',
            'a',
            [
              'Last year’s non-refundable advertising already spent',
              'Future avoidable supervisor salary',
              'Future contribution margin forgone',
            ],
            'Already-spent, non-recoverable outlays are sunk.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC106',
    title: 'Taxation Fundamentals',
    term: '2026-T2',
    joinCode: 'acc106demo',
    description:
      'Principles of income taxation for individuals and simple businesses: charging structure, allowable deductions, and administration basics (jurisdiction-neutral concepts).',
    topics: [
      t(
        1,
        'Tax base and taxable person',
        'Who is taxed and on what — residence ideas at a principles level.',
        'Distinguish tax evasion from tax avoidance in plain language.',
        'Tax principles — base and behaviour',
        'A tax base is what the law taxes (e.g. income, gains). Tax avoidance uses legal means to reduce tax; tax evasion is illegal concealment or misstatement. Residence and source rules allocate taxing rights between jurisdictions.',
        [
          mcq(
            'Deliberately understating income on a return is:',
            'b',
            ['Tax avoidance', 'Tax evasion', 'A deferred tax asset'],
            'Illegal misstatement → evasion.',
          ),
        ],
      ),
      t(
        2,
        'Employment vs business income concepts',
        'Why employment income and trading profits are computed differently.',
        'Identify which item is more typical of employment income than trading profit.',
        'Schedules — different computation paths',
        'Employment income often focuses on earnings from an office or employment minus limited deductions. Trading profits start from accounting profit with tax adjustments (disallowables, capital vs revenue). Always follow the local statute in practice.',
        [
          mcq(
            'Salary from an employer is typically analysed as:',
            'a',
            ['Employment income', 'Capital gain only', 'Exempt stamp duty'],
            'Salary → employment stream in most systems.',
          ),
        ],
      ),
      t(
        3,
        'Allowable deductions — principles',
        'Wholly and exclusively / ordinary and necessary ideas without jurisdiction trivia.',
        'State the usual test flavour for a trading expense to be deductible.',
        'Deductions — purpose of the spend',
        'Deductible trading expenses are generally those incurred for the purposes of the trade (wording varies by law). Private expenditure and capital expenditure are commonly disallowed for trading-profit computation, with capital often relieved via capital allowances / depreciation tax rules instead.',
        [
          mcq(
            'A purely private holiday paid from the business is generally:',
            'c',
            [
              'Fully allowable trading expense',
              'A capital allowance pool',
              'Disallowed as private expenditure',
            ],
            'Private purpose → usually not a trading deduction.',
          ),
        ],
      ),
      t(
        4,
        'Administration and compliance',
        'Returns, deadlines, and records — why process matters as much as computation.',
        'Name one reason tax authorities require record-keeping.',
        'Compliance — returns and evidence',
        'Taxpayers file returns, pay on account or on assessment, and keep records so figures can be checked. Penalties often attach to late filing, late payment, or careless/deliberate errors. Professional advisers still leave legal responsibility with the taxpayer.',
        [
          mcq(
            'Keeping invoices and bank records primarily supports:',
            'b',
            [
              'Creative accounting only',
              'Substantiating figures on a return',
              'Avoiding double-entry altogether',
            ],
            'Evidence underpins compliance.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC107',
    title: 'Audit and Assurance Principles',
    term: '2026-T2',
    joinCode: 'acc107demo',
    description:
      'Why assurance exists: ethics, risk, evidence, and the auditor’s report — introductory, not a full audit manual.',
    topics: [
      t(
        1,
        'Assurance and the expectation gap',
        'Reasonable assurance is not a guarantee of zero misstatement.',
        'State what “reasonable assurance” means in one phrase.',
        'Assurance — not a guarantee',
        'An audit of financial statements provides reasonable assurance that they are free from material misstatement, whether due to fraud or error. Absolute assurance is unattainable due to judgement, sampling, and inherent limitations. Users sometimes expect more — the expectation gap.',
        [
          mcq(
            'A financial statement audit typically provides:',
            'b',
            ['Absolute assurance', 'Reasonable assurance', 'No assurance'],
            'Reasonable ≠ absolute.',
          ),
        ],
      ),
      t(
        2,
        'Ethics and independence',
        'Threats to objectivity and common safeguards.',
        'Identify a familiarity threat example.',
        'Ethics — threats and safeguards',
        'Core principles include integrity, objectivity, professional competence, confidentiality, and professional behaviour. Independence threats include self-interest, self-review, advocacy, familiarity, and intimidation. Safeguards reduce threats to an acceptable level or require declining/ending the engagement.',
        [
          mcq(
            'Auditing your own firm’s bookkeeping work for the same client is primarily a:',
            'a',
            ['Self-review threat', 'Bank reconciliation', 'Tax base'],
            'Reviewing your own work → self-review.',
          ),
        ],
      ),
      t(
        3,
        'Audit risk model',
        'Inherent, control, and detection risk — planning intuition.',
        'Name the risk the auditor controls most directly through procedures.',
        'Risk — IR × CR × DR',
        'Audit risk is the risk of an inappropriate unmodified opinion when statements are materially misstated. Inherent and control risk exist at the client; detection risk is influenced by the nature, timing, and extent of auditor procedures.',
        [
          mcq(
            'Which risk does the auditor primarily manage through the design of procedures?',
            'c',
            ['Inherent risk', 'Control risk', 'Detection risk'],
            'More/persuasive testing lowers detection risk.',
          ),
        ],
      ),
      t(
        4,
        'Evidence and the auditor’s report',
        'Sufficient appropriate evidence and opinion types at a glance.',
        'Identify what an unmodified opinion communicates.',
        'Evidence to opinion',
        'Evidence must be sufficient (quantity) and appropriate (quality). The unmodified opinion states that statements are prepared, in all material respects, in accordance with the framework. Qualified, adverse, and disclaimer opinions communicate reservations or inability to conclude.',
        [
          mcq(
            'An unmodified audit opinion indicates that, in the auditor’s judgement, the statements are:',
            'a',
            [
              'Fairly presented / properly prepared in all material respects',
              'Guaranteed free of all fraud',
              'Worth investing in',
            ],
            'Material respects — not a fraud-zero or investment tip.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC108',
    title: 'Accounting Information Systems',
    term: '2026-T2',
    joinCode: 'acc108demo',
    description:
      'How transaction cycles, controls, and systems produce reliable accounting data — AIS for accountants.',
    topics: [
      t(
        1,
        'Transaction cycles',
        'Revenue, expenditure, and payroll cycles as control environments.',
        'Name the cycle that typically includes customer order to cash receipt.',
        'Cycles — from event to ledger',
        'AIS organises processing into cycles (revenue, expenditure, production, payroll, financing). Each cycle has documents, records, and controls. Understanding cycles helps auditors and accountants spot where misstatements can enter.',
        [
          mcq(
            'Customer order → shipping → invoicing → cash receipt belongs to the:',
            'a',
            ['Revenue cycle', 'Payroll cycle', 'Financing cycle only'],
            'Order-to-cash is revenue.',
          ),
        ],
      ),
      t(
        2,
        'Control objectives and ITGC',
        'Authorisation, completeness, accuracy — and general IT controls.',
        'Identify a general IT control example.',
        'Controls — process and IT',
        'Application controls operate within a process (e.g. invoice three-way match). General IT controls (access management, change management, backups) underpin system reliability. Weak ITGCs undermine automated application controls.',
        [
          mcq(
            'User access provisioning and periodic access reviews are examples of:',
            'b',
            ['Batch invoice matching only', 'General IT controls', 'Equity valuation'],
            'Access is an IT general control theme.',
          ),
        ],
      ),
      t(
        3,
        'Segregation of duties',
        'Custody, recording, and authorisation — why combining them is risky.',
        'State which combination creates a classic fraud opportunity.',
        'SoD — split the keys',
        'Ideally no one person has custody of assets, records the related transactions, and authorises them. Small entities compensate with owner oversight. ERP roles must be designed so conflicting duties are not granted together.',
        [
          mcq(
            'The highest fraud risk arises when one employee can:',
            'c',
            [
              'Only view reports',
              'Only approve holidays',
              'Authorise, record, and hold custody of the same assets',
            ],
            'All three combined → classic SoD failure.',
          ),
        ],
      ),
      t(
        4,
        'Data integrity and audit trails',
        'Why immutable logs and master-data controls matter to accountants.',
        'Explain one purpose of an audit trail in an AIS.',
        'Trails — who changed what',
        'Audit trails link source events to ledger balances and show who approved changes. Master-data controls (customer credit limits, price lists) prevent garbage-in. Reconciliations remain essential even in automated environments.',
        [
          mcq(
            'An audit trail primarily helps users:',
            'a',
            [
              'Trace transactions from source to statements',
              'Eliminate the need for journals',
              'Set income tax rates',
            ],
            'Traceability is the point.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC109',
    title: 'Corporate Reporting',
    term: '2026-T2',
    joinCode: 'acc109demo',
    description:
      'Group reporting themes: control, consolidation intuition, and presentation/disclosure quality for external users.',
    topics: [
      t(
        1,
        'Control and the group',
        'When one entity consolidates another — control concept.',
        'State the usual basis for including a subsidiary in consolidated statements.',
        'Control — power and returns',
        'Consolidation generally follows control: power over the investee, exposure to variable returns, and ability to affect those returns. Legal share ownership is often aligned with control but is not the sole test under modern frameworks.',
        [
          mcq(
            'A subsidiary is consolidated primarily because the parent has:',
            'b',
            ['A marketing agreement only', 'Control over the investee', 'Identical staff uniforms'],
            'Control drives consolidation.',
          ),
        ],
      ),
      t(
        2,
        'Consolidation — line by line intuition',
        'Add like items; eliminate intragroup equity and balances.',
        'Identify what is eliminated on consolidation regarding intragroup sales of inventory still held.',
        'Consolidation — eliminate internals',
        'Consolidated statements present the group as a single economic entity. Intragroup receivables/payables and unrealised profits in inventory are eliminated so external users see only outsiders’ perspective.',
        [
          mcq(
            'Unrealised profit in closing inventory from intragroup sales is typically:',
            'a',
            [
              'Eliminated from group inventory and profit',
              'Doubled in group revenue',
              'Reported as share capital',
            ],
            'Until sold outside the group, profit is unrealised for the group.',
          ),
        ],
      ),
      t(
        3,
        'Non-controlling interest',
        'Equity that is not attributable to the parent’s owners.',
        'Define non-controlling interest in one sentence.',
        'NCI — other owners in subsidiaries',
        'Non-controlling interest (NCI) is the equity in a subsidiary not attributable to the parent. It appears within equity in the consolidated statement of financial position (presentation can vary by policy/framework detail).',
        [
          mcq(
            'Non-controlling interest represents:',
            'c',
            [
              'Group bank overdrafts',
              'Parent company share capital only',
              'Equity in a subsidiary not owned by the parent',
            ],
            'Other shareholders’ stake in subs.',
          ),
        ],
      ),
      t(
        4,
        'Presentation and disclosure quality',
        'Clear structure, materiality, and notes that explain the numbers.',
        'State why notes are part of a complete set of financial statements.',
        'Disclosure — numbers need context',
        'A complete set of statements includes notes that explain policies and detail. Materiality guides what to present prominently. Boilerplate notes that obscure rather than explain reduce usefulness.',
        [
          mcq(
            'Notes to the financial statements are:',
            'b',
            [
              'Optional marketing copy',
              'An integral part of a complete set of statements',
              'Only for internal managers',
            ],
            'Notes complete the statements for users.',
          ),
        ],
      ),
    ],
  },
  {
    code: 'ACC110',
    title: 'Ethics and Professional Practice',
    term: '2026-T2',
    joinCode: 'acc110demo',
    description:
      'Professional ethics, public interest, and judgement under pressure — for accountants in practice and business.',
    topics: [
      t(
        1,
        'Public interest and the profession',
        'Why accounting is more than a private client service.',
        'Identify who ultimately relies on trustworthy financial reporting.',
        'Public interest — beyond the payer',
        'Professional accountants serve the public interest: investors, creditors, employees, and markets rely on credible information. Client preference does not override integrity or the law.',
        [
          mcq(
            'Acting in the public interest means primarily serving:',
            'a',
            [
              'Broader users of reliable information, not only the fee-payer',
              'Only the highest bidder',
              'Personal social media reach',
            ],
            'Markets and stakeholders depend on trust.',
          ),
        ],
      ),
      t(
        2,
        'Code of ethics — principles',
        'Integrity, objectivity, competence, confidentiality, professional behaviour.',
        'Name the principle breached by knowingly issuing a misleading report.',
        'Five principles — quick map',
        'Integrity: straightforward and honest. Objectivity: no bias or undue influence. Professional competence and due care. Confidentiality: information from professional relationships. Professional behaviour: comply with laws and avoid discrediting the profession.',
        [
          mcq(
            'Knowingly associating with materially false statements primarily breaches:',
            'a',
            ['Integrity', 'Bank reconciliation standards', 'Lease ROU math'],
            'Honesty requires not being linked to false reporting.',
          ),
        ],
      ),
      t(
        3,
        'Pressure, fraud, and speak-up',
        'Responding when asked to manipulate results.',
        'Identify an appropriate first response when pressured to misstate.',
        'Pressure — pause and escalate',
        'Fraud triangle: pressure, opportunity, rationalisation. When pressured to misstate, refuse, document, and escalate through internal channels or professional advice — do not “just this once.” Whistleblowing frameworks exist for a reason.',
        [
          mcq(
            'If a manager asks you to book revenue you know is not earned, you should:',
            'c',
            [
              'Book it to keep peace',
              'Delete the audit trail',
              'Refuse and escalate through appropriate channels',
            ],
            'Do not knowingly misstate.',
          ),
        ],
      ),
      t(
        4,
        'Professional judgement and scepticism',
        'Documented reasoning under uncertainty.',
        'State why professional scepticism matters when evidence is conflicting.',
        'Judgement — question and document',
        'Professional scepticism is an attitude of questioning mind and critical assessment of evidence. Judgement under uncertainty should be documented: alternatives considered, evidence weighed, conclusion reached. Soft numbers still need hard thinking.',
        [
          mcq(
            'Professional scepticism most nearly means:',
            'b',
            [
              'Blind trust in management',
              'A questioning mind and critical assessment of evidence',
              'Never accepting any estimate',
            ],
            'Question and weigh — not cynicism for its own sake.',
          ),
        ],
      ),
    ],
  },
];

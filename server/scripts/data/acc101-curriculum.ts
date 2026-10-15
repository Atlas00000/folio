/**
 * ACC101 Introduction to Financial Accounting — pilot topic spine.
 * Grounded in common first-year FA syllabi (equation → cycle → statements;
 * cash, receivables, inventory, depreciation). Lean: one summary + practice
 * items per topic — not bloated filler.
 */

export type Acc101QuestionSeed = {
  type: 'mcq' | 'numerical' | 'journal';
  prompt: string;
  difficulty: 'intro' | 'core' | 'stretch';
  marks: string;
  options?: { id: string; label: string }[];
  acceptedSolutions: Record<string, unknown>;
  hints: string[];
  misconceptionTags?: string[];
  rationale?: string;
};

export type Acc101TopicSeed = {
  sequence: number;
  title: string;
  description: string;
  learningOutcome: string;
  materialTitle: string;
  materialBody: string;
  questions: Acc101QuestionSeed[];
};

export const ACC101_COURSE = {
  code: 'ACC101',
  title: 'Introduction to Financial Accounting',
  term: '2026-T1',
  description:
    'First-year financial accounting: the accounting equation, double-entry recording, the accounting cycle, and core statement building blocks used in ACC101 / ACC102 pathways.',
};

export const ACC101_TOPICS: Acc101TopicSeed[] = [
  {
    sequence: 1,
    title: 'The accounting equation and double-entry',
    description:
      'Assets = Liabilities + Equity. How every transaction preserves the equation through equal debits and credits.',
    learningOutcome:
      'Explain the accounting equation and record a simple owner-investment using double-entry.',
    materialTitle: 'The accounting equation — lecture summary',
    materialBody: [
      'The accounting equation states that Assets = Liabilities + Equity at every moment.',
      'Double-entry means each transaction is recorded with equal total debits and total credits.',
      'Assets normally increase with debits and decrease with credits.',
      'Liabilities and equity normally increase with credits and decrease with debits.',
      'Example: an owner invests cash — Debit Cash (asset up), Credit Capital (equity up). The equation still balances.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'Which side increases an asset account?',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'Debit' },
          { id: 'b', label: 'Credit' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'a' },
        hints: ['Assets increase on the debit side.'],
        rationale: 'Under double-entry, asset increases are debited.',
      },
      {
        type: 'numerical',
        prompt: 'Cash 200 + Inventory 50. What is total assets?',
        difficulty: 'intro',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '250.00',
          numericalTolerance: '0.01',
        },
        hints: ['Add the asset balances.'],
      },
      {
        type: 'journal',
        prompt: 'Owner invests 500 cash into the business.',
        difficulty: 'intro',
        marks: '2',
        acceptedSolutions: {
          journalLines: [
            { account: 'Cash', direction: 'debit', amount: '500.00' },
            { account: 'Capital', direction: 'credit', amount: '500.00' },
          ],
          alternateAccounts: { Cash: ['Bank', 'Cash at bank'] },
        },
        hints: ['Which asset rises, and which equity account rises?'],
        misconceptionTags: ['debit_credit_swap'],
        rationale: 'Dr Cash 500, Cr Capital 500.',
      },
    ],
  },
  {
    sequence: 2,
    title: 'Journals, ledgers, and the chart of accounts',
    description:
      'From source documents to the general journal, posting to ledger accounts, and reading a chart of accounts.',
    learningOutcome:
      'Describe the recording process and identify where a transaction first enters the books.',
    materialTitle: 'Recording process — journal to ledger',
    materialBody: [
      'Transactions are analysed, then entered in the general journal (chronological).',
      'Each journal line is posted to the relevant ledger account (by account).',
      'The chart of accounts lists every account with its number and type (asset, liability, equity, revenue, expense).',
      'A compound entry has more than two lines but still balances: total debits = total credits.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'Where is a transaction first recorded in chronological order?',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'Trial balance' },
          { id: 'b', label: 'General journal' },
          { id: 'c', label: 'Balance sheet' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'b' },
        hints: ['Think of the book that lists events day by day.'],
        rationale: 'The journal is the book of original entry.',
      },
    ],
  },
  {
    sequence: 3,
    title: 'The trial balance',
    description:
      'Listing debit and credit ledger balances to test arithmetic equality before statements.',
    learningOutcome:
      'State what a trial balance proves — and what it does not prove.',
    materialTitle: 'Trial balance — purpose and limits',
    materialBody: [
      'A trial balance lists each ledger account with its debit or credit balance.',
      'If totals match, debits equal credits in the ledgers — a useful check.',
      'It does not prove that every amount is in the correct account, or that nothing was omitted or entered twice.',
      'Errors can still exist in a balancing trial balance; further review is required before statements.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'A balancing trial balance proves that:',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'Every transaction was posted to the correct account' },
          { id: 'b', label: 'Total debit balances equal total credit balances' },
          { id: 'c', label: 'The business made a profit' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'b' },
        hints: ['It is a mathematical check on equality, not correctness of classification.'],
      },
      {
        type: 'numerical',
        prompt:
          'Ledger debit balances total 18,400. One credit balance of 2,100 was omitted from the trial balance. What credit total is shown before correction?',
        difficulty: 'core',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '16300.00',
          numericalTolerance: '0.01',
        },
        hints: ['Debits still 18,400; credits shown = 18,400 − 2,100.'],
      },
    ],
  },
  {
    sequence: 4,
    title: 'Accrual accounting and the matching concept',
    description:
      'Recognise revenue when earned and expenses when incurred — not only when cash moves.',
    learningOutcome:
      'Distinguish cash-basis timing from accrual timing using a simple example.',
    materialTitle: 'Accrual vs cash timing',
    materialBody: [
      'Under accrual accounting, revenue is recognised when earned and expenses when incurred, matching them to the period they relate to.',
      'Cash accounting records only when cash is received or paid — simpler, but poor for period performance.',
      'Example: services delivered in March, cash in April — March revenue under accrual; April under pure cash basis.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt:
          'Services completed in March; customer pays in April. Under accrual accounting, revenue is recognised in:',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'March' },
          { id: 'b', label: 'April' },
          { id: 'c', label: 'Neither until the invoice is filed' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'a' },
        hints: ['Accrual follows when the work is earned, not when cash arrives.'],
      },
    ],
  },
  {
    sequence: 5,
    title: 'Adjusting entries',
    description:
      'Period-end accruals and deferrals so statements reflect the matching concept.',
    learningOutcome:
      'Identify whether an adjustment is an accrual or a deferral and draft a simple adjusting entry.',
    materialTitle: 'Adjustments — accruals and deferrals',
    materialBody: [
      'Adjusting entries are made at period end so accounts are complete before statements.',
      'Deferrals: cash moved earlier (prepaid expense, unearned revenue) — recognise the portion earned or used.',
      'Accruals: earned or incurred before cash (accrued revenue, accrued expense).',
      'Each adjusting entry touches one income-statement account and one balance-sheet account.',
    ].join(' '),
    questions: [
      {
        type: 'journal',
        prompt:
          'At month-end, 300 of prepaid insurance has expired. Record the adjusting entry.',
        difficulty: 'core',
        marks: '2',
        acceptedSolutions: {
          journalLines: [
            { account: 'Insurance expense', direction: 'debit', amount: '300.00' },
            { account: 'Prepaid insurance', direction: 'credit', amount: '300.00' },
          ],
          alternateAccounts: {
            'Insurance expense': ['Insurance Expense'],
            'Prepaid insurance': ['Prepaid Insurance', 'Prepaid Insurance asset'],
          },
        },
        hints: ['Expense rises; the prepaid asset falls.'],
        misconceptionTags: ['debit_credit_swap'],
        rationale: 'Dr Insurance expense 300, Cr Prepaid insurance 300.',
      },
    ],
  },
  {
    sequence: 6,
    title: 'Completing the accounting cycle',
    description:
      'From adjusted trial balance through financial statements to closing temporary accounts.',
    learningOutcome:
      'Order the main steps from journalising through closing at period end.',
    materialTitle: 'Accounting cycle — end-to-end',
    materialBody: [
      'Typical cycle: analyse → journalise → post → unadjusted trial balance → adjust → adjusted trial balance → statements → close → post-closing trial balance.',
      'Income statement accounts (revenues, expenses) are temporary and are closed to equity (often via Income summary / Retained earnings).',
      'Balance sheet accounts are permanent and carry forward.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'Which accounts are closed at period end?',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'Assets and liabilities' },
          { id: 'b', label: 'Revenues and expenses' },
          { id: 'c', label: 'Only cash' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'b' },
        hints: ['Temporary accounts measure period performance.'],
      },
    ],
  },
  {
    sequence: 7,
    title: 'Cash and bank reconciliations',
    description:
      'Why the cash book and bank statement differ, and how a bank reconciliation ties them.',
    learningOutcome:
      'Explain outstanding cheques and deposits in transit in a reconciliation.',
    materialTitle: 'Bank reconciliation — core ideas',
    materialBody: [
      'The cash ledger and the bank statement often differ in timing: deposits in transit, outstanding cheques, bank charges, direct deposits.',
      'A bank reconciliation starts from one balance and adjusts for known timing items to agree to the other.',
      'Bank charges and errors may require journal entries in the books; outstanding items usually do not until they clear.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'A cheque written by the business not yet cleared by the bank is:',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'A deposit in transit' },
          { id: 'b', label: 'An outstanding cheque' },
          { id: 'c', label: 'A bank error favouring the business' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'b' },
        hints: ['The books already recorded the payment; the bank has not.'],
      },
      {
        type: 'numerical',
        prompt:
          'Bank statement balance 4,050. Deposits in transit 500. Outstanding cheques 350. No other differences. What is the reconciled cash balance?',
        difficulty: 'core',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '4200.00',
          numericalTolerance: '0.01',
        },
        hints: ['Statement + deposits in transit − outstanding cheques.'],
        rationale: '4,050 + 500 − 350 = 4,200.',
      },
    ],
  },
  {
    sequence: 8,
    title: 'Trade receivables and doubtful debts',
    description:
      'Recording credit sales and estimating amounts that may not be collected.',
    learningOutcome:
      'Record an allowance for doubtful debts using a simple percentage of receivables.',
    materialTitle: 'Receivables and the allowance',
    materialBody: [
      'Trade receivables arise when goods or services are sold on credit.',
      'Prudence / faithful representation: estimate amounts unlikely to be collected via an allowance (contra-asset), rather than waiting for every default.',
      'Expense (impairment / bad debt expense) is matched to the period of sale where possible.',
    ].join(' '),
    questions: [
      {
        type: 'numerical',
        prompt:
          'Receivables are 20,000. Allowance required is 5%. What allowance balance is required?',
        difficulty: 'intro',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '1000.00',
          numericalTolerance: '0.01',
        },
        hints: ['5% of 20,000.'],
      },
      {
        type: 'journal',
        prompt:
          'Year-end: increase the allowance for doubtful debts by 400. Record the adjusting entry.',
        difficulty: 'core',
        marks: '2',
        acceptedSolutions: {
          journalLines: [
            {
              account: 'Bad debts expense',
              direction: 'debit',
              amount: '400.00',
            },
            {
              account: 'Allowance for doubtful debts',
              direction: 'credit',
              amount: '400.00',
            },
          ],
          alternateAccounts: {
            'Bad debts expense': [
              'Impairment loss on receivables',
              'Doubtful debts expense',
              'Bad debt expense',
            ],
            'Allowance for doubtful debts': [
              'Allowance for doubtful accounts',
              'Provision for doubtful debts',
            ],
          },
        },
        hints: ['Expense debited; contra-asset allowance credited.'],
      },
    ],
  },
  {
    sequence: 9,
    title: 'Inventory and cost of sales',
    description:
      'Merchandising: purchases, cost of sales, and why inventory valuation affects profit.',
    learningOutcome:
      'Compute cost of sales from opening inventory, purchases, and closing inventory.',
    materialTitle: 'Inventory and cost of sales',
    materialBody: [
      'For a merchandiser, Cost of sales = Opening inventory + Purchases − Closing inventory (periodic view).',
      'Closing inventory remains an asset on the statement of financial position.',
      'Valuation methods (FIFO, weighted average, and in some frameworks LIFO) change which costs remain in inventory vs cost of sales — and therefore profit.',
    ].join(' '),
    questions: [
      {
        type: 'numerical',
        prompt:
          'Opening inventory 1,200. Purchases 4,800. Closing inventory 900. What is cost of sales?',
        difficulty: 'intro',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '5100.00',
          numericalTolerance: '0.01',
        },
        hints: ['Opening + purchases − closing.'],
      },
    ],
  },
  {
    sequence: 10,
    title: 'Non-current assets and depreciation',
    description:
      'Capitalise long-lived assets and allocate cost over useful life (straight-line focus).',
    learningOutcome:
      'Compute straight-line depreciation for a period given cost, residual value, and life.',
    materialTitle: 'Depreciation — straight-line',
    materialBody: [
      'Non-current assets such as equipment are capitalised, not expensed in full on purchase (if they meet recognition criteria).',
      'Depreciation allocates depreciable amount (cost − residual value) over useful life.',
      'Straight-line: equal expense each period. Accumulated depreciation is a contra-asset.',
    ].join(' '),
    questions: [
      {
        type: 'numerical',
        prompt:
          'Equipment cost 12,000. Residual value 2,000. Useful life 5 years. Annual straight-line depreciation?',
        difficulty: 'intro',
        marks: '1',
        acceptedSolutions: {
          numericalValue: '2000.00',
          numericalTolerance: '0.01',
        },
        hints: ['(Cost − residual) ÷ life.'],
      },
      {
        type: 'journal',
        prompt: 'Record one year of straight-line depreciation of 2,000 on equipment.',
        difficulty: 'core',
        marks: '2',
        acceptedSolutions: {
          journalLines: [
            { account: 'Depreciation expense', direction: 'debit', amount: '2000.00' },
            {
              account: 'Accumulated depreciation',
              direction: 'credit',
              amount: '2000.00',
            },
          ],
          alternateAccounts: {
            'Depreciation expense': ['Depreciation Expense — Equipment'],
            'Accumulated depreciation': [
              'Accumulated depreciation — Equipment',
              'Accumulated Depreciation',
            ],
          },
        },
        hints: ['Expense debit; contra-asset credit.'],
      },
    ],
  },
  {
    sequence: 11,
    title: 'Introducing the financial statements',
    description:
      'How the income statement, statement of financial position, and equity movements fit together.',
    learningOutcome:
      'Place profit, assets, and equity on the correct primary statement.',
    materialTitle: 'The primary statements — map',
    materialBody: [
      'Income statement (P&L): revenues and expenses for the period → profit or loss.',
      'Statement of financial position (balance sheet): assets, liabilities, and equity at a date; Assets = Liabilities + Equity.',
      'Profit increases equity; drawings or dividends decrease equity.',
      'Cash flow statement explains cash movements — introduced later in more depth.',
    ].join(' '),
    questions: [
      {
        type: 'mcq',
        prompt: 'Profit for the period primarily appears as an increase in:',
        difficulty: 'intro',
        marks: '1',
        options: [
          { id: 'a', label: 'Liabilities' },
          { id: 'b', label: 'Equity' },
          { id: 'c', label: 'Unearned revenue only' },
        ],
        acceptedSolutions: { mcqCorrectOptionId: 'b' },
        hints: ['Owners’ claim grows when the business earns a profit.'],
      },
    ],
  },
];

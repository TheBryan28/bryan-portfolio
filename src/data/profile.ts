// Single source of truth for the portfolio: the modern view, the retro desktop
// and the AI assistant all read from here. Keep it in sync with the resume PDF.

export interface Link {
  label: string;
  url: string;
}

export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface Role {
  title: string;
  company: string;
  companyNote?: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: { label: string; text: string; link?: Link }[];
}

export interface Project {
  name: string;
  kind: string;
  year: string;
  pitch: string;
  summary: string;
  stack: string[];
  links: Link[];
}

export interface Credential {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export const profile = {
  name: 'Bryan Cruz',
  fullName: 'Bryan Santiago Cruz Angel',
  title: 'Full-Stack AI Engineer',
  focus: ['Generative AI', 'Cloud and integrations', 'Full stack'],
  location: 'Ibagué, Colombia (UTC-5)',
  availability: 'Open to remote roles and relocation',
  email: 'bryan_sca386@outlook.com',
  resumeUrl: '/Bryan_Cruz_Resume.pdf',
  links: {
    linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bryancruzdev/' },
    github: { label: 'GitHub', url: 'https://github.com/TheBryan28' },
  },
  summary:
    'Full-stack engineer with five years of experience, certified by Google Cloud as an Associate Cloud Engineer and Generative AI Leader. I lead the generative AI plugins at Open LMS, a Moodle-based learning platform with more than 1,000 client organizations and 10 million users in over 120 countries. I design and ship AI features from start to finish: LLM and RAG pipelines across OpenAI, Anthropic, Gemini and Amazon Bedrock, REST and GraphQL integrations, React and Angular interfaces, and the cloud infrastructure and CI/CD that keep them reliable.',
  languages: ['Spanish (native)', 'English (C1, EF SET)', 'Portuguese (basic)'],

  metrics: [
    { value: '649', label: 'production sites', detail: 'run Nova, the AI course generator' },
    { value: '666', label: 'production sites', detail: 'run tiny_ai_assistant in the course editor' },
    { value: '11 → 3', label: 'high-priority issues', detail: 'customer-reported Snap issues, year after the refactor' },
    { value: '300+', label: 'tests repaired', detail: 'Behat and PHPUnit, CI/CD back to green' },
  ] as Metric[],

  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'PHP', 'Java', 'Python', 'SQL'] },
    { group: 'Front end', items: ['React', 'Next.js', 'Angular', 'Tailwind CSS'] },
    { group: 'Back end and APIs', items: ['Node.js', 'Spring Boot', 'Spring Cloud', 'REST', 'GraphQL', 'Moodle plugins'] },
    { group: 'AI', items: ['OpenAI', 'Anthropic', 'Gemini', 'Amazon Bedrock', 'Vertex AI', 'Azure AI Foundry', 'RAG', 'LangChain', 'Pinecone', 'FAISS', 'n8n', 'Flowise'] },
    { group: 'Cloud and DevOps', items: ['Google Cloud', 'AWS', 'Docker', 'Kubernetes', 'GitLab CI/CD', 'Jenkins'] },
    { group: 'Data', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
    { group: 'Testing and security', items: ['PHPUnit', 'Behat', 'Jest', 'Cypress', 'CWE analysis', 'Burp Suite'] },
  ],

  experience: [
    {
      title: 'Full-Stack Software Engineer, Generative AI',
      company: 'Open LMS',
      companyNote: 'General Atlantic portfolio company',
      location: 'Remote, United States',
      start: 'Feb. 2025',
      end: 'Present',
      summary: 'I lead the generative AI plugins: course generation, content tools, the shared AI layer and the CI/CD around them.',
      highlights: [
        { label: 'AI platform', text: 'Lead the architecture of the generative AI features. Co-built the internal AI layer that serves every AI plugin through one interface with interchangeable providers: OpenAI, Anthropic, Gemini and DeepSeek.' },
        { label: 'Nova Course Generator', text: 'Shipped the plugin, now live on 649 production sites, that turns a topic or a set of uploaded files into a complete Moodle course in about five minutes. The instructor approves an AI-drafted outline, then background tasks build each section with content, images, forums, assignments and quizzes.' },
        { label: 'AI content tools', text: 'Architected and shipped tiny_ai_assistant, the AI content creator inside the Moodle editor, now live on 666 production sites, and a question generator that builds question banks from uploaded files.', link: { label: 'Open LMS announcement', url: 'https://www.openlms.net/blog/news/introducing-ai-assisted-content-creation/' } },
        { label: 'Snap theme', text: 'Led the refactor of the open-source Snap theme onto Moodle’s reactive components and Boost behavior. In the year after it began in July 2025, customer-reported issues fell to 43 from 57, and high-priority ones to three from 11.', link: { label: 'Snap contributions on GitHub', url: 'https://github.com/open-lms-open-source/moodle-theme_snap/commits?author=TheBryanOpen228' } },
        { label: 'Test and pipeline health', text: 'Repaired more than 300 Behat and PHPUnit tests to bring GitLab CI/CD back to green. Built AI commands for the team’s internal TypeScript and Node.js CLI that triage Behat failures and post line-level code reviews on merge requests.' },
        { label: 'AI developer tooling', text: 'Built the team’s Claude Code plugin: 12 skills that take a developer from a Jira ticket to a merged Moodle release, with an approval gate before any code changes.' },
        { label: 'Platform upgrades', text: 'Merge each new Moodle release into the product and reset the sandbox site fleets with Jenkins. Carried the AI plugins through the Moodle 5.0 question bank redesign.' },
      ],
    },
    {
      title: 'Associate Software Engineer',
      company: 'Learning Technologies Group',
      location: 'Remote, United Kingdom',
      start: 'March 2022',
      end: 'Feb. 2025',
      summary: 'Refactored enterprise Moodle plugins and tuned the MySQL behind high-traffic sites.',
      highlights: [
        { label: 'Enterprise plugins', text: 'Refactored enterprise plugins such as Personalized Learning Designer, building new plugins and web services and splitting complex interfaces into modular, reusable components.' },
        { label: 'Performance', text: 'Diagnosed performance problems on high-traffic sites and tuned the MySQL queries behind them.' },
      ],
    },
    {
      title: 'Web and Automation Consultant (part-time)',
      company: 'Freelance',
      location: 'Colombia',
      start: 'June 2021',
      end: 'Aug. 2023',
      summary: 'Built online stores and AI content automations for small businesses, from scope to launch.',
      highlights: [
        { label: 'Client delivery', text: 'Worked directly with small-business owners to turn their goals into a scope, then built and maintained their WordPress and WooCommerce sites.' },
        { label: 'Automation', text: 'Set up WhatsApp automations, generative AI workflows for ad and social content, and Meta Ads analytics against traffic and lead targets.' },
      ],
    },
    {
      title: 'Artificial Intelligence Research Intern',
      company: 'Universidad del Rosario',
      location: 'Bogotá, Colombia',
      start: 'Jan. 2021',
      end: 'Aug. 2021',
      summary: 'Real-time computer vision with Python and YOLO. Paper published by SPIE.',
      highlights: [
        { label: 'Computer vision', text: 'Built a real-time pipeline with Python and YOLO to monitor people indoors and outdoors from low-cost video, presented at the 17th International Symposium on Medical Information Processing.', link: { label: 'Paper published by SPIE', url: 'https://www.spiedigitallibrary.org/conference-proceedings-of-spie/12088/120880V/Monitoring-and-evaluation-of-people-in-indoors-and-outdoors-using/10.1117/12.2606334.full' } },
      ],
    },
  ] as Role[],

  projects: [
    {
      name: 'VerifAI Wallet',
      kind: 'Master’s thesis, co-authored',
      year: '2026',
      pitch: 'An AI contract auditor inside the EU digital identity wallet. Amazon Bedrock and RAG over Colombian, Spanish and EU law flag risky clauses before you sign.',
      summary: 'Extends the EU open-source identity wallet (EUDI) with an AI contract auditor. Before signing, the contract goes to a serverless back end on AWS Lambda, where Amazon Bedrock with RAG over Colombian, Spanish and EU law flags the clauses that put the signer at risk. Keys live in AWS KMS.',
      stack: ['Amazon Bedrock', 'RAG', 'AWS Lambda', 'AWS KMS', 'Kotlin'],
      links: [
        { label: 'Android app', url: 'https://github.com/TheBryan28/verifai-android-wallet-ui' },
        { label: 'Lambda back end', url: 'https://github.com/TheBryan28/verifai-wallet-lambdas' },
        { label: 'Credential issuer', url: 'https://github.com/TheBryan28/verifai-eudi-srv-pid-issuer' },
      ],
    },
    {
      name: 'Snap theme',
      kind: 'Open source, Open LMS',
      year: '2025 – 2026',
      pitch: 'The open-source Moodle theme, moved onto reactive components.',
      summary: 'The open-source Moodle theme, refactored onto reactive components. In the year after the refactor began, customer-reported issues fell to 43 from 57, and high-priority ones to three from 11.',
      stack: ['PHP', 'JavaScript', 'Moodle', 'Mustache'],
      links: [{ label: 'Contributions', url: 'https://github.com/open-lms-open-source/moodle-theme_snap/commits?author=TheBryanOpen228' }],
    },
    {
      name: 'Relatos de Papel',
      kind: 'Distributed microservices',
      year: '2025 – 2026',
      pitch: 'An online bookstore built as Java and Spring Boot microservices, then hardened with CWE analysis and penetration testing.',
      summary: 'Online bookstore with a Java and Spring Boot back end: service discovery through Eureka, an API Gateway with round-robin load balancing, JWT and Elasticsearch, plus a React front end. Hardened with CWE analysis and penetration testing.',
      stack: ['Java', 'Spring Cloud', 'Elasticsearch', 'React', 'Burp Suite'],
      links: [
        { label: 'React front end', url: 'https://github.com/TheBryan28/relatos-de-papel-UNIR-fullstack' },
        { label: 'API Gateway', url: 'https://github.com/TheBryan28/RelatosDePapel-Gateway' },
        { label: 'Catalog service', url: 'https://github.com/TheBryan28/RelatosDePapel-Catalog-Microservice' },
      ],
    },
    {
      name: 'Banking Assistant Workflows',
      kind: 'Generative AI program',
      year: '2025 – 2026',
      pitch: 'n8n and Flowise flows that answer banking questions from official sources, with every answer traceable.',
      summary: 'n8n and Flowise flows that answer banking questions, such as current credit rates, from data crawled from official sources, with every answer traceable. Also RAG pipelines on Pinecone and FAISS and a RAG service on Azure AI Foundry.',
      stack: ['n8n', 'Flowise', 'RAG', 'Pinecone', 'Azure AI Foundry'],
      links: [],
    },
  ] as Project[],

  certifications: [
    { name: 'Associate Cloud Engineer', issuer: 'Google Cloud Certified', year: '2026' },
    { name: 'Generative AI Leader', issuer: 'Google Cloud Certified', year: '2026' },
    { name: 'Generative AI Foundations', issuer: 'Certiport, a Pearson VUE business', year: '2026', url: 'https://www.credly.com/org/certiport' },
  ] as Credential[],

  education: [
    { name: 'M.Sc. in Software Engineering and Computer Systems', issuer: 'Universidad Internacional de La Rioja, Spain', year: '2025 – Present' },
    { name: 'Advanced Program in Generative AI', issuer: 'UNIR, Spain', year: '2025 – Present' },
    { name: 'B.Sc. in Biomedical Engineering', issuer: 'Escuela Colombiana de Ingeniería and Universidad del Rosario', year: '2016 – 2021' },
    { name: 'Ser Pilo Paga 2 Scholarship', issuer: 'Colombian government merit award for top ICFES scores', year: '2016 – 2021' },
  ] as Credential[],
};

export type Profile = typeof profile;

import { profile } from './profile';
import type { Profile } from './profile';

// Spanish version of the profile. Links, numbers and the stack are reused
// from the English file; only the text changes.

const [openlms, ltg, freelance, rosario] = profile.experience;
const [verifai, snap, relatos, banking] = profile.projects;

export const profileEs: Profile = {
  ...profile,
  title: 'Ingeniero Full-Stack de IA',
  focus: ['IA generativa', 'Nube e integraciones', 'Full stack'],
  availability: 'Disponible para proyectos y roles remotos',
  summary:
    'Ingeniero full-stack con cinco años de experiencia, certificado por Google Cloud como Associate Cloud Engineer y Generative AI Leader. Lidero los plugins de IA generativa en Open LMS, una plataforma de aprendizaje basada en Moodle con más de 1.000 organizaciones clientes y 10 millones de usuarios en más de 120 países. Diseño y llevo a producción funciones de IA de principio a fin: pipelines de LLM y RAG con OpenAI, Anthropic, Gemini y Amazon Bedrock, integraciones REST y GraphQL, interfaces en React y Angular, y la infraestructura en la nube y el CI/CD que las mantienen estables.',
  languages: ['Español (nativo)', 'Inglés (C1, EF SET)', 'Portugués (básico)'],

  metrics: [
    { value: '649', label: 'sitios en producción', detail: 'usan Nova, el generador de cursos con IA' },
    { value: '666', label: 'sitios en producción', detail: 'usan tiny_ai_assistant en el editor de cursos' },
    { value: '11 → 3', label: 'incidencias de alta prioridad', detail: 'reportadas por clientes en Snap, un año después del refactor' },
    { value: '300+', label: 'pruebas reparadas', detail: 'Behat y PHPUnit, CI/CD de nuevo en verde' },
  ],

  skills: profile.skills.map((s) => ({
    ...s,
    group:
      {
        Languages: 'Lenguajes',
        'Front end': 'Front end',
        'Back end and APIs': 'Back end y APIs',
        AI: 'IA',
        'Cloud and DevOps': 'Nube y DevOps',
        Data: 'Datos',
        'Testing and security': 'Pruebas y seguridad',
      }[s.group] ?? s.group,
  })),

  experience: [
    {
      ...openlms,
      title: 'Ingeniero de Software Full-Stack, IA Generativa',
      companyNote: 'empresa del portafolio de General Atlantic',
      location: 'Remoto, Estados Unidos',
      start: 'feb. 2025',
      end: 'actualidad',
      summary: 'Lidero los plugins de IA generativa: generación de cursos, herramientas de contenido, la capa de IA compartida y el CI/CD que los rodea.',
      highlights: [
        { label: 'Plataforma de IA', text: 'Lidero la arquitectura de las funciones de IA generativa. Co-construí la capa interna de IA que atiende a todos los plugins con una sola interfaz y proveedores intercambiables: OpenAI, Anthropic, Gemini y DeepSeek.' },
        { label: 'Nova Course Generator', text: 'Lancé el plugin, hoy activo en 649 sitios en producción, que convierte un tema o un conjunto de archivos en un curso completo de Moodle en unos cinco minutos. El docente aprueba un temario propuesto por la IA y luego tareas en segundo plano construyen cada sección con contenido, imágenes, foros, tareas y cuestionarios.' },
        { label: 'Herramientas de contenido con IA', text: 'Diseñé y lancé tiny_ai_assistant, el creador de contenido con IA dentro del editor de Moodle, hoy activo en 666 sitios en producción, y un generador que crea bancos de preguntas a partir de archivos.', link: { label: 'Anuncio de Open LMS', url: openlms.highlights[2].link!.url } },
        { label: 'Tema Snap', text: 'Lideré el refactor del tema open source Snap hacia los componentes reactivos de Moodle y el comportamiento de Boost. En el año siguiente a su inicio, en julio de 2025, las incidencias reportadas por clientes bajaron de 57 a 43, y las de alta prioridad de 11 a 3.', link: { label: 'Contribuciones a Snap en GitHub', url: openlms.highlights[3].link!.url } },
        { label: 'Pruebas y pipelines', text: 'Reparé más de 300 pruebas de Behat y PHPUnit para devolver el CI/CD de GitLab a verde. Construí comandos de IA para la CLI interna del equipo, en TypeScript y Node.js, que clasifican los fallos de Behat y publican revisiones de código línea por línea en los merge requests.' },
        { label: 'Herramientas de IA para desarrolladores', text: 'Construí el plugin de Claude Code del equipo: 12 skills que llevan a un desarrollador desde un ticket de Jira hasta una versión de Moodle integrada, con aprobación antes de cualquier cambio de código.' },
        { label: 'Actualizaciones de plataforma', text: 'Integro cada nueva versión de Moodle en el producto y reinicio las flotas de sitios sandbox con Jenkins. Llevé los plugins de IA a través del rediseño del banco de preguntas de Moodle 5.0.' },
      ],
    },
    {
      ...ltg,
      title: 'Ingeniero de Software Asociado',
      location: 'Remoto, Reino Unido',
      start: 'mar. 2022',
      end: 'feb. 2025',
      summary: 'Refactoricé plugins empresariales de Moodle y optimicé el MySQL de sitios con mucho tráfico.',
      highlights: [
        { label: 'Plugins empresariales', text: 'Refactoricé plugins empresariales como Personalized Learning Designer, creé nuevos plugins y servicios web y dividí interfaces complejas en componentes modulares y reutilizables.' },
        { label: 'Rendimiento', text: 'Diagnostiqué problemas de rendimiento en sitios con mucho tráfico y optimicé las consultas MySQL que los causaban.' },
      ],
    },
    {
      ...freelance,
      title: 'Consultor web y de automatización (medio tiempo)',
      company: 'Independiente',
      start: 'jun. 2021',
      end: 'ago. 2023',
      summary: 'Construí tiendas en línea y automatizaciones de contenido con IA para pequeñas empresas, desde el alcance hasta el lanzamiento.',
      highlights: [
        { label: 'Entrega a clientes', text: 'Trabajé directamente con dueños de pequeñas empresas para convertir sus objetivos en un alcance, y luego construí y mantuve sus sitios en WordPress y WooCommerce.' },
        { label: 'Automatización', text: 'Configuré automatizaciones de WhatsApp, flujos de IA generativa para anuncios y redes sociales, y analítica de Meta Ads con metas de tráfico y leads.' },
      ],
    },
    {
      ...rosario,
      title: 'Practicante de investigación en Inteligencia Artificial',
      start: 'ene. 2021',
      end: 'ago. 2021',
      summary: 'Visión por computadora en tiempo real con Python y YOLO. Artículo publicado por SPIE.',
      highlights: [
        { label: 'Visión por computadora', text: 'Construí un pipeline en tiempo real con Python y YOLO para monitorear personas en interiores y exteriores con video de bajo costo, presentado en el 17.º Simposio Internacional de Procesamiento de Información Médica.', link: { label: 'Artículo publicado por SPIE', url: rosario.highlights[0].link!.url } },
      ],
    },
  ],

  projects: [
    {
      ...verifai,
      kind: 'Tesis de maestría, en coautoría',
      pitch: 'Un auditor de contratos con IA dentro de la billetera de identidad digital de la UE. Amazon Bedrock y RAG sobre leyes de Colombia, España y la UE señalan las cláusulas riesgosas antes de firmar.',
      summary: 'Extiende la billetera de identidad open source de la UE (EUDI) con un auditor de contratos con IA. Antes de firmar, el contrato va a un back end serverless en AWS Lambda, donde Amazon Bedrock con RAG sobre leyes de Colombia, España y la UE señala las cláusulas que ponen en riesgo a quien firma. Las llaves viven en AWS KMS.',
      links: [
        { label: 'App Android', url: verifai.links[0].url },
        { label: 'Back end en Lambda', url: verifai.links[1].url },
        { label: 'Emisor de credenciales', url: verifai.links[2].url },
      ],
    },
    {
      ...snap,
      kind: 'Open source, Open LMS',
      pitch: 'El tema open source de Moodle, migrado a componentes reactivos.',
      summary: 'El tema open source de Moodle, refactorizado sobre componentes reactivos. En el año siguiente al inicio del refactor, las incidencias de clientes bajaron de 57 a 43 y las de alta prioridad de 11 a 3.',
      links: [{ label: 'Contribuciones', url: snap.links[0].url }],
    },
    {
      ...relatos,
      kind: 'Microservicios distribuidos',
      pitch: 'Una librería en línea construida con microservicios en Java y Spring Boot, reforzada con análisis CWE y pruebas de penetración.',
      summary: 'Librería en línea con back end en Java y Spring Boot: descubrimiento de servicios con Eureka, API Gateway con balanceo round-robin, JWT y Elasticsearch, y un front end en React. Reforzada con análisis CWE y pruebas de penetración.',
      links: [
        { label: 'Front end en React', url: relatos.links[0].url },
        { label: 'API Gateway', url: relatos.links[1].url },
        { label: 'Servicio de catálogo', url: relatos.links[2].url },
      ],
    },
    {
      ...banking,
      name: 'Asistente bancario con flujos de IA',
      kind: 'Programa de IA generativa',
      pitch: 'Flujos en n8n y Flowise que responden preguntas bancarias con fuentes oficiales, y cada respuesta se puede rastrear.',
      summary: 'Flujos en n8n y Flowise que responden preguntas bancarias, como tasas de crédito vigentes, con datos extraídos de fuentes oficiales y trazabilidad de cada respuesta. También pipelines RAG en Pinecone y FAISS y un servicio RAG en Azure AI Foundry.',
    },
  ],

  certifications: profile.certifications.map((c) =>
    c.issuer.startsWith('Certiport') ? { ...c, issuer: 'Certiport, una empresa de Pearson VUE' } : c,
  ),

  education: [
    { name: 'Maestría en Ingeniería de Software y Sistemas Informáticos', issuer: 'Universidad Internacional de La Rioja, España', year: '2025 – actualidad' },
    { name: 'Programa Avanzado en IA Generativa', issuer: 'UNIR, España', year: '2025 – actualidad' },
    { name: 'Ingeniería Biomédica', issuer: 'Escuela Colombiana de Ingeniería y Universidad del Rosario', year: '2016 – 2021' },
    { name: 'Beca Ser Pilo Paga 2', issuer: 'Beca del Gobierno de Colombia por resultados sobresalientes en el ICFES', year: '2016 – 2021' },
  ],
};

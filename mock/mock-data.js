/**
 * Mock data module — simulates backend responses.
 * Replace each exported object/array with real API calls during backend integration.
 */

export const MOCK_USERS = [
  {
    id: 1,
    email: 'arthur@burbojito.com',
    password: '123456',
    nome: 'Arthur',
    sobrenome: 'Moreira Craveiro',
    username: 'arthur.moreira',
    telefone: '+55 12 1234 5678',
    role: 'Enfermeiro',
  },
  {
    id: 2,
    email: 'pamela@burbojito.com',
    password: '123456',
    nome: 'Pamela',
    sobrenome: 'Unsihuay Perez',
    username: 'pamela.unsihuay',
    telefone: '+51 1 234 5678',
    role: 'Avaliadora',
  },
];

export const MOCK_PATIENTS = [
  { id: 1, nome: 'Evelyn Powell',    idade: 78, campoVisual: 51 },
  { id: 2, nome: 'Bregy Malpartida', idade: 34, campoVisual: 73 },
  { id: 3, nome: 'Leonard Fields',  idade: 76, campoVisual: 61 },
  { id: 4, nome: 'Claude Shelton',  idade: 75, campoVisual: 41 },
  { id: 5, nome: 'Cheryl Richardson',idade: 62, campoVisual: 68 },
  { id: 6, nome: 'Daisy Andrews',   idade: 55, campoVisual: 79 },
  { id: 7, nome: 'Norman Warner',   idade: 80, campoVisual: 38 },
  { id: 8, nome: 'Glenda Morgan',   idade: 67, campoVisual: 82 },
  { id: 9, nome: 'Dean Powers',     idade: 71, campoVisual: 44 },
  { id: 10, nome: 'Marilyn Collins', idade: 46, campoVisual: 62 },
  { id: 11, nome: 'Katie Gray',      idade: 78, campoVisual: 55 },
  { id: 12, nome: 'Rodrigo Liachua', idade: 22, campoVisual: 84 },
];

export const MOCK_HIGH_RISK_PATIENTS = [
  { id: 1,  nome: 'Evelyn Powell',    idade: 78, campoVisual: 51 },
  { id: 10, nome: 'Marilyn Collins',  idade: 46, campoVisual: 62 },
  { id: 3,  nome: 'Leonard Fields',  idade: 76, campoVisual: 61 },
  { id: 4,  nome: 'Claude Shelton',  idade: 75, campoVisual: 41 },
  { id: 11, nome: 'Katie Gray',       idade: 78, campoVisual: 55 },
];

export const MOCK_EVALUATIONS = [
  { data: '09-05-2026', numero: 12 },
  { data: '10-05-2026', numero: 10 },
  { data: '11-05-2026', numero: 8  },
  { data: '12-05-2026', numero: 7  },
  { data: '13-05-2026', numero: 7  },
];

export const MOCK_NOTIFICATIONS = [
  {
    grupo: 'HOY',
    itens: [
      { id: 1, enfermeiro: 'Arthur', paciente: 'Helena Martinez', vfi: 45,  tempoLabel: 'Há 2 min'      },
      { id: 2, enfermeiro: 'Arthur', paciente: 'Bregy Malpartida', vfi: 66, tempoLabel: '1 hora atrás'  },
      { id: 3, enfermeiro: 'Arthur', paciente: 'Claude Shelton',   vfi: 96, tempoLabel: '1 hora atrás'  },
      { id: 4, enfermeiro: 'Arthur', paciente: 'Evelyn Powell',    vfi: 65, tempoLabel: '2 horas atrás' },
      { id: 5, enfermeiro: 'Arthur', paciente: 'Norman Warner',    vfi: 72, tempoLabel: '3 horas atrás' },
    ],
  },
  {
    grupo: 'AYER',
    itens: [
      { id: 6, enfermeiro: 'Arthur', paciente: 'Marilyn Collins',   vfi: 80, tempoLabel: '1 dia atrás' },
      { id: 7, enfermeiro: 'Arthur', paciente: 'Leonard Fields',    vfi: 66, tempoLabel: '1 dia atrás' },
      { id: 8, enfermeiro: 'Arthur', paciente: 'Cheryl Richardson', vfi: 58, tempoLabel: '1 dia atrás' },
    ],
  },
];

/** Simulated patient report — always returns the example image path. */
export const MOCK_REPORT_IMAGE_PATH = 'assets/images/exemplo-relatorio.jpeg';

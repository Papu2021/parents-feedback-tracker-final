import { Question, ServiceItem } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    textAm: 'የልጅዎ የዛሬ ተግባራት እንቅስቃሴ እንዴት ነበር?',
    textEn: "How was your son's progress in today's activities?",
    active: true
  },
  {
    id: 'q2',
    textAm: 'የኩባንያችን አጠቃላይ አገልግሎት ዛሬ እንዴት ነበር?',
    textEn: "How was our company's overall service today?",
    active: true
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    amharic: 'ማንኛውም የጤና ማማከር አገልግሎት በዶክተሮች',
    english: 'Any health consulting service by doctors',
    icon: 'Stethoscope'
  },
  {
    id: 2,
    amharic: 'የልጆች እና የህፃናት ት/ቤት እና ክትትል',
    english: 'Child and infant school and monitoring',
    icon: 'Baby'
  },
  {
    id: 3,
    amharic: 'የቤተሰብ ጤና ማማከር',
    english: 'Family health consulting',
    icon: 'Users'
  },
  {
    id: 4,
    amharic: 'የህመምተኞች ክትትል',
    english: 'Patient monitoring',
    icon: 'Activity'
  },
  {
    id: 5,
    amharic: 'የውጭ የነፃ ት/ቤት ዕድል',
    english: 'Foreign free scholarship opportunities',
    icon: 'Globe'
  },
  {
    id: 6,
    amharic: 'ለዩኒቨርሲቲ ተማሪዎች አጋዥ',
    english: 'Support for university students',
    icon: 'GraduationCap'
  },
  {
    id: 7,
    amharic: 'የተፈታኝ ተማሪዎች ልዩ ድጋፍ ማማከር እና ማብቃት',
    english: 'Special support consulting and empowerment for examinees',
    icon: 'BrainCircuit'
  },
  {
    id: 8,
    amharic: 'የእናቶች እና የጨቅላ ህፃናት ጤና እና አስተዳደግ ማማከር',
    english: 'Maternal and infant health and upbringing consulting',
    icon: 'HeartHandshake'
  },
  {
    id: 9,
    amharic: 'የተማሪዎች የት/ቤት ማማከር እና ክትትል (ለሁሉም ክፍል)',
    english: 'Student school consulting and monitoring (All grades)',
    icon: 'School'
  },
  {
    id: 10,
    amharic: 'የቋንቋ ትምህርት (ለሀገር ውስጥ እና ለሀገር ውጭ)',
    english: 'Language education (Domestic and International)',
    icon: 'Languages'
  }
];
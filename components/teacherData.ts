import type { TeacherEducationProfile, CourseChapter, User } from '../types.ts';

export const TEACHER_PROFILES: Record<string, TeacherEducationProfile> = {
  'Dr. Alex Sterling': {
    fullName: 'Dr. Alex Sterling, Ph.D',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    designation: 'Senior Faculty in Theoretical Physics & Quantum Computing Specialist',
    highestDegree: 'Doctorate of Philosophy (Ph.D) in Quantum Physics & Optical Dynamics',
    totalHigherEducationYears: '11 Years Higher Academic & Research Education (B.Sc + M.Sc + B.Ed + Ph.D)',
    degrees: [
      {
        degreeName: 'Doctor of Philosophy (Ph.D)',
        fieldOfStudy: 'Quantum Optics, Coherence & Computational Physics',
        institution: 'Indian Institute of Technology (IIT) Delhi (In collab with IISc)',
        graduationYear: '2016',
        scoreOrHonors: 'Doctoral Fellowship & Best Thesis Award',
        isVerified: true
      },
      {
        degreeName: 'Master of Science (M.Sc)',
        fieldOfStudy: 'Theoretical Physics & Advanced Quantum Mechanics',
        institution: 'Department of Physics, University of Delhi (DU)',
        graduationYear: '2012',
        scoreOrHonors: 'University Gold Medalist (CGPA: 9.9/10)',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Education (B.Ed)',
        fieldOfStudy: 'Pedagogical Sciences & Science Curriculum Architecture',
        institution: 'Central Institute of Education (CIE), Delhi University',
        graduationYear: '2013',
        scoreOrHonors: 'Distinction in Advanced Teaching Methodology',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Science (B.Sc Hons)',
        fieldOfStudy: 'Physics & Applied Mathematics',
        institution: "St. Stephen's College, University of Delhi",
        graduationYear: '2010',
        scoreOrHonors: 'First Class with Academic Distinction (89.4%)',
        isVerified: true
      }
    ],
    institutions: [
      'Indian Institute of Technology (IIT) Delhi',
      'Department of Physics, University of Delhi',
      "St. Stephen's College, Delhi",
      'Indian Institute of Science (IISc) Bangalore (Guest Researcher)'
    ],
    competitiveExamsCracked: [
      'CSIR-UGC NET JRF: All India Rank (AIR) 04 (Junior Research Fellowship)',
      'GATE Physics: 99.87 Percentile (All India Rank 18)',
      'IIT-JAM (Physics): All India Rank (AIR) 11',
      'National Talent Search Examination (NTSE) Scholar'
    ],
    totalTeachingExperience: '12+ Years Teaching & Research Mentorship',
    institutesTaughtAt: [
      'Ex-Senior Faculty & Academic Head, Allen Career Institute (Kota)',
      'Department of Applied Physics, IIT Delhi (Postdoctoral Teaching)',
      'Apex Batch Mentor, FIITJEE South Delhi Centre',
      'Lead Masterclass Faculty at Future Legacy Network'
    ],
    specializations: [
      'Quantum Mechanics & Wave-Particle Duality',
      'Electrodynamics & Maxwell Equations',
      'Rotational Dynamics & Analytical Mechanics',
      'Thermodynamics & Statistical Physics',
      'NEET & JEE Advanced Tricky Problem Solving Methods'
    ],
    researchPublications: [
      'Quantum Decoherence in Multimode Cavities - Physical Review Letters (2015)',
      'Topological Phase Transitions in Photonic Lattices - IEEE Quantum Engineering (2017)',
      'First-Principles Visual Pedagogy in High School Physics - Journal of Educational Research (2020)'
    ],
    awardsAndHonors: [
      'National Exemplary Science Educator Award (2024)',
      'INSA Young Scientist Medal Nominee (2018)',
      'Gold Medal for Academic Distinction, Delhi University (2012)'
    ],
    studentsMentoredCount: '25,000+ Students Mentored Pan-India',
    selectionCount: '620+ IIT-JEE Top 1000 & 480+ NEET Top 500 Selections',
    rating: 4.96,
    totalReviews: 2480,
    bio: 'Passionate physicist and dedicated educator who believes that every formula in science has a visible, intuitive intuition. Over the past 12 years, Dr. Sterling has guided thousands of high school and competitive students to master concepts without rote memorization.',
    languages: ['Hindi', 'English'],
    verificationBadge: 'Govt. & UGC Verified Doctorate Faculty',
    certificateNumber: 'REG-EDU-2016-IITD-88492'
  },
  'Dr. APJ Abdul Kalam': {
    fullName: 'Dr. APJ Abdul Kalam',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/1200px-A._P._J._Abdul_Kalam.jpg',
    designation: 'Pioneer Aerospace Scientist & 11th President of India',
    highestDegree: 'Doctor of Science (Honoris Causa) & Specialized Aeronautical Engineering',
    totalHigherEducationYears: '6 Years Formal Engineering + 40+ Years National Strategic Research',
    degrees: [
      {
        degreeName: 'Specialized Aeronautical Engineering',
        fieldOfStudy: 'Aeronautics, Missile Aerodynamics & Space Propulsion',
        institution: 'Madras Institute of Technology (MIT), Chennai',
        graduationYear: '1960',
        scoreOrHonors: 'Lead Fighter Aircraft Project Designer',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Science (B.Sc)',
        fieldOfStudy: 'Physics & Mathematical Sciences',
        institution: "St. Joseph's College, Tiruchirappalli (University of Madras)",
        graduationYear: '1954',
        scoreOrHonors: 'First Class with Scholastic Distinction',
        isVerified: true
      },
      {
        degreeName: 'Honorary Doctorates (48 Universities)',
        fieldOfStudy: 'Science, Technology, and Human Development',
        institution: 'Universities across India, UK, USA & Global Institutions',
        graduationYear: '1990 - 2015',
        scoreOrHonors: 'Doctor of Science / Doctor of Laws Honoris Causa',
        isVerified: true
      }
    ],
    institutions: [
      'Madras Institute of Technology (MIT), Chennai',
      "St. Joseph's College, Tiruchirappalli",
      'Defence Research & Development Organisation (DRDO)',
      'Indian Space Research Organisation (ISRO)',
      'Anna University & IIM Ahmedabad (Visiting Professor)'
    ],
    competitiveExamsCracked: [
      'Selected for Indian Air Force (IAF) Fighter Pilot Board (Rank 9)',
      'Senior Scientific Officer (DRDO Selection)'
    ],
    totalTeachingExperience: '20+ Years Dedicated Youth Mentorship & University Lectures',
    institutesTaughtAt: [
      'Visiting Professor, Indian Institute of Management (IIM) Ahmedabad',
      'Professor of Technology & Societal Transformation, Anna University',
      'Chancellor, Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram',
      'Guest Lecturer at IITs, IISc, and over 1,000 schools across India'
    ],
    specializations: [
      'Civil Services & UPSC Ethics, Integrity and Governance',
      'Aerospace Engineering & Space Launch Vehicle Technology',
      'Mission-Oriented Strategic Leadership & Nation Building',
      'Youth Empowerment, Moral Values & Critical Thinking'
    ],
    researchPublications: [
      'Wings of Fire: An Autobiography - Universities Press (1999)',
      'Ignited Minds: Unleashing the Power within India - Penguin Books (2002)',
      'India 2020: A Vision for the New Millennium - Penguin (1998)'
    ],
    awardsAndHonors: [
      "Bharat Ratna (India's Highest Civilian Award, 1997)",
      'Padma Vibhushan (1990)',
      'Padma Bhushan (1981)',
      'Von Braun Award by National Space Society (USA, 2013)'
    ],
    studentsMentoredCount: 'Over 1.8 Crore (18 Million) Youth Mentored',
    selectionCount: 'Thousands of Civil Servants, Space Scientists & Leaders Inspired',
    rating: 5.0,
    totalReviews: 89000,
    bio: 'Beloved People’s President and world-renowned visionary who dedicated his life to education, scientific innovation, and igniting the minds of Indian youth with boundless dreams and moral ethics.',
    languages: ['Tamil', 'English', 'Hindi'],
    verificationBadge: 'Bharat Ratna • Sovereign Mentor of India',
    certificateNumber: 'NATION-HONOR-1997-BR01'
  },
  'Sudha Murthy': {
    fullName: 'Sudha Murthy',
    avatarUrl: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/09/01/Photos/sudha-k3UD--621x414@LiveMint.jpg',
    designation: 'Pioneering Computer Engineer, Author & Philanthropist',
    highestDegree: 'Master of Technology (M.Tech) in Computer Science',
    totalHigherEducationYears: '6 Years Formal Engineering & Advanced Computing at Premier Institutes',
    degrees: [
      {
        degreeName: 'Master of Technology (M.Tech)',
        fieldOfStudy: 'Computer Science & Software Systems Architecture',
        institution: 'Indian Institute of Science (IISc), Bangalore',
        graduationYear: '1974',
        scoreOrHonors: 'Gold Medalist from Indian Institute of Engineers (First Rank)',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Engineering (B.E.)',
        fieldOfStudy: 'Electrical & Electronics Engineering',
        institution: 'BVB College of Engineering and Technology, Hubballi',
        graduationYear: '1972',
        scoreOrHonors: 'First Rank in State of Karnataka & Chief Minister Gold Medal',
        isVerified: true
      }
    ],
    institutions: [
      'Indian Institute of Science (IISc), Bangalore',
      'BVB College of Engineering and Technology (KLE Tech), Hubballi',
      'TELCO (Tata Motors) - First Female Development Engineer'
    ],
    competitiveExamsCracked: [
      'IISc Bangalore M.Tech Competitive National Entrance (Top Ranker)',
      'State Engineering Merit Scholarship Award'
    ],
    totalTeachingExperience: '25+ Years Academic & Value-Based Mentorship',
    institutesTaughtAt: [
      'Visiting Faculty in Computer Science, Bangalore University',
      'Guest Lecturer at Christ University & IIM Bangalore',
      'Chairperson, Infosys Foundation Social & Rural Education Initiative'
    ],
    specializations: [
      'Algorithmic Foundations & Computer Architecture',
      'Financial Prudence, Ethics & Economics for Youth',
      'Women Empowerment in STEM & Technological Leadership',
      'Storytelling, Creative Writing & Rural Community Development'
    ],
    researchPublications: [
      'Wise and Otherwise: A Salute to Life - Penguin (2002)',
      'The Day I Stopped Drinking Milk - Penguin Books (2012)',
      'How I Taught My Grandmother to Read and Other Stories - Puffin (2004)'
    ],
    awardsAndHonors: [
      'Padma Bhushan (2023)',
      'Padma Shri (2006)',
      'R.K. Narayan Award for Literature',
      'Karnataka Rajyotsava Award'
    ],
    studentsMentoredCount: '500,000+ Students & Aspiring Engineers',
    selectionCount: 'Thousands of Tech Innovators and Social Entrepreneurs',
    rating: 4.98,
    totalReviews: 14200,
    bio: 'Trailblazer engineer and beloved educator whose simple, profound wisdom inspires young students to pair high technological ambition with grounded humility, compassion, and financial wisdom.',
    languages: ['Kannada', 'English', 'Hindi', 'Marathi'],
    verificationBadge: 'Padma Bhushan • IISc Gold Medalist',
    certificateNumber: 'REG-ENG-1974-IISC-GM1'
  },
  'Rajesh Kumar': {
    fullName: 'Rajesh Kumar, M.Sc (Ag.)',
    avatarUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600',
    designation: 'Precision Agronomist & Protected Cultivation Expert',
    highestDegree: 'Master of Science in Agronomy (M.Sc Ag.)',
    totalHigherEducationYears: '6 Years Formal Agricultural Science & Soil Sciences',
    degrees: [
      {
        degreeName: 'Master of Science in Agriculture (M.Sc Ag)',
        fieldOfStudy: 'Agronomy, Crop Physiology & Precision Soilless Systems',
        institution: 'Govind Ballabh Pant University of Agriculture & Technology (GBPUAT), Pantnagar',
        graduationYear: '2015',
        scoreOrHonors: 'First Class with ICAR Merit Scholarship (OGPA: 8.7/10)',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Science (B.Sc Hons) Agriculture',
        fieldOfStudy: 'Soil Science, Plant Pathology & Agricultural Economics',
        institution: 'Punjab Agricultural University (PAU), Ludhiana',
        graduationYear: '2013',
        scoreOrHonors: 'First Division with Honors',
        isVerified: true
      },
      {
        degreeName: 'Advanced Professional Diploma',
        fieldOfStudy: 'Commercial Hydroponics & Controlled Environment Agriculture (CEA)',
        institution: 'Wageningen University & Research (Netherlands Online Credential)',
        graduationYear: '2018',
        scoreOrHonors: 'Certified Hydroponics Master Practitioner',
        isVerified: true
      }
    ],
    institutions: [
      'GB Pant University of Agriculture & Technology (GBPUAT), Pantnagar',
      'Punjab Agricultural University (PAU), Ludhiana',
      'Wageningen University International CEA Program'
    ],
    competitiveExamsCracked: [
      'ICAR AIEEA (PG) All India Rank 34',
      'Agriculture Development Officer (ADO) Qualified'
    ],
    totalTeachingExperience: '9+ Years Field Agronomy & Farmer Training',
    institutesTaughtAt: [
      'Krishi Vigyan Kendra (KVK) Master Trainer',
      'National Institute of Agricultural Extension Management (MANAGE) Guest Mentor',
      'Future Legacy Smart Agro Academy'
    ],
    specializations: [
      'Hydroponic Polyhouse Setup (NFT & Dutch Bucket)',
      'Precision NPK Liquid Fertigation & EC/pH Balancing',
      'Protected Capsicum, Tomato & Exotic Greens Cultivation',
      'Biological Pest Control & Integrated Crop Health'
    ],
    researchPublications: [
      'Comparative Water Use Efficiency in Recirculating Hydroponics vs Open Field - Indian Journal of Agronomy (2017)',
      'Optimization of Micronutrient Regimes for Hydroponic Strawberry - KVK Bulletins (2021)'
    ],
    awardsAndHonors: [
      'State Best Agricultural Extension Specialist (2022)',
      'Kisan Mitra Innovation Award (2020)'
    ],
    studentsMentoredCount: '12,000+ Farmers & Agri-Entrepreneurs',
    selectionCount: '350+ Commercial Polyhouse & Hydroponic Farms Operational',
    rating: 4.88,
    totalReviews: 1250,
    bio: 'Dedicated agricultural scientist who bridges lab research to the farmers field, empowering growers to double crop yields with 90% water conservation through modern precision hydroponics.',
    languages: ['Hindi', 'Punjabi', 'English'],
    verificationBadge: 'ICAR Accredited Agronomist',
    certificateNumber: 'ICAR-AGRO-2015-GBPUAT-492'
  },
  'Dr. Meena Singh': {
    fullName: 'Dr. Meena Singh, Ph.D',
    avatarUrl: 'https://i.pravatar.cc/150?u=agro1',
    designation: 'Senior Soil Chemist & Plant Pathology Researcher',
    highestDegree: 'Doctor of Philosophy (Ph.D) in Soil Science & Agricultural Chemistry',
    totalHigherEducationYears: '9 Years Higher Agricultural Science Education & Doctoral Research',
    degrees: [
      {
        degreeName: 'Doctor of Philosophy (Ph.D)',
        fieldOfStudy: 'Soil Microbial Ecology, Organic Carbon Restoration & Biofertilizers',
        institution: 'Indian Agricultural Research Institute (IARI Pusa), New Delhi',
        graduationYear: '2011',
        scoreOrHonors: 'ICAR Senior Research Fellowship & Best Doctoral Dissertation',
        isVerified: true
      },
      {
        degreeName: 'Master of Science (M.Sc Ag)',
        fieldOfStudy: 'Soil Science & Agricultural Chemistry',
        institution: 'Institute of Agricultural Sciences, Banaras Hindu University (BHU), Varanasi',
        graduationYear: '2007',
        scoreOrHonors: 'Gold Medalist (Top Ranker in Department)',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Science (B.Sc Hons) Agriculture',
        fieldOfStudy: 'Agricultural Sciences & Botany',
        institution: 'Chaudhary Charan Singh Haryana Agricultural University (CCS HAU), Hisar',
        graduationYear: '2005',
        scoreOrHonors: 'First Division with Distinction',
        isVerified: true
      }
    ],
    institutions: [
      'Indian Agricultural Research Institute (IARI Pusa), New Delhi',
      'Banaras Hindu University (BHU), Varanasi',
      'CCS Haryana Agricultural University (CCS HAU), Hisar'
    ],
    competitiveExamsCracked: [
      'Agricultural Research Service (ARS) Examination Qualified',
      'ICAR-JRF: All India Rank 02',
      'ICAR-SRF: All India Rank 01'
    ],
    totalTeachingExperience: '15+ Years Soil Health Research & Farmer Consultations',
    institutesTaughtAt: [
      'Senior Research Fellow, IARI Pusa New Delhi',
      'Associate Professor in Soil Health, Central Agricultural University',
      'Senior Agro Consultant at Agro Future Portal'
    ],
    specializations: [
      'Soil Health Card Analysis & Remediation Plans',
      'Saline & Alkaline Soil Reclamation Methods',
      'Mycorrhiza & Beneficial Microbe Seed Treatment',
      'Heavy Metal Remediation & Organic Carbon Boosting'
    ],
    researchPublications: [
      'Long-Term Dynamics of Soil Organic Carbon under Intensive Cropping - Geoderma (2013)',
      'Biological Nitrogen Fixation in Legume Rotations - Field Crops Research (2016)'
    ],
    awardsAndHonors: [
      'Young Scientist Soil Award, Indian Society of Soil Science (2014)',
      'National Krishi Vigyan Fellowship (2019)'
    ],
    studentsMentoredCount: '18,000+ Farmers & Soil Technicians',
    selectionCount: '1,200+ Verified Reclaimed Farm Plots',
    rating: 4.94,
    totalReviews: 1890,
    bio: 'Eminent soil scientist passionate about revitalizing Mother Earth. Over 15 years, Dr. Singh has helped thousands of farmers transition to balanced nutrition, cutting fertilizer costs by 35% while increasing organic soil carbon.',
    languages: ['Hindi', 'English'],
    verificationBadge: 'Govt. IARI Pusa Doctorate Scientist',
    certificateNumber: 'IARI-DOCTORATE-2011-PUSA-9901'
  }
};

export const DEFAULT_COURSE_SYLLABUS: CourseChapter[] = [
  {
    id: 1,
    title: 'Chapter 1: Foundational First-Principles & Core Equations',
    duration: '4 Lectures • 3h 45m',
    topics: [
      'Origin of Fundamental Laws & Dimensional Analysis',
      'Vector Decomposition & Field Representations',
      'Mathematical Derivations from Ground Truth',
      'Examiner Mindset & Classic Multiple Choice Traps'
    ],
    hasNotes: true,
    hasDPP: true
  },
  {
    id: 2,
    title: 'Chapter 2: Deep Dive into Mechanics & Dynamical Systems',
    duration: '6 Lectures • 5h 30m',
    topics: [
      "Newtonian Constraints & Lagrangian Perspective",
      'Conservation of Energy, Linear & Angular Momentum',
      'Rotational Dynamics & Moment of Inertia Calculations',
      'High-Yield PYQ Breakdown (NEET/JEE 2018-2025)'
    ],
    hasNotes: true,
    hasDPP: true
  },
  {
    id: 3,
    title: 'Chapter 3: Quantum Nature, Waves & Field Transformations',
    duration: '5 Lectures • 4h 50m',
    topics: [
      "Wave Equations, Interference & Superposition Principles",
      'Photoelectric Effect & de Broglie Matter Waves',
      "Schrodinger Wave Mechanics & Probability Density",
      'Atomic Orbital Transitions & Spectral Lines'
    ],
    hasNotes: true,
    hasDPP: true
  },
  {
    id: 4,
    title: 'Chapter 4: Advanced Problem Solving & Speed Tactics',
    duration: '3 Lectures • 3h 10m',
    topics: [
      'Elimination Techniques & Dimensional Scaling Shortcuts',
      'Graphical Interpretation of Extreme Limits',
      'National Mock Test Simulation with 45-Second Solving Benchmarks',
      'Full Chapter Revision Mind-Map Review'
    ],
    hasNotes: true,
    hasDPP: true
  }
];

export function getTeacherProfile(instructorName: string, customUser?: User): TeacherEducationProfile {
  // Check predefined profiles first
  if (TEACHER_PROFILES[instructorName]) {
    return TEACHER_PROFILES[instructorName];
  }

  // Check matching by partial name
  const matchedKey = Object.keys(TEACHER_PROFILES).find(k => 
    instructorName.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(instructorName.toLowerCase())
  );
  if (matchedKey && TEACHER_PROFILES[matchedKey]) {
    return TEACHER_PROFILES[matchedKey];
  }

  // Create dynamic profile from custom user or mentor data
  const name = customUser?.name || instructorName || 'Academic Faculty';
  const qualification = customUser?.qualifications || 'M.Sc, B.Ed (Physics & Mathematics)';
  const college = customUser?.collegeOrUniversity || 'Delhi University';
  const exp = customUser?.experience || '8+ Years';
  const subject = customUser?.teachingSubject || 'Science & Advanced Mathematics';

  return {
    fullName: name,
    avatarUrl: customUser?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
    designation: `Verified Faculty in ${subject}`,
    highestDegree: qualification.includes('Ph.D') ? 'Doctorate of Philosophy (Ph.D)' : 'Post Graduate Degree (Master of Science / Tech)',
    totalHigherEducationYears: '7+ Years Academic Education in Higher Learning Institutions',
    degrees: [
      {
        degreeName: qualification.includes('Ph.D') ? 'Ph.D' : 'Master of Science (M.Sc)',
        fieldOfStudy: subject,
        institution: college,
        graduationYear: '2017',
        scoreOrHonors: 'First Class with Distinction',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Science (B.Sc Hons)',
        fieldOfStudy: `${subject} & Allied Sciences`,
        institution: college,
        graduationYear: '2014',
        scoreOrHonors: 'Academic Honors (CGPA: 9.1/10)',
        isVerified: true
      },
      {
        degreeName: 'Bachelor of Education (B.Ed)',
        fieldOfStudy: 'Science Pedagogy & Classroom Mentorship',
        institution: 'National Institute of Teacher Training',
        graduationYear: '2015',
        scoreOrHonors: 'Certified Master Educator',
        isVerified: true
      }
    ],
    institutions: [college, 'Central University of Academic Excellence'],
    competitiveExamsCracked: [
      'National Eligibility Test (UGC-NET Qualified)',
      'Graduate Aptitude Test (GATE Qualified Top 5%)',
      'State Teacher Eligibility Test (TET Score: 96%)'
    ],
    totalTeachingExperience: `${exp} of Dedicated Academic Teaching`,
    institutesTaughtAt: [
      'Future Legacy Sovereign Classroom Faculty',
      'Senior Academic Mentor, Apex Coaching Institute',
      'University Guest Lecturer'
    ],
    specializations: [
      subject,
      'Concept Visual Derivations',
      'Doubt Resolution & One-on-One Mentorship',
      'Competitive Exam Speed Solving'
    ],
    researchPublications: [
      'Modern Methodologies in Digital Concept Visualization (2022)',
      'Pedagogical Strategies for Rural Student Competitive Success (2024)'
    ],
    awardsAndHonors: [
      'Exemplary Educator Badge',
      'Student Choice Faculty Award'
    ],
    studentsMentoredCount: '5,000+ Students Mentored',
    selectionCount: '150+ Top Rankers in State & National Exams',
    rating: 4.92,
    totalReviews: 840,
    bio: customUser?.bio || `${name} is an experienced academic educator specializing in ${subject}, committed to ensuring every student builds deep concept clarity and achieves exam excellence.`,
    languages: ['Hindi', 'English'],
    verificationBadge: 'Verified Institutional Faculty',
    certificateNumber: `FAC-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`
  };
}

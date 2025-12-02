import React, { useState, useEffect } from "react";
import "./ResidentialForm.css";
import { Save } from 'lucide-react';

const performanceStandards = [
  {
    id: "ps1",
    title:
      "<strong>PS1. Safety.</strong> Youth physical and emotional well-being are prioritized while receiving residential services.",
    expectations: [
      "Trends, or recent events does not threaten the health, safety, or welfare of the youth to self or to others.",
      "Ratio meets requirements and/or the acuity of the milieu, adherence to individual youth supervision plans; and utilization of cameras to promote trauma informed, safe practices.",
      "Staff are responsive to safety threats, and proactive in identifying and responding to potential crisis.",
      "Milieu presents with safeguards and mechanisms in place to prevent youth from harming each other, physically or emotionally to support youth sense of security.",
      "Safety concerns related to the physical plant are immediately addressed and/or a plan of action is executed to prevent youth from residing in unsafe conditions.",
      "Safety concerns related to youth physical health are immediately addressed.",
      "Management model is implemented with fidelity to the model and in compliance with policy/procedures. Practices that are high risk to do harm are reduced, such as the use of restraints and seclusion, utilizing safe alternative interventions.",
      "Staff/youth engagement is trauma informed, and considers the youth's racial, cultural, religious, and linguistic needs."
    ],
    references: [
  'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs Significant Event Reporting and Law Enforcement Involvement',
  'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900329&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">329</a> Locating and Returning Missing, Runaway and Abducted Children',
  'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a> Significant Event Reports',
  'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
  'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
  'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
  'Program Plan CFS-968',
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Section 4.2 Minimum Staffing Expectations',
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Section 5.1 Provider Physical Plant',
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Section 5.2.7.6 Missing or Abducted Children and Youth in Care and Support Services',
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Section 6.0 Treatment Goals/Service Plans',
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Section 8.3 Immediate Reporting Requirements'
],

    items: [
      {
        category: "Physical Safety",
        description:
          "Buildings are safe, clean, well-ventilated, properly light, and heated/cooled."
      },
      // {
      //   category: "Physical Safety",
      //   description:
      //     "Youth immediate physical health needs are addressed in a timely manner."
      // },
      // {
      //   category: "Physical Safety",
      //   description:
      //     "SERs and hotline reports suggests that safeguards are in place to prevent incidents of serious physical injury, elopements, and sexual abuse."
      // },
      // { category: "Milieu Safety", description: "Maltreatment occurrence is trending positively." },
      // {
      //   category: "Milieu Safety",
      //   description:
      //     "The narrative of SERs in the last 30 days suggests that staff used de-escalation techniques appropriately."
      // },
      // {
      //   category: "Milieu Safety",
      //   description:
      //     "Restraints documented in SERs in the last 30 days suggest that staff used the prescribed behavior management techniques according to the model."
      // },
      // {
      //   category: "Milieu Safety",
      //   description:
      //     "Youth trauma experience/history is considered when de-escalation techniques are required."
      // },
      // {
      //   category: "Milieu Safety",
      //   description:
      //     "Youth behavior is managed in accordance with <a href='https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES' target='_blank'>Rule 384</a>."
      // },
      // {
      //   category: "Sense of Security",
      //   description:
      //     "Youth behavior and feedback suggest that they feel safe in public and private spaces."
      // },
      // {
      //   category: "Sense of Security",
      //   description: "Youth behavior and feedback suggest that they feel safe with the staff."
      // },
      // {
      //   category: "Sense of Security",
      //   description:
      //     "Youth behavior and feedback suggest that they feel safe with the other youth."
      // }
    ]
  },
//   {
//   id: "ps2",
//   title:
//   "<strong>PS2. Living Environment.</strong> A safe living environment is provided with adequate and appropriate food, clothing, and shelter.",

//   expectations: [
//     " Meals are prepared under sanitary conditions and youth are served three balanced meals a day (exceptions include when lunch is served at school).",
//     " Youth have properly fitted and clean clothing that is appropriate for the seasons; and essentials for maintaining personal care and hygiene are provided; youth clothing is not used for discipline.",
//     " Facility is clean, hygienic, in good structural repair and free of hazards where the living space is inviting and homelike; sleeping rooms are properly furnished.",
//     " The facility has a maintenance program that adequately handles repair, upkeep and replacement of damaged essential items or damage to building."
//   ],
//   referencesIntro:
//     "Relevant Rules and/or Procedures: Rule 404.38 for childcare institutions; Rule 403.14 for group homes.",
//   references: [
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//     "Program Plan CFS-968",
//     "&nbsp;&nbsp;Section 5.0 Service Parameters"
//   ],
//   items: [
//     {
//       category: "Food",
//       description:
//         "Meals and snacks are available at the appropriate times, include a healthy mix of fruits, vegetables, grains, protein, and dairy products, and include alternatives for dietary restrictions or other special circumstances."
//     },
//     {
//       category: "Food",
//       description:
//         "Meals are served under clean and sanitary conditions."
//     },
//     {
//       category: "Food",
//       description:
//         "Menus are followed and posted where youth can view them."
//     },
//     {
//       category: "Clothing",
//       description:
//         "Youth have clean clothes that fit properly and are appropriate for the current season."
//     },
//     {
//       category: "Clothing",
//       description:
//         "Youth have their own clothes, not uniforms, reflecting level systems."
//     },
//     {
//       category: "Clothing",
//       description:
//         "Youth have clothes comparable to what other youth of similar age might wear."
//     },
//     {
//       category: "Shelter",
//       description:
//         "Common areas are in good repair, have enough furniture in good repair, and include other items appropriate for the space's function (e.g., tables, books, games, television, and decorations)."
//     }
//     // If your PDF has additional PS2 items beyond this point,
//     // add them here in the same { category, description } format
//     // using the *exact* wording.
//   ]
// }
// ,
//       {
//     id: "ps3",
//     title: "<strong>PS3. Youth Experience.</strong>",
//     subtitle:
//       "Youth experience is assessed as positive by ensuring youth safety, skill building, staff engagement and youth voice.",

//     // Expectations: NO manual "1.", "2.", etc. The UI adds numbers.
//     expectations: [
//       "Youth and family are treated with respect by all levels of staff where their right to personal privacy and confidentiality is valued. They are treated with dignity; staff do not discuss youth and families with other clients or those not professionally working with the youth and families.",
//       "Youth are informed of their rights and grievance procedures; and their voice is incorporated in the treatment planning and overall treatment experience.",
//       "Youth receive clear expectations and information about unit rules (i.e., they know what will be done while living on the unit, who, when, why, and under what circumstances things will be done while living on the unit).",
//       "Communication with youth and families fosters youth voice and commitment to working through challenges; encourage positive relationships with family and others; and creates opportunity to learn and practice new skills.",
//       "Programming, services, and individualized treatment planning are sensitive to youth's racial, cultural, religious and linguistic needs.",
//       "Youth express positive experiences of safety, skill building, and therapeutic interactions with staff."
//     ],

//     // Relevant Rules and/or Procedures - exactly per PDF
//     references: [
//       'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//       "Administrative Procedures #30 Youth Voice",
//       'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900301&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">301</a> Placement and Visitation Services',
//       'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//       'Procedures <a href="https://dcfs.illinois.gov/content/dam/soi/en/web/dcfs/documents/about-us/policy-rules-and-forms/documents/procedures/procedures-315.pdf" target="_blank" rel="noopener noreferrer">315.112</a> Child and Family Team Meetings – Therapeutic Residential Programs',
//       "Program Plans CFS-968",
//       "&nbsp;&nbsp;&nbsp;&nbsp;Section 5.2.8 Therapeutic Residential (TR) Practice Principles",
//       "&nbsp;&nbsp;&nbsp;&nbsp;Section 5.2.7 Service Array"
//     ],

//     // Items: NO leading numbers. Use category+description so label is bold only.
//     items: [
//       {
//         category: "Skill Building",
//         description:
//           "Youth behavior and feedback suggest that they are learning new coping and relationship skills."
//       },
//       {
//         category: "Skill Building",
//         description:
//           "Youth behavior and feedback suggest that they are engaging in normal, age and developmentally appropriate therapeutic recreational activities."
//       },
//       {
//         category: "Skill Building",
//         description:
//           "Youth behavior and feedback suggest that they enjoy the therapeutic recreational activities."
//       },
//       {
//         category: "Staff engagement",
//         description:
//           "Youth behavior and feedback suggest that they are treated with respect."
//       },
//       {
//         category: "Staff Engagement",
//         description:
//           "Youth behavior and feedback suggest that staff are supportive and can help them achieve their goals."
//       },
//       {
//         category: "Staff Engagement",
//         description:
//           "Youth behavior and feedback suggest that there are appropriate boundaries between the youth and staff."
//       },
//       {
//         category: "Youth Voice",
//         description:
//           "Youth voice is included in educational, treatment, transition, and discharge planning decisions, including those participating in decision-making."
//       },
//       {
//         category: "Youth Voice",
//         description:
//           "Youth voice is included in decisions about day-to-day activities."
//       },
//       {
//         category: "Youth Voice",
//         description:
//           "Youth grievances, including about allowances and clothing vouchers, are addressed."
//       }
//     ]
//   },

//   {
//     id: "ps4",
//     title:
//       "<strong>PS4. Youth and Family Driven Care.</strong> Youth and family driven approaches are utilized where youth are empowered, and family is central.",
//      expectations: [
//       " Youth and family are treated with respect by all levels of staff where their right to personal privacy and confidentiality is valued. They are treated with dignity; staff do not discuss youth and families with other clients or those not professionally working with the youth and families.",
//       " Youth/family are informed of their rights and grievance procedures; youth/family centered approach to the assessment and treatment planning and overall treatment experience.",
//       " Communication with youth and families fosters youth voice and commitment to working through challenges; that provides an opportunity to enhance parent-child functioning and interaction; and creates opportunity to learn and practice new skills.",
//       " Programming, services, and individualized treatment planning are sensitive to youth's racial, cultural, religious, and linguistic needs.",
//       " Utilization of the Child and Family Team meetings to activate and maintain family participation and decision making in the process of change and/or service provision; develop strategies to increase youth/family engagement; guide overall care and permanency planning.",
//       " Youth/family connections are valued and incorporated in orientation, programming, therapeutic services, and visitation; active family finding efforts in collaboration with the youth and the CFTM members to develop additional support to achieve stability, stepdown and/or permanency."
//     ],
//     references: [
//   'Administrative Procedures #30 Youth Voice',
//   'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//   'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a> Significant Event Reporting',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900431&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">431</a> Confidentiality of Personal Information of Persons Served',
//   'Program Plan CFS-968:',
//   '&nbsp;&nbsp;&nbsp;&nbsp;Section 1.4 Brief Description of Services Provided Under This DCFS Agreement',
//   '&nbsp;&nbsp;&nbsp;&nbsp;Section 5.0 Service Parameters'
// ]
// ,
//     items: [
//       {
//         category: "Youth Guided",
//         description:
//           "Youth are involved in decisions about their treatment and permanency plan goals."
//       },
//       {
//         category: "Youth Guided",
//         description:
//           "Youth culture, gender identity, language, race/ethnicity, and sexual orientation are respected."
//       },
//       {
//         category: "Family Driven",
//         description:
//           "Youth family connections are considered in their treatment and permanency planning."
//       },
//       {
//         category: "Family Driven",
//         description:
//           "There is shared responsibility for the CFTM addressing treatment and permanency goals."
//       },
     
//       {
//         category: "Family Driven",
//         description:
//           "Sibling and family visits are facilitated per the visitation and contract plans."
//       },
//       {
//         category: "Family Driven",
//         description:
//           "Activities include agency hosted family focused events/activities (e.g., social events, holiday parties, art shows)."
//       },
//       {
//         category: "Family Driven",
//         description:
//           "Caregivers and families are provided with training and coaching to support reunification and the youth after discharge."
//       },
//       {
//         category: "Family Driven",
//         description:
//           "Caregivers and family culture, gender identity, language, race/ethnicity, and sexual orientation are respected."
//       }
//     ]
//   },
//   {
//     id: "ps5",
//     title:
//       "<strong>PS5. Staff Training and Education.</strong> Staff are equipped with training, education, and supervision to provide quality services and supports to youth and families.",
//     expectations: [
//   {
//     text: "The contract utilizes a training program that includes:",
//     subpoints: [
//       "Pre-service training that focuses on trauma and the effects of trauma on child development.",
//       "Interventions and strategies to support youth who have been victims of trauma.",
//       "Training and education on how to help youth identify triggers and manage their feelings.",
//       "Early warning signs and precursors of distress that can signal upset or an impending crisis.",
//       "Importance of therapeutic relationships and boundaries within their specific roles.",
//       "Ongoing education and training in cultural competence is provided to all levels of staff.",
//       "Training in youth guided practices."
//     ]
//   },
//   "Training and consultation are provided by individuals within the agency or consultants who have expertise in trauma.",
//   "There are staff trained and/or certified to provide specialized services as identified in their contract.",
//   "There is a mechanism/process for the contract to maintain staff compliance with trainings and certification requirements (i.e. annual trainings, re-certification process, etc.); and identification of the need for new trainings, timeframes for refresher training, additional training for staff needing remediation."
// ],

//    references: [
//     'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//     'Procedures 302 Appendix K Support and Well-Being of Lesbian, Gay, Bisexual, Transgender, questioning/Queer, Intersex, and Asexual (LGBTQIA+) Children and Youth',
//     'Procedures 302 Appendix M Transition Planning for Adolescents',
//     'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a> Significant Event Reporting',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900431&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">431</a> Confidentiality of Personal Information of Persons Served',
//     "Program Plan CFS-968",
//     "&nbsp;&nbsp;o Section 4.0 Program Staff",
//     "&nbsp;&nbsp;o Section 5.0 Service Parameters",
//     "&nbsp;&nbsp;o Section 5.2.7.7 Meaningful Family Engagement and Involvement"
//   ],
//     items: [
//       {
//         description:
//           "The training curriculum addresses trauma and the effects of trauma on child development per the trauma treatment model and behavior management program."
//       },
//       {
//         description:
//           "Staff at all levels of the organization are provided with ongoing education and training in the trauma treatment model and behavior management program."
//       },
//       { description: "Staff are trained on youth-guided practices, including cultural competence and humility training." },
//       {
//         description:
//           "Training records identify staff who have been trained, need to be trained, or require remedial training in the trauma treatment and behavior management models."
//       },
//       { description: "Weekly multidisciplinary treatment team meetings are convened." },
//       {
//         description:
//           "Staff regularly meet with their supervisors for individual/group supervision."
//       },
//       {
//         description:
//           "Staff regularly debrief with their supervisor about their stress reactions and how stress impacts their work."
//       }
//     ]
//   },
//   {
//   id: "ps6",
//   title:
//     "<strong>PS6. Milieu Operations and Programming.</strong> There is a therapeutic environment that ensures safety, operational efficiency, and effective programming.",
//   expectations: [
//     "There is ongoing and effective collaboration and communication between professional (e.g., therapists, case managers, psychiatrist) and direct care staff; there are regular meetings that include discussions of youth behaviors; and adequate shift-change communication about youth, incidents and other issues pertaining to program functioning and safety occur between direct care staff.",
//     "Staff members are actively and therapeutically engagement with youth; staff implement milieu routines and planful activities that support safety, structure, and stability of the unit.",
//     "A skilled staff member is designated as the lead for each shift.",
//     "Minimum required staff/youth ratios maintained; and staff members have capacity to adjust based on changes in clinical acuity.",
//     "Discipline is provided in accordance with Rule 384; does not include threats/intimidation or physical repercussions to behavior; or is punitive in nature.",
//     "Milieu operations are structured, consistent and predictable to provide a balance of therapeutic, recreational, and educational activities, promoting skill development, social interaction, and emotional wellbeing.",
//     "The program utilizes the Reasonable and Prudent Parental Standard and "normalcy parenting" standards when determining youth's participation in extracurricular, enrichment, cultural and social activities offered by the child's school, family of origin and/or in the community.",
//     "Plans are in place to address the potential for unexpected circumstances (i.e. schedule changes, staff absence) that may arise in milieu operations.",
//     "Elements/principles of trauma informed practice are evident in milieu operations.",
//     "The program schedule provides programming to engage youth and support treatment progress; milieu staff are familiar with individual youth treatment goals and Behavior Treatment Plans; youth education plan or vocational programs are implemented; milieu staff support youth in completing school or vocational activities; Parallel programming is provided as needed to support the individualized needs of youth; milieu staff provide effective, goal-oriented, skill building and community groups according to the established schedule."
//   ],
    

//   references: [
//     "<strong>Relevant Rules and/or Procedures:</strong>",
//     'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900301&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//     'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900302&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">302</a>. Appendix K Support and Well-Being of Lesbian, Gay, Bisexual, Transgender, questioning/Queer, Intersex, and Asexual (LGBTQIA+) Children and Youth',
//     "Procedures 315.135 Other Required Casework Activities/ Reasonable and Prudent Parent Standard",
//     'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a> Significant Event Reporting',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900431&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">431</a> Confidentiality of Personal Information of Persons Served',
//     "Program Plans CFS-968",
//     "&nbsp;&nbsp;&nbsp;Section 4.0 Program Staff",
//     "&nbsp;&nbsp;&nbsp;Section 4.2 Minimum Staffing Expectation",
//     "&nbsp;&nbsp;&nbsp;Section 5.0 Service Parameters",
//     "&nbsp;&nbsp;&nbsp;Section 5.2.8 Therapeutic Residential (TR) Practice Principles",
//     "&nbsp;&nbsp;&nbsp;Section 5.2.7.7 Meaningful Family Engagement and Involvement"
//   ],
//     items: [
//       {
//         category: "Operations",
//         description:
//           "Rules and expectations are regularly reviewed and positively reinforced."
//       },
//       {
//         category: "Operations",
//         description:
//           "Regular meetings are scheduled to discuss youth behavior, including direct care staff from all shifts, case managers, therapists, and psychiatrists."
//       },
//       {
//         category: "Operations",
//         description:
//           "The minimum required staff-to-youth ratio is maintained, and there is a capacity to adjust based on changes in youth clinical acuity."
//       },
//       {
//         category: "Programming",
//         description:
//           "The milieu is structured, consistent, and predictable."
//       },
//       {
//         category: "Programming",
//         description:
//           "The milieu incorporates trauma-informed practice into milieu operations."
//       },
//       {
//         category: "Programming",
//         description:
//           "There is structured programming during weekdays and weekends, including days when school is not in session."
//       },
//       {
//         category: "Programming",
//         description:
//           "According to the established schedule, the milieu provides goal-oriented, skill-building community groups and therapeutic recreation."
//       },
//       {
//         category: "Programming",
//         description:
//           "The milieu integrates sensory integration/modulation activities and expressive therapies."
//       },
//       {
//         category: "Programming",
//         description:
//           "The milieu demonstrates awareness of and respect for race/ethnicity, culture, sexual orientation, and gender identity."
//       }
//     ]
//   },
//   {
//     id: "ps7",
//     title:
//       "<strong>PS7. Clinical Programs.</strong> Prescribed clinical services are provided by staff that holds the relevant degrees, licensures, and certifications.",
//     expectations: [
//       "An adequate array of clinical services is provided including individual, group and family counseling or therapy as well as non-traditional therapies (music, art, drama, etc.).",
//       "Psychiatric services are consistently provided and compliant with DCFS rules regarding prescription and administration of psychotropic medications.",
//       "Sensory integration/modulation activities (i.e. yoga, exercise, other physical activities) and expressive therapies (e.g. art, music) are incorporated into treatment modalities.",
//       "Treatment plans are individualized, problem-oriented, and consider the youth's strengths and goals. The program ensures that treatment plans include goals based on the youth's preferences and are written in language that is easy to understand."
//     ],
//   references: [
//     'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//     'Rule 325 Administration of Psychotropic Medications to Children for Whom the Department of Children and Family Services is Legally Responsible',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//     "Program Plans CFS-968",
//     "&nbsp;&nbsp;Section 1.4 Brief Description of Services Provided Under This DCFS Agreement",
//     "&nbsp;&nbsp;Section 4.0 Program Staff",
//     "&nbsp;&nbsp;Section 5.0 Service Parameters"
//   ],
//     items: [
//       {
//         category: "Elements",
//         description:
//           "Youth receive the individual, group, and family therapy outlined in their individual treatment plans."
//       },
//       {
//         category: "Elements",
//         description:
//           "Alternatives to talk therapy, such as ABA, music, art, and animal-assisted therapy are available when outlined in individual treatment plans."
//       },
//       {
//         category: "Elements",
//         description:
//           "Youth receive the psychiatry services outlined in their individual treatment plans."
//       },
//       {
//         category: "Credentials",
//         description:
//           "Individual, group, and family therapy is provided or supervised by a trained and/or credentialed therapist."
//       },
//       {
//         category: "Credentials",
//         description:
//           "Alternatives to talk therapy are provided or supervised by experienced therapists (credentials for these modalities do not always exist)."
//       },
//       {
//         category: "Credentials",
//         description:
//           "Psychotropic medications are prescribed and monitored by appropriately licensed staff."
//       }
//     ]
//   },
//   {
//     id: "ps8",
//     title:
//       "<strong>PS8. Management.</strong> Leadership and management practices demonstrate effective communication, governance, and operational management.",
//     expectations: [
//       "Adequate mechanisms exist to facilitate good communication, cooperation and consistency among staff members in implementing treatment plans, providing consistency of care, and maintaining youth and staff safety.",
//       "Leadership has the capacity to recruit and retain qualified professional and direct care staff. Turnover in administration, professional or direct service staff is not unusually high. There are adequate numbers of appropriately trained staff to meet program purpose and functions.",
//       "Leadership solicits and considers input from youth and staff; and implements governance systems to address internal/external feedback.",
//       "Program is managed by stable leadership team.",
//       "High risk situations or potential for high-risk situations are reported and there is transparency with information concerning youth in care.",
//       "Responses to monitoring concerns are timely and adequate.",
//       "There is a clearly defined leadership hierarchy with well-defined roles.",
//       "Executive management supports residential leaders.",
//       "There is strong clinical leadership that is integrated into all aspects of the program; opportunities for youth to prepare for successful discharge to a less restrictive setting (e.g., interaction with peers and adults, conflict resolution, skill building); and reinforcement of shared responsibility in collaboration with case management teams.",
//       "Administrative systems are dependable and consistent to assure development, review, and implementation of Agency Behavior Treatment Plan, and timely provision of thorough documentation of therapeutic services."
//     ],
//     references: [
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//   'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//   'Program Plan CFS-968:',
//   '&nbsp;&nbsp;&nbsp;&nbsp;Section 3.0 Certifications',
//   '&nbsp;&nbsp;&nbsp;&nbsp;Section 8.0 Client and Program Reporting',
//   '&nbsp;&nbsp;&nbsp;&nbsp;Section 9.0 Fiscal and Program Monitoring'
// ]
// ,
//     items: [
//   {
//     category: "Communication",
//     description:
//       "Adequate mechanisms are in place to facilitate effective communication, cooperation, and consistency among staff implementing treatment plans, providing care, and maintaining youth and staff safety."
//   },
//   {
//     category: "Communication",
//     description:
//       "Input from youth, their families, and child and family teams is solicited and considered."
//   },
//   {
//     category: "Communication",
//     description:
//       "High-risk or potentially high-risk situations are routinely and transparently reported to the Department (e.g., licensing, monitoring, caseworker, depending on what's appropriate)."
//   },
//   {
//     category: "Leadership",
//     description:
//       "There are clearly defined leadership hierarchy and roles."
//   },
//   {
//     category: "Leadership",
//     description:
//       "Executive management supports and guides its residential and clinical leaders with trauma informed practices."
//   },
//   {
//     category: "Leadership",
//     description:
//       "Clinical leadership is integrated into all aspects of the program."
//   },
//   {
//     category: "Management",
//     description:
//       "Qualified administrative, professional, and direct care staff are retained (e.g., turnover is not unusually high)."
//   },
//   {
//     category: "Management",
//     description:
//       "Agency behavior treatment plans and other policies are regularly reviewed."
//   },
//   {
//     category: "Management",
//     description:
//       "Internal governance includes involvement from the board of directors (or other advisory group)."
//   }
// ]

//   },
//   {
//   id: "ps9",
//   title:
//     "<strong>PS9. Quality Improvement Processes.</strong> A QI process that includes administrative systems and fosters a culture of improvement has been implemented and maintained.",
//   expectations: [
//     "Program has an environment/culture that supports continuous quality improvement.",
//     "QI plan addresses Performance Standards as outlined by the Provider and the Department; includes compliance with mandated reporting and significant event reports; and Department rule/procedures including Procedures 301.100 Therapeutic Residential Programs.",
//     "Data collected for the QI plan are shared with direct care and residential program leadership and contribute to leadership decisions about the program.",
//     "Staff demonstrate awareness of the Performance Standards, and other areas of improvement as identified in the QI plan.",
//     "There are improvement activities for Performance Standards; other identified areas of improvement to improve quality of services; and/or areas that require corrective action. Improvements are continuously occurring/evolving and are sustained.",
//     "The Quality Improvement Plan is implemented, reviewed and modified as needed.",
//     "Post discharge treatment outcomes for youth are monitored and included."
//   ],
//   references: [
//     'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a> Therapeutic Residential Programs',
//     'Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a> Significant Event Reporting',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900384&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">384</a> Behavior Treatment in Residential Child Care Facilities',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">403</a> Licensing Standards for Group Homes',
//     'Rule <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">404</a> Licensing Standards for Child Care Institutions and Maternity Centers',
//     "Program Plans CFS-968",
//     "&nbsp;&nbsp;o Section 2.0 General Delivery of Required Services",
//     "&nbsp;&nbsp;o Section 3.0 Certifications",
//     "&nbsp;&nbsp;o Section 8.0 Client and Program Reporting",
//     "&nbsp;&nbsp;o Section 9.0 Fiscal and Program Monitoring"
//   ],
//     items: [
//       {
//         category: "Administrative systems",
//         description: "There is compliance with mandated reporting responsibilities."
//       },
//       {
//   category: "Administrative systems",
//   description:
//     'SERs are comprehensive, accurately completed, and submitted promptly per Procedures <a href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900331&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES" target="_blank" rel="noopener noreferrer">331</a>.'
// },

//       {
//         category: "Administrative systems",
//         description:
//     'Procedures <a href="https://ilga.gov/commission/jcar/admincode/089/089003010A01000R.html" target="_blank" rel="noopener noreferrer">301.100</a>, including QRTP requirements, are followed, and other relevant department policies and procedures are implemented with sustained progress.'
//       },
//       {
//         category: "Culture of improvement",
//         description:
//           "The QI plan addresses previously identified key performance areas or desired growth/development areas."
//       },
//       {
//         category: "Culture of improvement",
//         description:
//           "The QI activities in key performance standard areas are implemented with sustained progress"
//       },
//       {
//         category: "Culture of improvement",
//         description:
//           "The QI plan evaluates the implementation and effectiveness of post-discharge services."
//       }
//     ]
//   }
];

const stripTags = (html) => html.replace(/<[^>]*>/g, "");

function ResidentialForm({ onClose, onSave, draftData }) {
  const [formData, setFormData] = useState({});
  const [scoreErrors, setScoreErrors] = useState({});
  const [dateError, setDateError] = useState("");
  // Generate Assessment ID immediately when form opens
  const [assessmentId] = useState(() => draftData?.id || `RES-${Date.now()}`);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);

  // Load draft data
  useEffect(() => {
    // Add beforeunload event listener for conditional save/discard
    const handleBeforeUnload = (event) => {
      if (!hasAnsweredQuestion) {
        // User hasn't answered any questions, discard the form
        console.log('🗑️ Residential: Discarding form on unload - no questions answered');
        const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
        localStorage.setItem('assessments', JSON.stringify(filteredAssessments));
        return;
      }
      
      // User has answered questions, auto-save
      if (hasAnsweredQuestion && Object.keys(formData).length > 0) {
        console.log('💾 Residential: Auto-saving before unload');
        const saveData = {
          id: assessmentId,
          contract_number: formData.contract_number || "N/A",
          status: "In-progress",
          createdBy: "Current User",
          assessment_date: formData.assessment_date || new Date().toISOString().split('T')[0],
          formData: formData,
          savedAt: new Date().toISOString()
        };
        
        try {
          const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
          const existingIndex = assessments.findIndex(a => a.id === assessmentId);
          if (existingIndex >= 0) {
            assessments[existingIndex] = saveData;
          } else {
            assessments.unshift(saveData);
          }
          localStorage.setItem('assessments', JSON.stringify(assessments));
        } catch (error) {
          console.error('Error saving before unload:', error);
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    if (draftData) {
      console.log('🔵 Residential: Loading draft data:', draftData);
      
      // Handle both 'data' field (from auto-save) and direct fields
      const formDataToLoad = draftData.data || draftData;
      
      if (formDataToLoad && Object.keys(formDataToLoad).length > 0) {
        console.log('🔵 Residential: Loading form data:', formDataToLoad);
        setFormData(formDataToLoad);
        
        // Check if user has answered questions in draft
        const hasAnswers = Object.entries(formDataToLoad).some(([key, value]) => {
          if (key === 'id' || key === 'status' || key === 'savedAt' || key === 'autoSaved') return false;
          return value && value.toString().trim() !== '';
        });
        if (hasAnswers) {
          setHasAnsweredQuestion(true);
        }
      }
      
      setIsSubmitted(draftData.status === 'Completed');
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [draftData]);

  // Auto-save immediately when formData changes
  useEffect(() => {
    if (isSubmitted) return; // Don't auto-save if already submitted
    
    // Auto-save with 2-second debounce when form data changes (only if user has answered questions)
    if (unsavedChanges && Object.keys(formData).length > 0 && hasAnsweredQuestion) {
      console.log('🟡 Residential: Scheduling immediate auto-save due to form changes');
      
      const autoSaveTimeout = setTimeout(() => {
        handleAutoSave();
      }, 2000); // 2 seconds instead of 30

      return () => clearTimeout(autoSaveTimeout);
    }
  }, [unsavedChanges, formData, isSubmitted, hasAnsweredQuestion]);

  const handleAutoSave = async () => {
    if (isSubmitted) return; // Don't auto-save if submitted
    
    console.log('🔵 Residential: Auto-saving form data:', formData);
    
    try {
      const saveData = {
        id: assessmentId,
        contract_number: formData.contract_number || 'N/A',
        provider: formData.provider || 'N/A',
        date: formData.date || new Date().toISOString().split('T')[0],
        status: 'In-progress',
        data: formData
      };

      if (onSave) {
        onSave(saveData);
        console.log('✅ Residential: Auto-save successful');
      }

      setLastSaved(new Date());
      setUnsavedChanges(false);
    } catch (error) {
      console.error('❌ Residential: Error auto-saving:', error);
    }
  };

  const updateField = (name, value) => {
    if (isSubmitted) return; // Prevent editing if submitted
    
    // Track that user has answered at least one question
    if (value && value.toString().trim() !== '') {
      const wasFirstAnswer = !hasAnsweredQuestion;
      setHasAnsweredQuestion(true);
      
      // Save to dashboard when first field is filled
      if (wasFirstAnswer && typeof onSave === 'function') {
        console.log('🟢 Residential: Saving to dashboard - first field filled');
        
        const saveData = {
          id: assessmentId,
          contract_number: name === 'contract_number' ? value : (formData.contract_number || "N/A"),
          status: "In-progress",
          createdBy: "Current User",
          assessment_date: name === 'assessment_date' ? value : (formData.assessment_date || new Date().toISOString().split('T')[0]),
          formData: { ...formData, [name]: value },
          autoSaved: true
        };
        
        onSave(saveData);
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUnsavedChanges(true);
  };

  const handleInputChange = (e) => {
    if (isSubmitted) return; // Prevent editing if submitted
    
    const { name, value } = e.target;

    if (
      name === "submitted_date" ||
      name === "approved_date" ||
      name === "rebuttal_date"
    ) {
      handleDateChange(name, value);
    } else {
      updateField(name, value);
    }
  };

  const handleDateChange = (name, value) => {
    if (isSubmitted) return; // Prevent editing if submitted
    
    const next = { ...formData, [name]: value };
    const submitted = next.submitted_date
      ? new Date(next.submitted_date)
      : null;
    const approved = next.approved_date ? new Date(next.approved_date) : null;
    const rebuttal = next.rebuttal_date ? new Date(next.rebuttal_date) : null;

    let err = "";

    if (submitted && approved && submitted > approved) {
      err = "Submitted Date must be before or equal to Approved Date.";
      next.approved_date = "";
    }

    if (rebuttal && submitted && rebuttal < submitted) {
      err = "Rebuttal Date must be after or equal to Submitted Date.";
      next.rebuttal_date = "";
    }

    if (name === "approved_date" && approved && !isNaN(approved)) {
      const exp = new Date(approved);
      exp.setDate(exp.getDate() + 2);
      next.rebuttal_expiration_date = exp.toISOString().split("T")[0];
    }

    setDateError(err);
    setFormData(next);
    setUnsavedChanges(true);
  };

  const handleScoreChange = (e) => {
    if (isSubmitted) return; // Prevent editing if submitted
    
    const { name, value } = e.target;
    const numeric =
      value === "" || Number.isNaN(Number(value)) ? "" : Number(value);

    let error = "";

    if (numeric === "" || numeric < 1 || numeric > 4) {
      error = "Score must be between 1 and 4";
    }

    setScoreErrors((prev) => ({ ...prev, [name]: error }));
    updateField(name, value);
  };

  const getSummaryScore = (psId) => {
    let total = 0;
    let count = 0;

    Object.entries(formData).forEach(([key, val]) => {
      if (key.startsWith(`${psId}_item`) && val !== "") {
        const num = Number(val);
        if (!Number.isNaN(num) && num >= 1 && num <= 4) {
          total += num;
          count++;
        }
      }
    });

    if (!count) return "";
    return Math.round(total / count);
  };

  // Scenario 2 (Next Step / QIP logic) is on hold.
  // If/when it's reinstated, reintroduce shouldShowNextStep here
  // and re-enable the QIP banner markup in the assessment items.

  const getCharCount = (name) => (formData[name] || "").length;

  const handleSaveDraft = async () => {
    if (isSubmitted) return; // Prevent saving if submitted
    
    setIsSaving(true);
    try {
      const saveData = {
        id: assessmentId,
        contract_number: formData.contract_number || 'N/A',
        provider: formData.provider || 'N/A',
        date: formData.date || new Date().toISOString().split('T')[0],
        status: 'In-progress',
        data: formData
      };

      if (onSave) {
        onSave(saveData);
      }

      setLastSaved(new Date());
      setUnsavedChanges(false);
      window.scrollTo(0, 0);
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitted) {
      alert("This assessment has already been submitted and cannot be edited.");
      return;
    }

    const hasScoreError = Object.values(scoreErrors).some(Boolean);
    if (hasScoreError) {
      alert("Please fix score errors before submitting.");
      return;
    }
    if (dateError) {
      alert("Please fix date errors before submitting.");
      return;
    }

    setIsSaving(true);
    try {
      const saveData = {
        id: assessmentId,
        contract_number: formData.contract_number || 'N/A',
        provider: formData.provider || 'N/A',
        date: formData.date || new Date().toISOString().split('T')[0],
        status: 'Completed',
        data: formData
      };

      if (onSave) {
        onSave(saveData);
      }

      setIsSubmitted(true);
      alert("Assessment submitted successfully! This form is now read-only.");
      setUnsavedChanges(false);
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!hasAnsweredQuestion) {
      // User hasn't answered any questions, discard the form
      console.log('🗑️ Residential: Discarding form - no questions answered');
      const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
      localStorage.setItem('assessments', JSON.stringify(filteredAssessments));
      if (onClose) onClose();
      window.location.reload();
      return;
    }
    
    if (unsavedChanges && !isSubmitted) {
      setShowUnsavedWarning(true);
    } else {
      if (onClose) onClose();
      window.location.reload();
    }
  };

  return (
    <div className="container">
      {/* Submitted Banner */}
      {isSubmitted && (
        <div style={{
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          borderRadius: '4px',
          padding: '12px 20px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#2e7d32'
        }}>
          ✓ This assessment has been submitted and is now read-only
        </div>
      )}



      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="dcfs-logo">
            <div>Illinois Department of</div>
            <div>DCFS</div>
            <div>Children &amp; Family Services</div>
          </div>
          <div className="header-titles">
            <h1>Residential Contract</h1>
            <h2>Performance Monitoring</h2>
          </div>
        </div>
        <div className="header-right">
          <h1>Performance Standard Report</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Info Section */}
        <div className="info-section">
          <div className="info-row">
            <label className="info-label">Date:</label>
            <input
              type="date"
              name="date"
              className="info-input"
              value={formData.date || ""}
              onChange={handleInputChange}
              required
              disabled={isSubmitted}
            />

            <label className="info-label">Contract#:</label>
            <input
              type="text"
              name="contract_number"
              className="info-input"
              value={formData.contract_number || ""}
              onChange={handleInputChange}
              required
              disabled={isSubmitted}
            />

            <label className="info-label">Provider:</label>
            <input
              type="text"
              name="provider"
              className="info-input"
              style={{ gridColumn: "span 3" }}
              value={formData.provider || ""}
              onChange={handleInputChange}
              required
              disabled={isSubmitted}
            />
          </div>

          <div className="info-row">
            <label className="info-label">Region:</label>
            <input
              type="text"
              name="region"
              className="info-input"
              style={{ width: "60px" }}
              value={formData.region || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Address:</label>
            <input
              type="text"
              name="address"
              className="info-input"
              style={{ gridColumn: "span 5" }}
              value={formData.address || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />
          </div>

          <div className="info-row">
            <label className="info-label">Capacity:</label>
            <input
              type="number"
              name="capacity"
              className="info-input"
              style={{ width: "80px" }}
              value={formData.capacity || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Census:</label>
            <input
              type="number"
              name="census"
              className="info-input"
              style={{ width: "80px" }}
              value={formData.census || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Rebuttal Expiration Date:</label>
            <input
              type="date"
              name="rebuttal_expiration_date"
              className="info-input"
              readOnly
              style={{ backgroundColor: "#f0f0f0" }}
              value={formData.rebuttal_expiration_date || ""}
              disabled={isSubmitted}
            />

            <label className="info-label">Unit(s):</label>
            <input
              type="text"
              name="units"
              className="info-input"
              value={formData.units || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />
          </div>

          <div className="info-row">
            <label className="info-label">Monitor:</label>
            <input
              type="text"
              name="monitor"
              className="info-input"
              value={formData.monitor || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Submitted Date:</label>
            <input
              type="date"
              name="submitted_date"
              className="info-input"
              value={formData.submitted_date || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Monitoring Supervisor:</label>
            <input
              type="text"
              name="monitoring_supervisor"
              className="info-input"
              value={formData.monitoring_supervisor || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Approved Date:</label>
            <input
              type="date"
              name="approved_date"
              className="info-input"
              value={formData.approved_date || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />
          </div>

          <div className="info-row">
            <label className="info-label"></label>
            <div></div>
            <label className="info-label"></label>
            <div></div>
            <label className="info-label"></label>
            <div></div>

            <label className="info-label">Rebuttal Date:</label>
            <input
              type="date"
              name="rebuttal_date"
              className="info-input"
              value={formData.rebuttal_date || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />
          </div>

          <div className="info-row">
            <label className="info-label">Monitoring Level:</label>
            <select
              name="monitoring_level"
              className="info-input"
              value={formData.monitoring_level || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            >
              <option value="">Select Level</option>
              <option value="Green">Green Level</option>
              <option value="Yellow">Yellow Level</option>
              <option value="Red">Red Level</option>
            </select>

            <label className="info-label">Monitoring Level Status:</label>
            <input
              type="text"
              name="monitoring_level_status"
              className="info-input"
              style={{ gridColumn: "span 3" }}
              value={formData.monitoring_level_status || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />

            <label className="info-label">Score:</label>
            <input
              type="number"
              name="overall_score"
              className="info-input"
              style={{ width: "60px" }}
              min="1"
              max="5"
              value={formData.overall_score || ""}
              onChange={handleInputChange}
              disabled={isSubmitted}
            />
          </div>

          {dateError && (
            <div style={{ color: "#e74c3c", marginTop: "5px" }}>{dateError}</div>
          )}
        </div>

        {/* Header Comment */}
        <div className="comment-section">
          <label>Comment:</label>
          <textarea
            name="header_comment"
            maxLength={4000}
            value={formData.header_comment || ""}
            onChange={handleInputChange}
            disabled={isSubmitted}
          />
        </div>

        {/* Summary Table */}
        <h3 className="summary-title">Performance Standard Summary</h3>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Performance Standard</th>
              <th>Intervention</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {performanceStandards.map((ps) => (
              <tr key={ps.id}>
                <td>{stripTags(ps.title)}</td>
                <td>
                  <input
                    type="text"
                    name={`${ps.id}_intervention`}
                    className="summary-input"
                    value={formData[`${ps.id}_intervention`] || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    readOnly
                    className="summary-score"
                    value={getSummaryScore(ps.id)}
                    disabled={isSubmitted}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Scoring Scale */}
        <div className="scoring-scale">
          <strong>Scoring Scale:</strong> Each Assessment Item requires a numeric
          score using a 4-point Likert scale:
          <ul>
            <li>
              <strong>1</strong> = Does Not Meet Standard
            </li>
            <li>
              <strong>2</strong> = Partially Meets Standard
            </li>
            <li>
              <strong>3</strong> = Meets Standard
            </li>
            <li>
              <strong>4</strong> = Exceeds Standard
            </li>
          </ul>
        </div>

        <div className="assessment-details-header">Assessment Details</div>

        {/* PS Sections */}
        <div id="performanceStandards">
          {performanceStandards.map((ps) => (
            <div key={ps.id} className="ps-section">
              <div
                className="ps-header"
                dangerouslySetInnerHTML={{ __html: ps.title }}
              />

             {/* Expectations */}
<div className="expectations">
  <h4><strong>Expectations:</strong></h4>
  <ol>
    {(ps.expectations || []).map((exp, idx) => {
      // CASE 1: Simple string line
      if (typeof exp === "string") {
        const match = exp.match(/^(\d+(\.\d+)*)\.\s*(.*)$/);
        if (!match) {
          return <li key={idx}>{exp}</li>;
        }
        const [, num, , rest] = match;
        return (
          <li key={idx}>
            <strong>{num}.</strong> {rest}
          </li>
        );
      }

      // CASE 2: Object with { text, subpoints }
      if (exp && typeof exp === "object") {
        const parentText = exp.text || "";
        const pm = parentText.match(/^(\d+(\.\d+)*)\.\s*(.*)$/);

        return (
          <li key={idx}>
            {pm ? (
              <>
                <strong>{pm[1]}.</strong> {pm[3]}
              </>
            ) : (
              parentText
            )}

            {Array.isArray(exp.subpoints) && exp.subpoints.length > 0 && (
              <ol className="subpoints">
                {exp.subpoints.map((sp, sIdx) => {
                  const spText = String(sp);
                  const sm = spText.match(/^(\d+(\.\d+)*)\.\s*(.*)$/);
                  return (
                    <li key={sIdx}>
                      {sm ? (
                        <>
                          <strong>{sm[1]}.</strong> {sm[3]}
                        </>
                      ) : (
                        spText
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        );
      }

      // Fallback: ignore anything unexpected
      return null;
    })}
  </ol>
</div>

{ps.id === "ps2" && (
  <p className="inline-rules">
    <strong>Relevant Rules and/or Procedures:</strong>
    &nbsp;Rule{" "}
    <a
      href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900404&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES"
      target="_blank"
      rel="noopener noreferrer"
    >
      404.38
    </a>{" "}
    for childcare institutions; Rule{" "}
    <a
      href="https://ilga.gov/agencies/JCAR/Sections?PartID=08900403&TitleDescription=TITLE%2089:%20%20SOCIAL%20SERVICES"
      target="_blank"
      rel="noopener noreferrer"
    >
      403.14
    </a>{" "}
    for group homes.
  </p>
)}


              <div className="references-box">
  <strong>Relevant Rules and/or Procedures:</strong>
  <ul className="references-list">
    {ps.references.map((ref, idx) => {
      const isSubItem = ref.includes('Section');
      return (
        <li
          key={idx}
          className={isSubItem ? 'sub-item' : 'main-item'}
          dangerouslySetInnerHTML={{ __html: ref }}
        />
      );
    })}
  </ul>
</div>


              {ps.items.map((item, index) => {
                const itemNum = index + 1;
                const scoreName = `${ps.id}_item${itemNum}_score`;
                const commentName = `${ps.id}_item${itemNum}_comment`;
                const rebuttalName = `${ps.id}_item${itemNum}_rebuttal`;

                  const text =
    // Case 1: item is a plain string (most of your questions)
    typeof item === "string"
      ? item
      // Case 2: item has a `label` field with the full exact text from the PDF
      : item.label
      ? item.label
      // Case 3: legacy shape with category + description
      : item.category
      ? `<strong>${item.category}:</strong> ${item.description}`
      // Fallback so we never show "undefined"
      : item.description || "";

                return (
                  <div className="assessment-item" key={itemNum}>
                    <div
                      className="item-number"
                      dangerouslySetInnerHTML={{
                        __html: `<strong>${itemNum}.</strong> ${text.replace(/^\d+\.\s*/, "")}`

                      }}
                    />

                    <div className="score-row">
                      <label className="required">
                        Assessment Item Score (1-4):
                      </label>
                      <input
                        type="number"
                        name={scoreName}
                        className={`${ps.id}-score score-input`}
                        min="1"
                        max="4"
                        value={formData[scoreName] || ""}
                        onChange={handleScoreChange}
                        required
                        disabled={isSubmitted}
                      />
                      {scoreErrors[scoreName] && (
                        <span className="validation-error">
                          {scoreErrors[scoreName]}
                        </span>
                      )}
                    </div>

                    {/* Scenario 2 (Next Step / QIP banner) is on hold.
                        Keeping markup commented so it can be re-enabled later. */}
                    {/*
                    <div
                      className={
                        "next-step-alert" +
                        (shouldShowNextStep(ps.id, scoreName)
                          ? " show"
                          : "")
                      }
                    >
                      Request Quality Improvement Plan (QIP)
                    </div>
                    */}

                    <div className="text-field">
                      <label>Comment:</label>
                      <textarea
                        name={commentName}
                        maxLength={4000}
                        value={formData[commentName] || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitted}
                      />
                      <div className="char-counter">
                        <span className="count">
                          {getCharCount(commentName)}
                        </span>
                        /4000
                      </div>
                    </div>

                    <div className="text-field">
                      <label>Rebuttal:</label>
                      <textarea
                        name={rebuttalName}
                        maxLength={4000}
                        value={formData[rebuttalName] || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitted}
                      />
                      <div className="char-counter">
                        <span className="count">
                          {getCharCount(rebuttalName)}
                        </span>
                        /4000
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Overall PS Comment */}
              <div className="overall-comment-section">
                <h3>Overall Performance Standard Comment</h3>

                <div className="text-field">
                  <label className="required">Situation:</label>
                  <div className="instruction">
                    *Briefly describe the current situation or issue that needs to be addressed
                  </div>
                  <textarea
                    name={`${ps.id}_situation`}
                    maxLength={4000}
                    required
                    value={formData[`${ps.id}_situation`] || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                  />
                  <div className="char-counter">
                    <span className="count">
                      {getCharCount(`${ps.id}_situation`)}
                    </span>
                    /4000
                  </div>
                </div>

                <div className="text-field">
                  <label className="required">Background:</label>
                  <div className="instruction">
                    *Clearly provide relevant background information that provides context for the situation, including any important details or previous actions taken
                  </div>
                  <textarea
                    name={`${ps.id}_background`}
                    maxLength={4000}
                    required
                    value={formData[`${ps.id}_background`] || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                  />
                  <div className="char-counter">
                    <span className="count">
                      {getCharCount(`${ps.id}_background`)}
                    </span>
                    /4000
                  </div>
                </div>

                <div className="text-field">
                  <label className="required">Assessment:</label>
                  <div className="instruction">
                    *State one's professional analysis and/or interpretation of the situation noting the potential impact and/or implications
                  </div>
                  <textarea
                    name={`${ps.id}_assessment`}
                    maxLength={4000}
                    required
                    value={formData[`${ps.id}_assessment`] || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                  />
                  <div className="char-counter">
                    <span className="count">
                      {getCharCount(`${ps.id}_assessment`)}
                    </span>
                    /4000
                  </div>
                </div>

                <div className="text-field">
                  <label className="required">Recommendation:</label>
                  <div className="instruction">
                    *Note the proposal course of action and/or solution to address the situation based off the assessment
                  </div>
                  <textarea
                    name={`${ps.id}_recommendation`}
                    maxLength={4000}
                    required
                    value={formData[`${ps.id}_recommendation`] || ""}
                    onChange={handleInputChange}
                    disabled={isSubmitted}
                  />
                  <div className="char-counter">
                    <span className="count">
                      {getCharCount(`${ps.id}_recommendation`)}
                    </span>
                    /4000
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="submit-section">
          {!isSubmitted && (
            <>
              <button 
                type="button"
                className="btn-draft"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save size={20} />
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSaving}
              >
                <Save size={20} />
                {isSaving ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      </form>
      
      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3>Unsaved Changes</h3>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowUnsavedWarning(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowUnsavedWarning(false);
                  if (onClose) onClose();
                  window.location.reload();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentialForm;
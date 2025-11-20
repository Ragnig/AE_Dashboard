import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import './FAREQuestionnaire.css';
//import { fareApi } from './services/fareApi';
//import { fareApi } from './services/fareApi';

const QUESTIONS = [
  {
    id: 'clinical_exception',
    section: 1,
    text: 'Was DCFS Clinical or child\'s therapist consulted for an exception to completing the FARE for this youth\'s move and did DCFS Clinical or child\'s therapist approve a clinical exception? If yes, please provide contact information and date of the exception consultation in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        endInterview: true,
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'child_refusal',
    section: 2,
    text: 'Did the child refuse to complete the questionnaire? If yes, please provide the date and time the questionnaire was attempted in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        endInterview: true,
        allowYouthComment: true,
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: '14day_notice',
    section: 3,
    text: 'Was this move a result of 14-Day Notice? If yes, please indicate in text box if foster parent provided notice and date or if the agency issued notice of decision and date notice of decision provided to the foster parent in text box.',
    category: 'HB4304 FARE contraindicators',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'prepared_food',
    section: 4,
    text: 'Who prepared food for you while you were in the home?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Foster Parent', 
        value: 'Foster Parent',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Child', 
        value: 'Child',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Other Household Member', 
        value: 'Other Household Member',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Non-Household Member', 
        value: 'Non-Household Member',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'sufficient_food_5A',
    section: 5,
    subsection: 'A',
    text: 'Was there sufficient food while you were in the home?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      {
        text: 'Yes',
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      {
        text: 'No',
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'sufficient_food_5B',
    section: 5,
    subsection: 'B',
    text: 'Did you get enough to eat? If no, please indicate youth\s response in text box',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      {
        text: 'Yes',
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      {
        text: 'No',
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'approp_clothing',
    section: 6,
    text: 'Did you have enough clothing while you were in the home that was appropriate for the weather?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'own_bed',
    section: 7,
    text: 'Did you have your own bed? If no, please indicate youth\s response on whom occupied the bed with  them in the youth\s text box.',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'child_roommate',
    section: 8,
    text: 'Did anyone else sleep in your room? If yes, please indicate youth\'s response in text box.',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - Age Appropriate roommate', 
        value: 'Yes - Age Appropriate roommate',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - Adult or improper roommate', 
        value: 'Yes - Adult or improper roommate',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'approp_supervision',
    section: 9,
    text: 'Did you have supervision appropriate to your age and special needs while you were in the home?',
    category: 'Basic Needs',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'school_enrollment',
    section: 10,
    text: 'Did you attend school while you were in the home?',
    category: 'Education',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session', 
        value: 'Not Applicable - School not in session',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'homework_help',
    section: 11,
    text: 'Did you receive the support you needed to complete your schoolwork while you were in the home?',
    category: 'Education',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session', 
        value: 'Not Applicable - School not in session',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'caseworker_access',
    section: 12,
    text: 'Did you have access to your caseworker while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'therapist_access',
    section: 13,
    text: 'Did you have access to your therapist while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'gal_access',
    section: 14,
    text: 'Did you request to see or talk to your court-appointed representative (GAL, attorney, etc.) while you were in the home?',
    category: 'Access to Support',
    multiSelect: true,
    options: [
      { 
        text: 'Yes - In Person', 
        value: 'Yes - In Person',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Phone', 
        value: 'Yes - By Phone',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Email', 
        value: 'Yes - By Email',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yes - By Video Chat or Instant Messaging', 
        value: 'Yes - By Video Chat or Instant Messaging',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'feel_safe',
    section: 15,
    text: 'Did you feel safe in the home? If the child answers no, interviewers shall ask additional questions to elicit additional responses. For example, if a child responds that they didn\'t feel safe, after asking why and receiving one response, the interviewer should prompt with, "Was there anything else that made you not feel safe." The prompts should continue until the child states what made them feel unsafe?',
    category: 'Safety and Well-being',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_accepting',
    section: 16,
    text: 'Were there things that the foster parent did that made you feel good about yourself (e.g., race/ethnicity, culture, gender/sexual identity)?',
    category: 'Safety and Well-being',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'happy_event',
    section: 17,
    text: 'Did anything happen that made you happy?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'scary_event',
    section: 18,
    text: 'Did anything happen that was scary?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'sad_event',
    section: 19,
    text: 'Did anything happen that made you sad?',
    category: 'Emotional Experiences',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'discipline_type',
    section: 20,
    text: 'What happened when you did something you should not have done?',
    category: 'Discipline and Recognition',
    multiSelect: true,
    options: [
      { 
        text: 'Time Out', 
        value: 'Time Out',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Lost Privileges', 
        value: 'Lost Privileges',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Corporal Punishment', 
        value: 'Corporal Punishment',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Yelling/Shouting', 
        value: 'Yelling/Shouting',
        potentialViolation: true,
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'recognize_good',
    section: 21,
    text: 'Did the family recognize the good things that you did?',
    category: 'Discipline and Recognition',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable', 
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'family_origin',
    section: 22,
    text: 'Did the foster parent act/talk positively about your family of origin including parents and siblings (if applicable)?',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_support_prmgoal',
    section: 23,
    text: 'Was your foster parent supportive of your permanency goal?',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        potentialViolation: true,
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'family_inclusion',
    section: 24,
    text: 'Did you feel included in the family? If yes, what things made you feel included? If no, what things made you feel like you were not included?\nChild\'s responses captured in text box below:',
    category: 'Family Relationships',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        requireYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'extra_activities',
    section: 25,
    text: 'Did you participate in extracurricular activities?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_cftm_participation',
    section: 26,
    text: 'Did your Foster Parent participate in CFTMs?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'fp_school_participation',
    section: 27,
    text: 'Did your Foster Parent participate in School Meetings?',
    category: 'Participation and Engagement',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No',
        allowYouthComment: true,
        allowInterviewerComment: true
      },
      { 
        text: 'Not Applicable - School not in session',
        value: 'Not Applicable',
        allowYouthComment: true,
        allowInterviewerComment: true
      }
    ]
  },
  {
    id: 'child_openend',
    section: 28,
    text: 'Is there anything else you think other children or adults should know about the home? If yes, provide answer in text box.',
    category: 'Additional Information',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        allowYouthComment: true,
        requireYouthComment: true,
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  },
  {
    id: 'scr_report',
    section: 29,
    text: 'Does the interviewer have any observations or any information relevant to understanding the child\'s responses? If so, please record on the interview form below',
    category: 'Additional Information',
    multiSelect: true,
    options: [
      { 
        text: 'Yes', 
        value: 'Yes',
        potentialViolation: true,
        allowInterviewerComment: true,
        requireInterviewerComment: true
      },
      { 
        text: 'No', 
        value: 'No'
      }
    ]
  }
];

export default function FAREQuestionnaire({ onSave, draftData }) {
  const [formData, setFormData] = useState({});
  const [effectiveDate, setEffectiveDate] = useState('');
  const [description, setDescription] = useState('');
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [endedReason, setEndedReason] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [proceedBlocked, setProceedBlocked] = useState({});
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showEndInterviewWarning, setShowEndInterviewWarning] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [caseWorkerName, setCaseWorkerName] = useState('');
  const [name, setName] = useState('');
  const [assessmentDate, setAssessmentDate] = useState('');
  const [childName, setChildName] = useState('');
  const [dob, setDob] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  //const [assessmentId, setAssessmentId] = useState(null);
  const [assessmentId] = useState(`FARE-${Date.now()}`);
  const [isSaving, setIsSaving] = useState(false);
  const [showMissedQuestionsModal, setShowMissedQuestionsModal] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState([]);
  // Load draft data when component opens
useEffect(() => {
  console.log('=== FARE DRAFT DEBUG ===');
  console.log('1. Full draftData:', draftData);
  console.log('2. draftData.overview:', draftData?.overview);
  console.log('3. draftData.overview.caseId:', draftData?.overview?.caseId);
  
  if (draftData) {
    console.log('4. Setting caseId to:', draftData.overview?.caseId);
    setCaseId(draftData.overview?.caseId || '');
    setChildName(draftData.overview?.childName || '');
    setDob(draftData.overview?.dob || '');
    setCaregiverName(draftData.overview?.caregiverName || '');
    setCaseWorkerName(draftData.overview?.caseWorkerName || '');
    setDateCompleted(draftData.overview?.dateCompleted || '');
    
    if (draftData.answers) {
      console.log('5. Loading answers:', draftData.answers);
      setFormData(draftData.answers);
    }
  } else {
    console.log('❌ No draftData received');
  }
}, [draftData]);

  const handleOptionChange = (questionId, value) => {
    // Find the current question index
    const currentQuestionIndex = QUESTIONS.findIndex(q => q.id === questionId);
    
    // Check if all previous questions have been answered (except if interview ended)
    if (!interviewEnded) {
      const unansweredQuestions = [];
      for (let i = 0; i < currentQuestionIndex; i++) {
        const prevQuestion = QUESTIONS[i];
        const prevQuestionData = formData[prevQuestion.id];
        
        // Check if this previous question has any responses
        if (!prevQuestionData || !prevQuestionData.responses || prevQuestionData.responses.length === 0) {
          unansweredQuestions.push({
            section: prevQuestion.section,
            id: prevQuestion.id,
            text: prevQuestion.text.length > 80 ? prevQuestion.text.substring(0, 80) + '...' : prevQuestion.text
          });
        }
      }
      
      // If there are unanswered questions, show modal and prevent selection
      if (unansweredQuestions.length > 0) {
        setMissedQuestions(unansweredQuestions);
        setShowMissedQuestionsModal(true);
        return; // Prevent the selection
      }
    }
    
    const current = formData[questionId]?.responses || [];
    
    const isExclusiveOption = value === 'No' || value === 'Not Applicable' || value.includes('Not Applicable');
    const hasExclusiveOption = current.some(v => 
      v === 'No' || v === 'Not Applicable' || v.includes('Not Applicable')
    );
    
    let updated;
    
    if (isExclusiveOption) {
      if (current.includes(value)) {
        updated = [];
      } else {
        updated = [value];
      }
    } else {
      if (hasExclusiveOption) {
        updated = [value];
      } else {
        if (current.includes(value)) {
          updated = current.filter(v => v !== value);
        } else {
          updated = [...current, value];
        }
      }
    }
    
    // Find the question and option to get pre-configured settings
    const question = QUESTIONS.find(q => q.id === questionId);
    const option = question?.options.find(o => o.value === value);
    
    // Use pre-configured settings from the question definition
    const optionSettings = option ? {
      endInterview: option.endInterview || false,
      potentialViolation: option.potentialViolation || false,
      allowYouthComment: option.allowYouthComment || false,
      requireYouthComment: option.requireYouthComment || false,
      allowInterviewerComment: option.allowInterviewerComment || false,
      requireInterviewerComment: option.requireInterviewerComment || false
    } : {};
    
    // *** FIX: Check if we're CHANGING FROM an endInterview option to a non-endInterview option ***
    const currentlyHasEndInterviewOption = current.some(val => {
      const opt = question?.options.find(o => o.value === val);
      return opt?.endInterview;
    });
    
    const newWillHaveEndInterviewOption = updated.some(val => {
      const opt = question?.options.find(o => o.value === val);
      return opt?.endInterview;
    });
    
    // If we HAD an endInterview option selected, and NOW we DON'T (changing from Yes to No)
    // We need to reset the interview state and KEEP questions locked for sequential answering
    if (currentlyHasEndInterviewOption && !newWillHaveEndInterviewOption && (questionId === 'clinical_exception' || questionId === 'child_refusal')) {
      // Clear all responses EXCEPT Question 1 and Question 2
      const clearedData = {};
      
      // Keep Question 1 response if it exists and we're not currently editing it
      if (formData['clinical_exception'] && questionId !== 'clinical_exception') {
        clearedData['clinical_exception'] = formData['clinical_exception'];
      }
      
      // Keep Question 2 response if it exists and we're not currently editing it
      if (formData['child_refusal'] && questionId !== 'child_refusal') {
        clearedData['child_refusal'] = formData['child_refusal'];
      }
      
      // Add the current question's new response with the updated value
      if (updated.length > 0) {
        clearedData[questionId] = {
          responses: updated,
          options: {
            [value]: {
              ...optionSettings,
              youthComment: '',
              interviewerComment: ''
            }
          }
        };
      } else {
        // If unchecking everything, just set empty responses
        clearedData[questionId] = {
          responses: [],
          options: {}
        };
      }
      
      // Reset the form data
      setFormData(clearedData);
      
      // Reset interview state
      setInterviewEnded(false);
      setEndedReason('');
      
      // Clear any proceed blocks
      setProceedBlocked({});
      
      // Mark unsaved changes
      setUnsavedChanges(true);
      
      return; // Exit early
    }
    
    // *** FIX: Reset interview state when unchecking all options on Question 1 or 2 ***
    if (updated.length === 0 && (questionId === 'clinical_exception' || questionId === 'child_refusal')) {
      // Clear all responses after this question
      const clearedData = {};
      
      // Keep Question 1 if we're working on Question 2
      if (questionId === 'child_refusal' && formData['clinical_exception']) {
        clearedData['clinical_exception'] = formData['clinical_exception'];
      }
      
      // Keep Question 2 if we're working on Question 1
      if (questionId === 'clinical_exception' && formData['child_refusal']) {
        clearedData['child_refusal'] = formData['child_refusal'];
      }
      
      // Set current question as empty
      clearedData[questionId] = {
        responses: [],
        options: {}
      };
      
      setFormData(clearedData);
      setInterviewEnded(false);
      setEndedReason('');
      setProceedBlocked({});
      setUnsavedChanges(true);
      
      return;
    }
    
    // Check if this option ends the interview and CLEAR ALL OTHER RESPONSES
    if (optionSettings.endInterview && !current.includes(value)) {
      // PRESERVE Question 1 and Question 2 responses, CLEAR ALL OTHERS
      const clearedData = {};
      
      // Keep Question 1 response if it exists
      if (formData['clinical_exception']) {
        clearedData['clinical_exception'] = formData['clinical_exception'];
      }
      
      // Keep Question 2 response if it exists
      if (formData['child_refusal']) {
        clearedData['child_refusal'] = formData['child_refusal'];
      }
      
      // Add the current question's new response (will be either Q1 or Q2)
      clearedData[questionId] = {
        responses: [value],
        options: {
          [value]: {
            ...optionSettings,
            youthComment: '',
            interviewerComment: ''
          }
        }
      };
      
      // Replace ALL formData with only Questions 1, 2, and current
      setFormData(clearedData);
      
      // Clear any proceed blocks
      setProceedBlocked({});
      
      // End the interview immediately
      setInterviewEnded(true);
      setEndedReason(`Interview ended by rule: Question ${question.section} - Selected "${value}"`);
      
      // Mark unsaved changes
      setUnsavedChanges(true);
      
      // Show warning modal
      setTimeout(() => {
        setShowEndInterviewWarning(true);
      }, 100);
      
      return; // Exit early since we're ending the interview
    }
    
    // Clear comments for deselected options
    const newOptions = {...(formData[questionId]?.options || {})};
    
    // If we're replacing with an exclusive option, clear all previous options' comments
    if (isExclusiveOption && !current.includes(value)) {
      current.forEach(oldValue => {
        if (newOptions[oldValue]) {
          delete newOptions[oldValue];
        }
      });
    }
    
    // If we're removing an exclusive option to add regular options, clear the exclusive option's comments
    if (hasExclusiveOption && !isExclusiveOption) {
      current.forEach(oldValue => {
        if (oldValue === 'No' || oldValue === 'Not Applicable' || oldValue.includes('Not Applicable')) {
          if (newOptions[oldValue]) {
            delete newOptions[oldValue];
          }
        }
      });
    }
    
    // If unchecking this option, remove its comments
    if (current.includes(value) && updated.length < current.length) {
      if (newOptions[value]) {
        delete newOptions[value];
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        responses: updated,
        options: {
          ...newOptions,
          ...(updated.includes(value) ? {
            [value]: {
              ...newOptions[value],
              ...optionSettings
            }
          } : {})
        }
      }
    }));

    // Mark unsaved changes
    setUnsavedChanges(true);
    
    // Check if required comments will be needed
    if (optionSettings.requireYouthComment || optionSettings.requireInterviewerComment) {
      setProceedBlocked(prev => ({...prev, [questionId]: true}));
    } else if (updated.length === 0) {
      setProceedBlocked(prev => {
        const newBlocked = {...prev};
        delete newBlocked[questionId];
        return newBlocked;
      });
    }
  };

  const handleEndInterview = (questionId, value, questionText) => {
    setInterviewEnded(true);
    setEndedReason(`Interview ended by rule: Question "${questionText}" - Selected "${value}"`);
    setUnsavedChanges(true);
  };

  const handleCheckboxChange = (questionId, optionValue, field) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        options: {
          ...prev[questionId]?.options,
          [optionValue]: {
            ...prev[questionId]?.options?.[optionValue],
            [field]: !prev[questionId]?.options?.[optionValue]?.[field]
          }
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const handleTextChange = (questionId, optionValue, field, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        options: {
          ...prev[questionId]?.options,
          [optionValue]: {
            ...prev[questionId]?.options?.[optionValue],
            [field]: value
          }
        }
      }
    }));
    setUnsavedChanges(true);
    
    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = {...prev};
      const errorKey = `${questionId}-${optionValue}-${field}`;
      delete newErrors[errorKey];
      return newErrors;
    });
    
    // Check if all required comments are now filled for this question
    setTimeout(() => {
      const errors = validateCurrentQuestion(questionId);
      if (errors.length === 0) {
        setProceedBlocked(prev => {
          const newBlocked = {...prev};
          delete newBlocked[questionId];
          return newBlocked;
        });
      }
    }, 0);
  };

  const validateCurrentQuestion = (questionId) => {
    const errors = [];
    const questionData = formData[questionId];
    
    if (questionData?.responses) {
      questionData.responses.forEach(response => {
        const optionData = questionData.options?.[response];
        if (optionData) {
          // Check required youth comment
          if (optionData.requireYouthComment && !optionData.youthComment?.trim()) {
            errors.push(`Youth Comment is required for this selection`);
          }
          
          // Check required interviewer comment
          if (optionData.requireInterviewerComment && !optionData.interviewerComment?.trim()) {
            errors.push(`Interviewer Comment is required for this selection`);
          }
        }
      });
    }
    
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    
    QUESTIONS.forEach(question => {
      const questionData = formData[question.id];
      if (questionData?.responses) {
        questionData.responses.forEach(response => {
          const optionData = questionData.options?.[response];
          if (optionData) {
            // Check required youth comment
            if (optionData.requireYouthComment && !optionData.youthComment?.trim()) {
              errors[`${question.id}-${response}-youthComment`] = {
                message: `Youth Comment is required for Question ${question.section}: ${response}`,
                questionId: question.id,
                section: question.section
              };
            }
            
            // Check required interviewer comment
            if (optionData.requireInterviewerComment && !optionData.interviewerComment?.trim()) {
              errors[`${question.id}-${response}-interviewerComment`] = {
                message: `Interviewer Comment is required for Question ${question.section}: ${response}`,
                questionId: question.id,
                section: question.section
              };
            }
          }
        });
      }
    });
    
    return errors;
  };

  const scrollToQuestion = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a highlight effect
      element.style.transition = 'all 0.3s ease';
      element.style.backgroundColor = '#FEF3C7';
      element.style.boxShadow = '0 0 0 4px #FCD34D';
      
      setTimeout(() => {
        element.style.backgroundColor = '';
        element.style.boxShadow = '';
      }, 2000);
    }
  };

  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    
    // Scroll to the first question with errors
    const firstError = Object.values(validationErrors)[0];
    if (firstError && firstError.questionId) {
      setTimeout(() => {
        scrollToQuestion(firstError.questionId);
      }, 300);
    }
  };

  const checkForEndInterviewOptions = () => {
    let endInterviewInfo = null;
    
    QUESTIONS.forEach(question => {
      const questionData = formData[question.id];
      if (questionData?.responses) {
        questionData.responses.forEach(response => {
          const optionData = questionData.options?.[response];
          if (optionData?.endInterview) {
            endInterviewInfo = {
              questionId: question.id,
              questionSection: question.section,
              questionText: question.text,
              response: response
            };
          }
        });
      }
    });
    
    return endInterviewInfo;
  };

  const getPotentialViolations = () => {
    const violations = [];
    
    QUESTIONS.forEach(question => {
      const questionData = formData[question.id];
      if (questionData?.responses) {
        questionData.responses.forEach(response => {
          const optionData = questionData.options?.[response];
          if (optionData?.potentialViolation) {
            violations.push({
              questionId: question.id,
              questionSection: question.section,
              questionText: question.text,
              response: response,
              youthComment: optionData.youthComment,
              interviewerComment: optionData.interviewerComment
            });
          }
        });
      }
    });
    
    return violations;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const saveData = {
        id: assessmentId,
        caseId,
        childName,
        dob,
        caregiverName,
        caseWorkerName,
        dateCompleted,
        status: 'draft',
        formData,
        interviewEnded,
        endedReason: interviewEnded ? endedReason : null,
        potentialViolations: getPotentialViolations()
      };

    //   const response = await fareApi.saveAssessment(saveData);
      
    //   if (!assessmentId) {
    //     setAssessmentId(response.id);
    //   }

      alert('Draft saved successfully! You can continue editing later.');
      setUnsavedChanges(false);
      // Send to dashboard
if (onSave) {
  onSave({
    id: assessmentId,
    caseId: caseId || 'N/A',
    caseName: childName || 'N/A',
    overview: {
      caseId,
      childName,
      dob,
      caregiverName,
      caseWorkerName,
      dateCompleted
    },
    answers: formData,
    status: 'Draft',
    savedAt: new Date().toISOString()
  });
}
      
      // Scroll to top before refresh
      window.scrollTo(0, 0);
      
      // Refresh the page to reset the form
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalize = async () => {
    // *** FIX: Add validation for empty responses ***
    // Check if at least Question 1 is answered
    if (!formData['clinical_exception']?.responses || formData['clinical_exception'].responses.length === 0) {
      alert('Please answer Question 1 before submitting.');
      scrollToQuestion('clinical_exception');
      return;
    }
    
    // If interview NOT ended, check if Question 2 is answered
    if (!interviewEnded) {
      if (!formData['child_refusal']?.responses || formData['child_refusal'].responses.length === 0) {
        alert('Please answer Question 2 before submitting.');
        scrollToQuestion('child_refusal');
        return;
      }
      
      // Check if all required questions have responses
      const unansweredRequired = [];
      QUESTIONS.forEach(q => {
        if (!formData[q.id]?.responses || formData[q.id].responses.length === 0) {
          unansweredRequired.push({
            section: q.section,
            text: q.text
          });
        }
      });
      
      if (unansweredRequired.length > 0) {
        alert(`Please answer all questions before submitting. Missing ${unansweredRequired.length} question(s).`);
        scrollToQuestion(QUESTIONS.find(q => 
          !formData[q.id]?.responses || formData[q.id].responses.length === 0
        )?.id);
        return;
      }
    }
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }
    
    const endInterviewInfo = checkForEndInterviewOptions();
    
    if (endInterviewInfo && !interviewEnded) {
      const confirmed = window.confirm(
        `This assessment contains a response that will end the interview:\n\n` +
        `Question ${endInterviewInfo.questionSection}: ${endInterviewInfo.questionText}\n` +
        `Selected: ${endInterviewInfo.response}\n\n` +
        `Do you want to finalize this assessment as an ended interview?`
      );
      
      if (!confirmed) {
        return;
      }
      
      setInterviewEnded(true);
      setEndedReason(
        `Interview ended by rule: Question ${endInterviewInfo.questionSection} - Selected "${endInterviewInfo.response}"`
      );
    }
    
    setIsSaving(true);
    try {
      const saveData = {
        id: assessmentId,
        caseId,
        childName,
        dob,
        caregiverName,
        caseWorkerName,
        dateCompleted,
        status: endInterviewInfo ? 'ended' : 'completed',
        formData,
        interviewEnded: endInterviewInfo ? true : interviewEnded,
        endedReason: endInterviewInfo 
          ? `Interview ended by rule: Question ${endInterviewInfo.questionSection} - Selected "${endInterviewInfo.response}"`
          : (interviewEnded ? endedReason : null),
        potentialViolations: getPotentialViolations()
      };
      
      await fareApi.saveAssessment(saveData);
      
      alert(
        `Assessment finalized successfully!\n` +
        `Status: ${saveData.status}\n` +
        `${saveData.status === 'ended' ? `Reason: ${saveData.endedReason}` : ''}`
      );
      setUnsavedChanges(false);
      // Send to dashboard
if (onSave) {
  onSave({
    id: assessmentId,
    caseId: caseId || 'N/A',
    caseName: childName || 'N/A',
    overview: {
      caseId,
      childName,
      dob,
      caregiverName,
      caseWorkerName,
      dateCompleted
    },
    answers: formData,
    status: 'Completed',
    savedAt: new Date().toISOString()
  });
}
      
      if (endInterviewInfo) {
        setInterviewEnded(true);
        setEndedReason(saveData.endedReason);
      }
      
      // Scroll to top before refresh
      window.scrollTo(0, 0);
      
      // Refresh the page to reset the form
      window.location.reload();
      
    } catch (error) {
      console.error('Error finalizing assessment:', error);
      alert('Failed to finalize assessment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    handleSaveDraft();
  };

  return (
    <div className="fare-container">
      <div className="fare-wrapper">
        {/* Header */}
        <div className="fare-header">
          <div className="fare-header-top">
            <div className="fare-header-left">
              <div className="dcfs-logo">
                <div className="dcfs-text">Illinois Department of</div>
                <div className="dcfs-main">DCFS</div>
                <div className="dcfs-subtitle">Children & Family Services</div>
              </div>
              <div className="fare-title-section">
                <span className="fare-title">F.A.R.E</span>
              </div>
            </div>
            <div className="fare-header-right">
              <div className="questionnaire-heading">Questionnaire</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px', gap: '0' }}>
            {/* Row 1 (3 columns) */}
            <div className="fare-header-bottom" style={{ display: 'flex', gap: '24px', marginTop: '0' }}>
              {/* Case ID */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '100px' }}>
                    Case ID
                  </label>
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                    placeholder="Enter Case ID..."
                  />
                </div>
              </div>

              {/* Child Name */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '100px' }}>
                    Child Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                    placeholder="Enter Child Name..."
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '100px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 (3 columns) */}
            <div className="fare-header-bottom" style={{ display: 'flex', gap: '24px', marginTop: '0' }}>
              {/* Caregiver's Name */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '120px' }}>
                    Caregiver's Name
                  </label>
                  <input
                    type="text"
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                    placeholder="Enter Caregiver Name..."
                  />
                </div>
              </div>

              {/* Case Worker's Name */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '120px' }}>
                    Case Worker's Name
                  </label>
                  <input
                    type="text"
                    value={caseWorkerName}
                    onChange={(e) => setCaseWorkerName(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                    placeholder="Enter Case Worker Name..."
                  />
                </div>
              </div>

              {/* Date Completed */}
              <div className="fare-header-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', color: '#111827', fontWeight: '500', minWidth: '100px' }}>
                    Date Completed
                  </label>
                  <input
                    type="date"
                    value={dateCompleted}
                    onChange={(e) => setDateCompleted(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#111827',
                      backgroundColor: 'white',
                      flex: 1,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interview Ended Banner */}
          {interviewEnded && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#FEE2E2',
              border: '2px solid #DC2626',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H22L12 2Z" fill="#DC2626"/>
                <path d="M12 9V13M12 16V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#7F1D1D', marginBottom: '4px' }}>
                  Interview Ended
                </div>
                <div style={{ fontSize: '13px', color: '#991B1B' }}>
                  {endedReason}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Guide Information */}
        <div className="guide-section">
          <h2 className="guide-title">GUIDE TO COMPLETING FOSTER CARE RATING AT EXIT INTERVIEW (F.A.R.E)</h2>
          
          <div className="guide-content">
            <h3 className="guide-subtitle">GENERAL INFORMATION AND GUIDELINES</h3>
            
            <p className="guide-text">
              The F.A.R.E. questionnaire can be accessed through F.A.R.E. portal at{' '}
              <a href="http://fare.dcfs.illinois.gov" target="_blank" rel="noopener noreferrer" className="guide-link">
                http://fare.dcfs.illinois.gov
              </a>. The F.A.R.E. questionnaire must be completed within 5 business days from the date of the youth's move.
            </p>

            <p className="guide-text">
              F.A.R.E are to be conducted by an assigned case worker, supervisor or investigator moving a youth while in an on-call
              status, after a child in an eligible living arrangement code, age five and older, has exited an unlicensed or licensed foster
              home, unless clinically contraindicated as determined through consultation with DCFS Clinical Division. In addition, the
              child must have resided in the home for 30 or more days to be eligible for a F.A.R.E. If a child has resided in the foster
              home less than 30 days, a F.A.R.E. does not need to be completed.
            </p>

            <p className="guide-text">
              On a rare occasion, the interview may be conducted by a member of the Clinical Division or youth's therapist. These
              requirements are outlined in HB4304.
            </p>

            <p className="guide-text">
              If an interviewer needs to request consultation with the DCFS Clinical Division, the interviewer should complete a CFS
              399-1 (Clinical Referral Form). When consultation is required, a CFS 399-1 must be completed within one business day.
              The worker should check the reason for Clinical consultation as F.A.R.E. and submit the CFS 399-1 to{' '}
              <a href="mailto:DCFS.Clincalref@illinois.gov" className="guide-link">
                DCFS.Clincalref@illinois.gov
              </a>{' '}
              via DCFS Outlook.
            </p>

            <div className="guide-important">
              <strong>Important:</strong> The assigned DCFS Clinical staff must complete the consultation within 2 business days, document recommendation to
              exclude or not exclude youth's move from F.A.R.E. The completed 399-1 will be emailed to the assigned caseworker via
              DCFS Outlook. It is then the caseworker's responsibility to enter the F.A.R.E database that DCFS clinical consulted (Y/N)
              Exception Approved by DCFS Clinical (Y/N) and upload the 399-1 in to F.A.R.E. electronic platform.
            </div>

            <p className="guide-text">
              Although a youth's move may fall into an exclusionary criterion, the worker and/or supervisor can decide to complete
              the F.A.R.E based on individual youth circumstance.
            </p>

            <p className="guide-text">
              If the move is as a result of a verbal or written 14-Day Notice, this should be documented when completing the F.A.R.E.
            </p>

            <p className="guide-text">
              The F.A.R.E interview will assess areas of basic need, safety and comfort in the home, access to caseworker, therapist,
              and GAL and normalcy. While these questions about the child's experience in the foster home are important, it is
              important to remember that they may be difficult questions for the child to answer.
            </p>

            <h3 className="guide-subtitle">Exempt Living Arrangement Codes</h3>
            <p className="guide-text">
              If a child moves to one of the following living arrangement codes, the child is exempt from F.A.R.E: 
              (Note, any other exemptions, require consultation with DCFS Clinical Division)
            </p>
            
            <div className="exempt-codes-grid">
              <div className="exempt-code-item"><strong>ABD:</strong> Abducted</div>
              <div className="exempt-code-item"><strong>ASD:</strong> Armed Services Duty</div>
              <div className="exempt-code-item"><strong>CUS:</strong> College or University Scholarship</div>
              <div className="exempt-code-item"><strong>DET:</strong> Detention</div>
              <div className="exempt-code-item"><strong>EFC:</strong> Emergency Foster Care</div>
              <div className="exempt-code-item"><strong>HHF:</strong> Hospital Health Facility</div>
              <div className="exempt-code-item"><strong>HFM:</strong> Hospital Facility Medical</div>
              <div className="exempt-code-item"><strong>HFP:</strong> Hospital Facility Psychiatric</div>
              <div className="exempt-code-item"><strong>HMP:</strong> Home of Parent</div>
              <div className="exempt-code-item"><strong>IMH:</strong> Institution Mental Health</div>
              <div className="exempt-code-item"><strong>ILO:</strong> Independent Living Program</div>
              <div className="exempt-code-item"><strong>IRS:</strong> Institution Rehabilitation Services</div>
              <div className="exempt-code-item"><strong>NCF:</strong> Nursing Care Facility</div>
              <div className="exempt-code-item"><strong>QRTP:</strong> Qualified Residential Treatment Program</div>
              <div className="exempt-code-item">
                <strong>RNY:</strong> Runaway - **FARE should be completed upon the youth's return when completing the required debriefing
                or within 5 business days of youth's return.
              </div>
              <div className="exempt-code-item">
                <strong>WUK:</strong> Whereabouts unknown - **FARE should be completed upon the youth's return when completing the
                required debriefing or within 5 business days of youth's return.
              </div>
              <div className="exempt-code-item">
                <strong>WCC:</strong> Whereabout unknown, but Worker Continued Contact - **FARE should be completed upon the youth's
                return when completing the required debriefing or within 5 business days of youth's return.
              </div>
              <div className="exempt-code-item"><strong>SSA:</strong> Self Selected Approved</div>
              <div className="exempt-code-item"><strong>SSU:</strong> Self Selected Unapproved</div>
              <div className="exempt-code-item"><strong>TLP:</strong> Transitional Living Program</div>
              <div className="exempt-code-item"><strong>YIC:</strong> Youth in College</div>
            </div>

            <div className="guide-note">
              <strong>Note:</strong> Child in RNY (WUK, WCC) do need to have an interview completed upon return and the F.A.R.E. should be
              completed with the child at the time of the debriefing following run episode or within 5 business days of child's return.
            </div>

            <p className="guide-text">
              A F.A.R.E only needs to be completed for physical moves and not 906 "paper moves" (i.e. FHB to FHS, FHB to FHA). In
              addition, a F.A.R.E is not required for youth when youth go into a respite home and will be returning to their caregiver
              once the respite period is completed. However, if the youth does not return to the caregiver from the respite provider
              and remains for any reason with the respite provider or moves to a new provider, a F.A.R.E must be completed 5
              business days from the formal placement in the prior respite home or new foster home. Additionally, a F.A.R.E. is not
              required when the youth go on a trial home visit that last less than 180 days and the child returns to the foster care
              provider with whom they lived prior to the trial home visit.
            </p>

            <h3 className="guide-subtitle">Purpose of the Interview</h3>
            <p className="guide-text">
              The purpose of the interview is to gain the child's perspective of their experience in their former placement, which can
              then inform and provide support for the child's next foster home or treatment facility experience and help casework
              team and other service providers better understand child's experiences and improve child's quality of care. The F.A.R.E.
              interview also assesses the child's safety and quality of care in the former caregiver's home.
            </p>

            <p className="guide-text">
              The answers to the F.A.R.E. interview questions should not only be based on child's answers, but also on all available
              information available and known to the interviewer.
            </p>

            <p className="guide-text">
              If a child refuses to participate in the F.A.R.E or refuses to answer any individual questions, the interviewer completing
              the F.A.R.E questions should answer based on knowledge of and information about the child, foster parent and
              placement.
            </p>

            <p className="guide-text">
              A contact note should be completed in SACWIS that a F.A.R.E interview was completed, location of the interview and
              any clarifying or additional information provided to further explain, clarify, or expand upon the information known or
              obtained in the interview process. The documentation may also include information about the youth's physical
              appearance, emotional/behavioral state, and non-verbal communication at the time of and during the interview
              process.
            </p>

            <div className="guide-alert">
              <strong>Alert:</strong> The interviewer must remain alert to any responses from the child that may require a mandated abuse or neglect report
              or a licensing violation report. If any responses allege abuse, neglect or maltreatment or licensing violation, a report to
              State Central Registry (SCR) must be made consistent with mandated reporter requirements. The reporter must
              provide SCR with both the provider ID for the foster parent and the ID# of the questionnaire which will be available to
              the interviewer once the questionnaire is submitted in the F.A.R.E. system.
            </div>

            <h3 className="guide-subtitle">Potential Licensing/402 Violations</h3>
            <p className="guide-text">
              The information below is to provide additional guidance to the interviewer in assessing the need to contact SCR
              regarding a possible licensing violation:
            </p>

            <ul className="guide-list">
              <li>
                <strong>Question #8</strong> - If the interviewer answers Yes regarding the child sleeping arrangement and the child is sharing a
                room with a person 18 years or older or opposite sex.
              </li>
              <li>
                <strong>Question #20</strong> - If the interviewer answers Yes to use of corporal punishment.
              </li>
            </ul>

            <p className="guide-text">
              There are also additional answers which require further explanation and may be a possible licensing violation and may
              need reported to SCR. Below is guidance on such questions and answers:
            </p>

            <ul className="guide-list">
              <li>
                <strong>Question #15</strong> - If the child answer no to feeling safe in the home, the interviewer should seek additional
                information. The interviewer should seek information on situations when child does not feel safe and if these
                are directly connected to basic needs being met and/or emotional or physical safety, a report for further review
                by licensing should be made. If the information gathered does not indicate that the child feeling unsafe is
                directly related to the caregiver, this may not need to be reported for further review by licensing. (i.e. the child
                does not feel safe because he/she is scared of the dark or feels unsafe due to nightmare having as result of
                trauma experiences).
              </li>
              <li>
                <strong>Question #16</strong> - If the child answers no that the foster parent does not make them feel good about themselves
                and this is connected to race/ethnicity, culture, gender, sexual identity a report for further review by licensing
                should be made.
              </li>
              <li>
                <strong>Question #20</strong> - If a child states that when he/she does something wrong, the caregiver response is
                yelling/shouting or if caregiver makes derogatory statements or otherwise hostile on a regular basis, a report for
                further review by licensing should be made.
              </li>
            </ul>

            <h3 className="guide-subtitle">INTRODUCTION AND INTERVIEW GUIDANCE</h3>
            <ul className="guide-list">
              <li>Assess the child's emotional state to ensure that child can participate in the interview without causing undue
                emotional distress.</li>
              <li>Introduce yourself and describe your role for the child, in an age-appropriate manner.</li>
              <li>Explain to the child that this is not a test and that there are no right or wrong answers. The goal is to get
                information from the child, from their perception, about their experiences in the caregiver's home from which
                they are moving.</li>
              <li>Explain purpose is to gather information about their thoughts and opinions about what it was like living in the
                caregiver's home that they are moving from and that these questions will help the interviewer better
                understand the child, their experiences and future placement and/or service needs.</li>
              <li>The child should not be given the questionnaire to complete under any circumstances.</li>
              <li>Conduct the interview in a place where you can have a safe private conversation. It is not recommended that
                the interview occur in the foster home in which the child is leaving.</li>
              <li>Obtain child's assent: It is important that the child assents to this process. If the child says they do not wish to
                be interviewed or answer questions on any topic or skip a specific question, please honor their wishes, and
                affirm that it is their choice.</li>
              <li>Inform the child that their response to the interview questions will go into their case file, case plan, foster
                parent's licensing file and may be shared with former foster parent and others (i.e., GAL, court).</li>
              <li>Inform the child that there answers to these interview questions will be informed not only on their responses,
                but also the interviewer's observations and other information they have about the child, caregiver, and
                placement that they are leaving.</li>
              <li>Inform the child that if there are answers that identify safety concerns, a report would be made to State Central
                Registry (SCR).</li>
              <li>Ask child if they have any questions before proceeding with the interview.</li>
              <li>It is important for that the interviewee establish a rapport with the child, with this being especially important for
                younger children.</li>
              <li>The interviewee should gather the information to respond to the questions, using open-ended questions and in
                a "conversational" manner that is appropriate to the child's age, developmental level, and emotional/behavioral
                presentation.</li>
              <li>It is important the interviewer does not influence or lead the child in answering questions, through facial
                expressions, body language or comments.</li>
              <li>The child's emotional/behavioral presentation should be assessed throughout the interview process to ensure
                not causing any undue stress.</li>
              <li>If a child is making an unplanned or negative move, acknowledge that moving to a new placement can create a
                lot of questions, anxiety, and other emotions.</li>
              <li>Encourage the youth to ask questions, express feelings to a trusting adult, caseworker, therapist as they prepare
                for or make the transition.</li>
              <li>Remind the child that if they have additional information that they think of later, they should let the interviewer
                know.</li>
              <li>Provide the child with information on how they can contact the interviewer. For younger children, this may
                mean having the caregiver assist them. It is important to reassure the child that contact information is available
                to them and that they are encouraged to ask questions and seek information they feel is needed to assist them
                in the transition to a new caregiver or treatment facility.</li>
              <li>Let the child know when you or the caseworker will be making next contact with them.</li>
              <li>Thank the youth for participating.</li>
            </ul>
          </div>
        </div>

        {/* Questions */}
        {QUESTIONS.map((question, questionIndex) => {
          const hasResponse = formData[question.id]?.responses?.length > 0;
          
          // Check if any previous question (not current) ended the interview
          let interviewEndedAtIndex = -1;
          if (interviewEnded) {
            for (let i = 0; i < QUESTIONS.length; i++) {
              const q = QUESTIONS[i];
              const qData = formData[q.id];
              if (qData?.responses) {
                qData.responses.forEach(response => {
                  const optionData = qData.options?.[response];
                  if (optionData?.endInterview) {
                    interviewEndedAtIndex = i;
                  }
                });
              }
            }
          }
          
          // Disable all questions AFTER the one that ended the interview
          // If Question 1 (index 0) ends interview, disable from Question 2 (index 1) onwards
          const shouldDisable = interviewEnded && interviewEndedAtIndex >= 0 && questionIndex > interviewEndedAtIndex;
          
          // Check if previous questions are unanswered (for locking)
          let isLocked = false;
          let firstUnansweredSection = null;
          if (!interviewEnded && questionIndex > 0) {
            for (let i = 0; i < questionIndex; i++) {
              const prevQuestion = QUESTIONS[i];
              const prevQuestionData = formData[prevQuestion.id];
              
              if (!prevQuestionData || !prevQuestionData.responses || prevQuestionData.responses.length === 0) {
                isLocked = true;
                if (firstUnansweredSection === null) {
                  firstUnansweredSection = prevQuestion.section;
                }
              }
            }
          }
          
          return (
            <div 
              key={question.id}
              id={`question-${question.id}`}
              className="question-card"
              style={{
                opacity: shouldDisable ? 0.6 : (isLocked ? 0.7 : 1),
                pointerEvents: shouldDisable ? 'none' : 'auto',
                position: 'relative',
                border: isLocked ? '2px solid #FCD34D' : undefined,
                backgroundColor: isLocked ? '#FFFBEB' : undefined
              }}
            >
              {shouldDisable && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(243, 244, 246, 0.5)',
                  zIndex: 1,
                  cursor: 'not-allowed'
                }}></div>
              )}
              
              {/* Section Header */}
              <div className="section-header">
                <div className="section-id-row">
                  <div>
                    <span className="section-id">{question.id}</span>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="question-content">
                <div className="question-text">
                  <span className="question-number">{question.section}. </span>
                  <span className="question-description">{question.text}</span>
                </div>

                {/* Options */}
                <div className="options-container">
                  {question.options.map((option, idx) => {
                    const isSelected = formData[question.id]?.responses?.includes(option.value);
                    const optionData = formData[question.id]?.options?.[option.value] || option;
                    
                    return (
                      <div key={idx} className="option-item">
                        <div className="option-content">
                          <div className="option-row">
                            <span className="option-number">{idx + 1}.</span>
                            <div className="option-label-wrapper">
                              <label className="option-label">
                                <input
                                  type="checkbox"
                                  name={question.id}
                                  checked={isSelected}
                                  onChange={() => handleOptionChange(question.id, option.value)}
                                  className="option-input"
                                  disabled={shouldDisable}
                                  style={{
                                    cursor: shouldDisable ? 'not-allowed' : 'pointer'
                                  }}
                                />
                                <div className="option-text-content">
                                  <span className="option-text-label">{option.text}</span>
                                  <span className="option-value-label">{option.value}</span>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Comment Fields - Only show textareas when option is selected */}
                          {isSelected && (
                            <div className="checkboxes-section">
                              {/* Warning for Potential Licensing Violation */}
                              {optionData.potentialViolation && (
                                <div className="violation-warning">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ flexShrink: 0 }}
                                  >
                                    <path
                                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                                      fill="#0f0f0fff"
                                    />
                                  </svg>
                                  <div>
                                    <strong> Warning: Potential Licensing Violation Detected</strong>
                                  </div>
                                </div>
                              )}
                              
                              {/* Youth Comment Field - shown when Allow or Require is checked */}
                              {(optionData.allowYouthComment || optionData.requireYouthComment) && (
                                <div className="textarea-wrapper" style={{marginTop: optionData.potentialViolation ? '16px' : '0'}}>
                                  <label className="textarea-label">
                                    Youth Comment
                                    {optionData.requireYouthComment && 
                                      <span className="required-asterisk">*</span>}
                                  </label>
                                  <textarea
                                    value={optionData.youthComment || ''}
                                    onChange={(e) => handleTextChange(question.id, option.value, 'youthComment', e.target.value)}
                                    rows="3"
                                    className="textarea-input"
                                    placeholder="Youth's comments..."
                                    required={optionData.requireYouthComment}
                                    disabled={shouldDisable}
                                    style={{
                                      backgroundColor: shouldDisable ? '#f3f4f6' : 'white',
                                      cursor: shouldDisable ? 'not-allowed' : 'text'
                                    }}
                                  />
                                  {optionData.requireYouthComment && !optionData.youthComment?.trim() && !shouldDisable && (
                                    <span className="field-required-note">This field is required before proceeding</span>
                                  )}
                                </div>
                              )}

                              {/* Interviewer Comment Field - shown when Allow or Require is checked */}
                              {(optionData.allowInterviewerComment || optionData.requireInterviewerComment) && (
                                <div className="textarea-wrapper" style={{marginTop: '16px'}}>
                                  <label className="textarea-label">
                                    Interviewer Comment
                                    {optionData.requireInterviewerComment && 
                                      <span className="required-asterisk">*</span>}
                                  </label>
                                  <textarea
                                    value={optionData.interviewerComment || ''}
                                    onChange={(e) => handleTextChange(question.id, option.value, 'interviewerComment', e.target.value)}
                                    rows="3"
                                    className="textarea-input"
                                    placeholder="Interviewer's observations..."
                                    required={optionData.requireInterviewerComment}
                                    disabled={shouldDisable}
                                    style={{
                                      backgroundColor: shouldDisable ? '#f3f4f6' : 'white',
                                      cursor: shouldDisable ? 'not-allowed' : 'text'
                                    }}
                                  />
                                  {optionData.requireInterviewerComment && !optionData.interviewerComment?.trim() && !shouldDisable && (
                                    <span className="field-required-note">This field is required before proceeding</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="footer-buttons">
          <button 
            className="btn btn-cancel" 
            onClick={() => {
              if (unsavedChanges) {
                setShowUnsavedWarning(true);
              } else {
                window.location.reload();
              }
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveDraft} 
            className="btn btn-draft"
            disabled={isSaving}
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save As Draft'}
          </button>
          <button 
            onClick={handleFinalize} 
            className="btn btn-save"
            disabled={isSaving}
          >
            <Save size={20} />
            {isSaving ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Validation Modal */}
        {showValidationModal && (
          <div className="modal-overlay" onClick={handleValidationModalClose}>
            <div className="modal-content modal-validation" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-error">
                <div className="modal-icon-circle-error">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM17.5 23H14.5V20H17.5V23ZM17.5 17H14.5V9H17.5V17Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <h3 className="modal-title-error">Required Fields Missing</h3>
              <p className="modal-description-center">
                Please complete the following required fields before finalizing the assessment:
              </p>
              <div className="validation-error-box">
                {Object.values(validationErrors).map((error, index) => (
                  <div key={index} className="validation-error-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="#FEE2E2"/>
                      <path d="M8 4V9M8 11V12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{error.message || error}</span>
                  </div>
                ))}
              </div>
              <div className="modal-actions-center">
                <button 
                  className="btn btn-modal-primary" 
                  onClick={handleValidationModalClose}
                >
                  Complete Required Fields
                </button>
              </div>
              <p className="modal-note-center">
                💡 Tip: You can save as a draft and complete these fields later
              </p>
            </div>
          </div>
        )}

        {/* Unsaved Changes Warning Modal */}
        {showUnsavedWarning && (
          <div className="modal-overlay" onClick={() => setShowUnsavedWarning(false)}>
            <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-warning">
                <div className="modal-icon-circle-warning">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM17.5 23H14.5V20H17.5V23ZM17.5 17H14.5V9H17.5V17Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <h3 className="modal-title-warning-new">Unsaved Changes</h3>
              <p className="modal-description-center">
                You have unsaved changes that will be lost if you cancel. Would you like to save your progress?
              </p>
              <div className="modal-actions-center">
                <button 
                  className="btn btn-modal-primary" 
                  onClick={() => {
                    setShowUnsavedWarning(false);
                    handleSaveDraft();
                  }}
                >
                  Save Draft
                </button>
                <button 
                  className="btn btn-modal-secondary" 
                  onClick={() => {
                    setShowUnsavedWarning(false);
                    window.location.reload();
                  }}
                >
                  Discard Changes
                </button>
                <button 
                  className="btn btn-modal-secondary" 
                  onClick={() => setShowUnsavedWarning(false)}
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Interview Warning Modal */}
        {showEndInterviewWarning && (
          <div className="modal-overlay" onClick={() => setShowEndInterviewWarning(false)}>
            <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-danger">
                <div className="modal-icon-circle-danger">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2L2 28H30L16 2Z" fill="white"/>
                    <path d="M16 12V18M16 21V22" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="modal-title-danger-new">Interview Ended</h3>
              <p className="modal-description-center">
                The interview has ended based on your selection. All other question responses (except Questions 1 and 2) have been cleared.
                <strong style={{display: 'block', marginTop: '8px', color: '#DC2626'}}>
                  Please complete any required comments for this question before finalizing.
                </strong>
              </p>
              <div className="modal-warning-box">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#DC2626"/>
                </svg>
                <span>Questions 1 and 2 responses have been preserved.</span>
              </div>
              <div className="modal-actions-center">
                <button 
                  className="btn btn-modal-primary" 
                  onClick={() => setShowEndInterviewWarning(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Missed Questions Modal */}
        {showMissedQuestionsModal && (
          <div className="modal-overlay" onClick={() => setShowMissedQuestionsModal(false)}>
            <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-warning">
                <div className="modal-icon-circle-warning">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM17.5 23H14.5V20H17.5V23ZM17.5 17H14.5V9H17.5V17Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <h3 className="modal-title-warning-new">Previous Questions Not Answered</h3>
              <p className="modal-description-center">
                You must answer questions in order. Please complete the following {missedQuestions.length === 1 ? 'question' : 'questions'} before proceeding:
              </p>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                margin: '16px 0',
                padding: '0 8px'
              }}>
                {missedQuestions.map((q, index) => (
                  <div 
                    key={q.id}
                    onClick={() => {
                      setShowMissedQuestionsModal(false);
                      setTimeout(() => {
                        scrollToQuestion(q.id);
                      }, 300);
                    }}
                    style={{
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FCD34D',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FDE68A';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF3C7';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      backgroundColor: '#F59E0B',
                      color: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {q.section}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#92400E',
                        marginBottom: '4px'
                      }}>
                        Question {q.section}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#78350F',
                        lineHeight: '1.5'
                      }}>
                        {q.text}
                      </div>
                    </div>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20"
fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0, marginTop: '4px' }}
                    >
                      <path d="M7 3L13 10L7 17" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ))}
              </div>
              <div className="modal-actions-center">
                <button 
                  className="btn btn-modal-primary" 
                  onClick={() => {
                    setShowMissedQuestionsModal(false);
                    setTimeout(() => {
                      scrollToQuestion(missedQuestions[0].id);
                    }, 300);
                  }}
                >
                  Go to Question {missedQuestions[0]?.section}
                </button>
                <button 
                  className="btn btn-modal-secondary" 
                  onClick={() => setShowMissedQuestionsModal(false)}
                >
                  Close
                </button>
              </div>
              <p className="modal-note-center">
                💡 Click any question above to jump directly to it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
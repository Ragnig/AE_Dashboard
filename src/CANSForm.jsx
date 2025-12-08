import React, { useEffect, useMemo, useState, useRef } from "react";
import { Checkmark20Filled, Warning20Filled, Warning20Regular, CheckmarkCircle20Filled, Circle20Regular, ErrorCircle20Filled } from "@fluentui/react-icons";
import { Save } from "lucide-react";
import { demoSections } from "./demosection";
import styles from "./formstyle";
import SubmitSuccessScreen from "./SubmitSuccessScreen";
import ReviewScreen from "./ReviewScreen";
// import { saveFormToServer } from "../api/saveHandlers";
// const API_BASE = "http://localhost:5000";
/** -------- Demo data placeholders (keep or replace) -------- **/
const demoOverview = {
  caseId: "",
  caseName: "",
  dateOfAssessment: "",
  workerName: "",
  personId: "",
  memberName: "",
  memberDob: "",
  memberRole: "",
};

const requiredOverviewFields = ["caseId", "caseName", "personId", "memberName", "workerName", "memberRole"];

// Show 15 badges per page
const badgesPerPage = 15;

/* -------------------- COMPONENT -------------------- */
export default function CANSForm({ overview = demoOverview, sections = demoSections, onClose, onSave, draftData }) {
  console.log('🚀 CANS Form mounted with draftData:', draftData);
  
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const todayIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const [formData, setFormData] = useState({
    ...overview,
    dateOfAssessment: overview.dateOfAssessment || todayIso,
  });

  // Confirmation modal open state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Decide visibleSections based on memberRole
  const visibleSections = useMemo(() => {
    const role = (formData.memberRole || "").trim().toLowerCase();
    if (role.length === 0) return sections; // default to all when not entered
    if (role.includes("child")) {
      return sections.slice(0, 9);
    }
    if (role.includes("caregiver")) {
      return sections.filter((s) => s.id >= 10 && s.id <= 17);
    }
    return sections;
  }, [formData.memberRole, sections]);

  // flatten rows globally from visibleSections
  const flatRows = useMemo(() => {
    const list = [];
    visibleSections.forEach((s) => s.rows.forEach((r) => list.push({ sectionId: s.id, sectionTitle: s.title, row: r })));
    return list;
  }, [visibleSections]);

  // map row id -> global index within flatRows
  // eslint-disable-next-line no-unused-vars
  const idToGlobalIndex = useMemo(() => {
    const m = new Map();
    flatRows.forEach((f, idx) => m.set(f.row.id, idx));
    return m;
  }, [flatRows]);

  // compute section ranges for visibleSections only
  const sectionRanges = useMemo(() => {
    const map = new Map();
    let i = 0;
    visibleSections.forEach((s) => {
      map.set(s.id, { start: i, length: s.rows.length });
      i += s.rows.length;
    });
    return map;
  }, [visibleSections]);

  const [activeSectionId, setActiveSectionId] = useState(visibleSections[0]?.id ?? null);
  const [currentGlobalIndex, setCurrentGlobalIndex] = useState(flatRows.length ? 0 : null);
  const [answers, setAnswers] = useState({}); // { rowId: { score, description, unk, na } }
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);

  const [badgePageIndex, setBadgePageIndex] = useState(0);

  // Generate assessment ID immediately (or use from draftData)
  const generateCANSId = () => {
    const stored = localStorage.getItem('assessments');
    const assessments = stored ? JSON.parse(stored) : [];
    const cansAssessments = assessments.filter(a => a.type === 'CANS');
    const maxId = cansAssessments.reduce((max, assessment) => {
      const match = assessment.id.match(/CANS-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    return `CANS-${String(maxId + 1).padStart(3, '0')}`;
  };
  
  const [assessmentId] = useState(() => {
    const id = draftData?.id || generateCANSId();
    console.log('🔑 CANS Assessment ID generated:', id);
    return id;
  });

  useEffect(() => {
    // Add beforeunload event listener for conditional save/discard
    const handleBeforeUnload = (event) => {
      console.log('🚨 CANS beforeunload triggered - hasAnsweredQuestion:', hasAnsweredQuestion);
      if (!hasAnsweredQuestion) {
        // User hasn't answered any questions, discard the form
        console.log('🗑️ CANS: Discarding form on unload - no questions answered');
        const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
        localStorage.setItem('assessments', JSON.stringify(filteredAssessments));
        console.log('🗑️ CANS: Assessment discarded, remaining assessments:', filteredAssessments.length);
        return;
      }
      
      // User has answered questions, auto-save
      if (hasAnsweredQuestion && Object.keys(answers).length > 0) {
        console.log('💾 CANS: Auto-saving before unload');
        const saveData = {
          id: assessmentId,
          caseId: formData.caseId || "N/A",
          caseName: formData.caseName || formData.memberName || "N/A",
          status: "In-progress",
          createdBy: "Current User",
          overview: formData,
          answers: answers,
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
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasAnsweredQuestion, answers, formData, assessmentId]);

  useEffect(() => {
    if (!visibleSections || visibleSections.length === 0) {
      setActiveSectionId(null);
      setCurrentGlobalIndex(null);
      return;
    }

    const exists = visibleSections.some((s) => s.id === activeSectionId);
    if (!exists) {
      const first = visibleSections[0];
      setActiveSectionId(first.id);
      const r = sectionRanges.get(first.id);
      setCurrentGlobalIndex(r ? r.start : 0);
      setBadgePageIndex(0);
      return;
    }

    if (currentGlobalIndex == null || currentGlobalIndex >= flatRows.length) {
      setCurrentGlobalIndex(flatRows.length ? 0 : null);
    }
  }, [visibleSections, sectionRanges, activeSectionId, currentGlobalIndex, flatRows]);

  useEffect(() => {
    if (!activeSectionId) return;
    const sectionStart = sectionRanges.get(activeSectionId)?.start ?? 0;
    const indexInSection = Math.max(0, (currentGlobalIndex ?? 0) - sectionStart);
    const page = Math.floor(indexInSection / badgesPerPage);
    setBadgePageIndex(page);
  }, [currentGlobalIndex, activeSectionId, sectionRanges]);

  useEffect(() => {
    setBadgePageIndex(0);
  }, [activeSectionId]);

  // save/autosave states
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [serverDocId, setServerDocId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false); // For completed forms opened from dashboard
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showWarningScreen, setShowWarningScreen] = useState(false);
  const [warningTriggered, setWarningTriggered] = useState(false);

  const formDataRef = useRef(formData);
  const answersRef = useRef(answers);
  const isDirtyRef = useRef(isDirty);
  const autosaveIntervalRef = useRef(null);
  const autosaveInFlightRef = useRef(false);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  useEffect(() => {
    answersRef.current = answers;
    
    // Check if this is the first time user answered any question
    const hasAnswers = Object.keys(answers).some(id => {
      const a = answers[id];
      return a && (a.unk || a.na || a.score !== null || (a.description && a.description.trim()));
    });
    
    if (hasAnswers && isDirty) {
      console.log('🟢 First answer detected via useEffect, triggering autosave');
      // Small delay to ensure state is updated
      setTimeout(() => {
        autosaveDraftIfNeeded().catch(err => console.error('First answer autosave error:', err));
      }, 500);
    }
  }, [answers, isDirty]);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Load draft data when component mounts
  useEffect(() => {
    // Note: Removed automatic save on form open to prevent empty assessments in dashboard
    // Forms will only be saved when user answers at least one question
    
    if (draftData) {
      // Load overview data
      if (draftData.overview) {
        setFormData(prev => ({
          ...prev,
          ...draftData.overview
        }));
      }
      
      // Load answers
      if (draftData.answers) {
        setAnswers(draftData.answers);
        
        // Check if user has answered questions in draft
        const hasAnswers = Object.values(draftData.answers).some(answer => {
          return answer.score !== null || (answer.description && answer.description.trim() !== '') || answer.unk || answer.na;
        });
        if (hasAnswers) {
          setHasAnsweredQuestion(true);
        }
      }
      
      // Set server doc ID if available
      if (draftData.id) {
        setServerDocId(draftData.id);
      }
      
      // If opening a completed assessment from dashboard, set as view-only (not submitted)
      // This allows navigation but disables editing
      if (draftData.status === 'Completed') {
        setIsViewOnly(true);
        isSubmittedRef.current = true; // For autosave prevention
      }
    }
  }, [draftData]);

  useEffect(() => {
    if (currentGlobalIndex == null) return;
    const sId = flatRows[currentGlobalIndex]?.sectionId;
    if (sId && sId !== activeSectionId) setActiveSectionId(sId);
  }, [currentGlobalIndex, flatRows, activeSectionId]);

  const currentRow = flatRows[currentGlobalIndex]?.row ?? null;

  const updateFormField = (key, value) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setIsDirty(true);
  };

  // setAnswer writes description under "description" to match rendering logic
  const setAnswer = (rowId, patch) => {
    console.log('🔄 setAnswer called with rowId:', rowId, 'patch:', patch);
    
    // Calculate the next answers object first
    const nextAnswers = { ...answers, [rowId]: { ...(answers[rowId] || { score: null, description: "", unk: false, na: false }), ...patch } };
    
    // Track that user has answered at least one question
    const wasFirstAnswer = !hasAnsweredQuestion;
    if (patch && (patch.score !== null || (patch.description && patch.description.trim() !== '') || patch.unk || patch.na)) {
      setHasAnsweredQuestion(true);
      
      // Trigger immediate save to dashboard only when first answer is given
      if (wasFirstAnswer && typeof onSave === 'function') {
        console.log('🟢 CANS: Saving to dashboard - first question answered');
        
        setTimeout(() => {
          const saveData = {
            id: assessmentId,
            caseId: "123456",
            caseName: "Bryant, Dianne", 
            status: "In-progress",
            createdBy: "Current User",
            overview: {
              caseId: "123456",
              caseName: "Bryant, Dianne",
              workerName: "Current User",
              dateOfAssessment: todayIso,
              personId: "789456",
              memberName: "Bryant, Dianne",
              memberDob: "2002-12-25",
              memberRole: formData.memberRole || "Caregiver"
            },
            answers: nextAnswers,
            autoSaved: true
          };
          
          console.log('🟢 Calling onSave immediately with:', saveData);
          onSave(saveData);
        }, 100);
      }
    }
    
    setAnswers(nextAnswers);
    setIsDirty(true);
  };

  // eslint-disable-next-line no-unused-vars
  const setCaseId = (value) => {
    const digitsOnly = String(value || "").replace(/\D/g, "");
    setFormData((p) => ({ ...p, caseId: digitsOnly }));
    setIsDirty(true);
  };
  // eslint-disable-next-line no-unused-vars
  const setPersonId = (value) => {
    const digitsOnly = String(value || "").replace(/\D/g, "");
    setFormData((p) => ({ ...p, personId: digitsOnly }));
    setIsDirty(true);
  };

  const anyAnswered = useMemo(() => {
    return Object.keys(answers).some((id) => {
      const a = answers[id];
      if (!a) return false;
      return a.unk || a.na || (a.score !== null && a.score !== undefined) || (a.description && a.description.trim().length > 0);
    });
  }, [answers]);

  const isCompleteAllowed = requiredOverviewFields.every((k) => formData[k] && String(formData[k]).trim().length > 0);

  const isFirst = currentGlobalIndex === 0;
  const isLast = currentGlobalIndex === flatRows.length - 1;

  const onSelectSection = (sectionId) => {
    const r = sectionRanges.get(sectionId);
    if (!r) return;
    setActiveSectionId(sectionId);
    setCurrentGlobalIndex(r.start);
    setBadgePageIndex(0);
  };

  const goPrev = () => {
    if (isFirst) return;
    setCurrentGlobalIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    // Disable next button at last question if in read-only mode
    if (isLast && isViewOnly) {
      return;
    }
    
    if (isLast) {
      // Check if all questions are answered before showing review screen
      const incomplete = flatRows.filter((f) => !isQuestionCompleted(answers[f.row.id]));
      if (incomplete.length > 0) {
        setShowWarningScreen(true);
        setWarningTriggered(true);
        return;
      }
      setShowReviewScreen(true);
      return;
    }
    setCurrentGlobalIndex((i) => Math.min(flatRows.length - 1, i + 1));
  };

  // Map row id -> title for friendly messages
  const rowTitlesById = useMemo(() => {
    const m = new Map();
    visibleSections.forEach((s) => s.rows.forEach((r) => m.set(r.id, r.title)));
    return m;
  }, [visibleSections]);

  // Determine which rows require a description (score 2 or 3) but have empty notes.
  const missingDescriptions = useMemo(() => {
    const set = new Set();
    visibleSections.forEach((s) => {
      (s.rows || []).forEach((r) => {
        const a = answers[r.id];
        if (!a) return;
        const score = a.score;
        if (!a.unk && !a.na && (score === 2 || score === 3)) {
          if (!a.description || a.description.trim().length === 0) set.add(r.id);
        }
      });
    });
    return set;
  }, [visibleSections, answers]);

  // - otherwise a score must exist
  // - if score is 2 or 3, a non-empty description is required
  const isQuestionCompleted = (a = {}) => {
    if (!a) return false;
    if (a.unk || a.na) return true;
    if (a.score === null || a.score === undefined || a.score === "") return false;
    const scoreNum = Number(a.score);
    if (scoreNum === 2 || scoreNum === 3) {
      return !!a.description && String(a.description).trim().length > 0;
    }
    return true;
  };

  const completedSections = useMemo(() => {
    const set = new Set();
    visibleSections.forEach((s) => {
      const allAnsweredAndDescribed = (s.rows || []).every((r) => {
        const a = answers[r.id];
        return isQuestionCompleted(a);
      });
      if (allAnsweredAndDescribed) set.add(s.id);
    });
    return set;
  }, [visibleSections, answers]);

  const incompleteSections = useMemo(() => {
    const set = new Set();
    if (warningTriggered) {
      visibleSections.forEach((s) => {
        const hasIncomplete = (s.rows || []).some((r) => {
          const a = answers[r.id];
          return !isQuestionCompleted(a);
        });
        if (hasIncomplete) set.add(s.id);
      });
    }
    return set;
  }, [visibleSections, answers, warningTriggered]);

  // New: allow submit when all visible questions are answered
  const allQuestionsCompleted = useMemo(() => {
    return visibleSections.every((s) =>
      (s.rows || []).every((r) => {
        const a = answers[r.id];
        if (!a) return false;
        const answered =
          a.unk ||
          a.na ||
          (a.score !== null && a.score !== undefined) ||
          (a.description && String(a.description).trim().length > 0);
        if (!answered) return false;
        const requiresDescription = !a.unk && !a.na && (a.score === 2 || a.score === 3);
        if (requiresDescription && (!a.description || String(a.description).trim().length === 0)) return false;
        return true;
      })
    );
  }, [visibleSections, answers]);

  // Final submit eligibility: either overview is complete OR all visible questions are completed, and there are no missing descriptions
  const canSubmit = (isCompleteAllowed || allQuestionsCompleted) && missingDescriptions.size === 0;

function formatSchemaJSON(overview, answers) {
  return {
    sections: {
      case_details: {
        case_id: overview.caseId || "",
        case_name: overview.caseName || "",
        date_of_assessment: overview.dateOfAssessment || "",
        worker_name: overview.workerName || "",
      },
      member_details: {
        person_id: overview.personId || "",
        member_name: overview.memberName || "",
        member_dob: overview.memberDob || "",
        member_role: overview.memberRole || "",
      },

      assessment: Object.entries(answers).map(([questionId, details]) => {
        // IMPORTANT FIX: convert questionId → number
        const rowObj = flatRows.find(f => f.row.id === questionId);

        return {
          section_id: rowObj?.sectionId || "",
          section_title: rowObj?.sectionTitle || "",
          question_id: questionId,
          question_title: rowObj?.row?.title || "",
          score: details.score ?? null,
          description: details.description || "",
          unknown: details.unk || false,
          not_applicable: details.na || false,
        };
      }),
    },

    timestamp: new Date().toISOString(),
  };
}


  // Generic save to backend/localStorage (unchanged)
  async function saveDraftPayload(payload) {
    try {
      // Backend connectivity commented out - using localStorage only
      // if (typeof API_BASE !== "undefined") {
      //   const res = await fetch(`${API_BASE}/api/basic-info`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   });
      //   const data = await res.json();
      //   if (!res.ok) {
      //     console.warn("Save failed", res.status, data);
      //     return { ok: false, data };
      //   }
      //   return { ok: true, data };
      // } else {
        localStorage.setItem("cans_autosave", JSON.stringify(payload));
        return { ok: true, data: { local: true } };
      // }
    } catch (err) {
      console.error("saveDraftPayload error", err);
      return { ok: false, data: { error: err.message || String(err) } };
    }
  }

  // Debounced autosave (unchanged)
  const autosaveTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const isSubmittedRef = useRef(isSubmitted);

  useEffect(() => {
    isSubmittedRef.current = isSubmitted;
  }, [isSubmitted]);

  function stopAutosave() {
    try {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
      autosaveInFlightRef.current = false;
      if (mountedRef.current) setIsAutosaving(false);
      console.debug("[stopAutosave] cleared autosave timers");
    } catch (err) {
      console.warn("[stopAutosave] error", err);
    }
  }

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  async function autosaveDraftIfNeeded() {
    console.log('🔍 autosaveDraftIfNeeded called');
    console.log('🔍 answersRef.current:', answersRef.current);
    console.log('🔍 isDirtyRef.current:', isDirtyRef.current);
    console.log('🔍 autosaveInFlightRef.current:', autosaveInFlightRef.current);
    console.log('🔍 isSubmittedRef.current:', isSubmittedRef.current);
    
    // Check if user has answered any questions
    const hasAnswers = Object.keys(answersRef.current).some(id => {
      const a = answersRef.current[id];
      return a && (a.unk || a.na || a.score !== null || (a.description && a.description.trim()));
    });
    
    console.log('🔍 hasAnswers:', hasAnswers);
    
    if (!hasAnswers) {
      console.log('🟡 Skipping autosave: No questions answered yet');
      return;
    }
    
    if (!isDirtyRef.current) {
      console.log('🟡 Skipping autosave: Form not dirty');
      return;
    }
    
    if (autosaveInFlightRef.current) {
      console.log('🟡 Skipping autosave: Already in progress');
      return;
    }

    // If form submitted, skip autosave
    if (isSubmittedRef.current) {
      console.log('🟡 Skipping autosave: Form already submitted');
      if (mountedRef.current) setIsAutosaving(false);
      return;
    }

    // Auto save continue if form is not submitted
    autosaveInFlightRef.current = true;
    if (mountedRef.current) setIsAutosaving(true);

    const startedAt = Date.now();
    try {
      const schema = formatSchemaJSON(formDataRef.current, answersRef.current);
      const payload = {
        status: "In-progress",
        schema_json: schema,
        overview: formDataRef.current,
        answers: answersRef.current,
        timestamp: new Date().toISOString(),
        serverDocId,
        autoSaved: true,
      };

      const res = await saveDraftPayload(payload);

      if (res.ok && res.data?.id) {
        setServerDocId(res.data.id);
      }

      if (res.ok && mountedRef.current) {
        setIsDirty(false);
        setLastSavedAt(new Date().toISOString());
        
        console.log('🟢 Autosave successful, calling onSave callback');
        console.log('🟢 Assessment ID:', assessmentId);
        console.log('🟢 Form data:', formDataRef.current);
        console.log('🟢 Answers data:', answersRef.current);
        
        // Update dashboard with In-progress status
        if (typeof onSave === "function") {
          const saveData = {
            id: assessmentId,
            caseId: formDataRef.current.caseId || "123456", // Use hardcoded case ID
            caseName: formDataRef.current.caseName || "Bryant, Dianne", // Use hardcoded case name
            status: "In-progress",
            createdBy: "Current User", // Use actual user instead of worker name
            overview: formDataRef.current,
            answers: answersRef.current,
            autoSaved: true,
            data: payload
          };
          console.log('🟢 Calling onSave with data:', saveData);
          onSave(saveData);
        } else {
          console.log('❌ onSave is not a function!');
        }
      }
    } catch (err) {
      console.error("autosave error:", err);
    } finally {
      const elapsed = Date.now() - startedAt;
      const minDisplay = 2000;
      const wait = Math.max(0, minDisplay - elapsed);

      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }

      if (mountedRef.current) setIsAutosaving(false);
      autosaveInFlightRef.current = false;
    }
  }

  useEffect(() => {
    if (autosaveTimerRef && autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    if (autosaveIntervalRef.current) {
      clearInterval(autosaveIntervalRef.current);
      autosaveIntervalRef.current = null;
    }

    if (isSubmittedRef.current) {
      // ensure any leftover timers are cleared
      stopAutosave();
      return;
    }

    // Check if user has answered any questions
    const hasAnswers = Object.keys(answers).some(id => {
      const a = answers[id];
      return a && (a.unk || a.na || a.score !== null || (a.description && a.description.trim()));
    });

    if (!hasAnswers) {
      console.log('🟡 No answers yet, skipping autosave setup');
      return;
    }

    // Start autosave interval once user has answered at least one question
    autosaveIntervalRef.current = setInterval(() => {
      try {
        // skip autosave if submitted
        if (isSubmittedRef.current) {
          stopAutosave();
          return;
        }
        // This is auto save
        if (isDirtyRef.current && answersRef.current && Object.keys(answersRef.current).length > 0) {
          autosaveDraftIfNeeded().catch((err) => console.error("autosaveDraftIfNeeded error:", err));
        }
      } catch (err) {
        console.error("Autosave interval error:", err);
      }
    }, 30000);

    console.log('🟢 Autosave interval started for answered questions');

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]); // Changed dependency to answers instead of anyAnswered

  async function handleSaveDraft() {
    console.log('🔄 CANS handleSaveDraft called - hasAnsweredQuestion:', hasAnsweredQuestion);
    if (!hasAnsweredQuestion) {
      // No questions answered, just close the form without saving
      console.log('🗑️ CANS: Closing form - no questions answered');
      if (typeof onClose === "function") {
        onClose();
      } else if (typeof window !== "undefined") {
        if (window.history && window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = `/`;
        }
      }
      return;
    }

    let savedOk = false;
    setIsSaving(true);
    try {
      const formattedSchema = formatSchemaJSON(formData, answers, visibleSections);
      const payload = {
        status: "draft",
        schema_json: formattedSchema,
        overview: formData,
        answers,
        timestamp: new Date().toISOString(),
        serverDocId,
      };

      const res = await saveDraftPayload(payload);
      if (!res.ok) {
        alert(res.data?.message || "Save failed");
        return;
      }
      if (res.data?.id) setServerDocId(res.data.id);
      setIsDirty(false);
      setLastSavedAt(new Date().toISOString());
      
      savedOk = true;
      
      // Call onSave callback to update dashboard
      if (typeof onSave === "function") {
        onSave({
          id: assessmentId,
          caseId: formData.caseId,
          caseName: formData.caseName,
          status: "In-progress",
          createdBy: "Current User",
          overview: formData,
          answers: answers,
          data: payload
        });
      }
      
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Error while saving draft: " + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
    
    // If saved successfully, the form closes
    if (savedOk) {
        try {
          if (typeof onClose === "function") {
            if (!hasAnsweredQuestion) {
              // User hasn't answered any questions, discard the form
              console.log('🗑️ CANS: Discarding form - no questions answered');
              const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
              const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
              localStorage.setItem('assessments', JSON.stringify(filteredAssessments));
            }
            onClose();
          } else if (typeof window !== "undefined") {
            // Prefer going back in history if possible
            if (window.history && window.history.length > 1) {
              window.history.back();
            } else {
              // fallback - redirect to root or cases list
              window.location.href = `/`;
            }
          }
        } catch (err) {
          console.warn("Error while attempting to close form after save:", err);
        }
    }
  }

  async function handleComplete() {
    // validation (unchanged)
    const missing = requiredOverviewFields.filter((k) => !formData[k] || String(formData[k]).trim() === "");
    if (!allQuestionsCompleted && missing.length) {
      alert("Please fill the required fields: " + missing.join(", "));
      return;
    }
    if (missingDescriptions.size > 0) {
      const titles = [...missingDescriptions].map((id) => rowTitlesById.get(id) || `Question ${id}`);
      alert("Please fill the required Describe field(s) for: " + titles.join(", "));
      return;
    }

    // Prevent duplicate submissions and ensure UI disables "Save as Draft"
    if (isSaving) return;
    setIsSaving(true);

    try {
      const formattedSchema = formatSchemaJSON(formData, answers);
      const payload = {
        status: "complete",
        schema_json: formattedSchema,
        overview: formData,
        answers,
        timestamp: new Date().toISOString(),
        serverDocId,
      };

      const res = await saveDraftPayload(payload);

      if (!res.ok) {
        alert(res.data?.message || "Submit failed");
        return;
      }

      if (res.data?.id) setServerDocId(res.data.id);
      setIsDirty(false);
      setLastSavedAt(new Date().toISOString());

      // only on success mark submitted and stop autosave
      setIsSubmitted(true);
      isSubmittedRef.current = true;
      stopAutosave();

      // Call onSave callback to update dashboard
      if (typeof onSave === "function") {
        onSave({
          id: assessmentId,
          caseId: formData.caseId,
          caseName: formData.caseName,
          status: "Completed",
          createdBy: "Current User",
          overview: formData,
          answers: answers,
          data: payload
        });
      }
      
      // Show success screen instead of alert
      // alert("Form is submitted Successfully");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error while submitting: " + (err.message || String(err)));
      // keep isSubmitted false so user can retry
    } finally {
      setIsSaving(false);
    }
  }

  const activeSection = visibleSections.find((s) => s.id === activeSectionId) || visibleSections[0] || { rows: [] };
  const badgePageStartIndexInSection = badgePageIndex * badgesPerPage;
  const badgeRowsForPage = activeSection.rows.slice(badgePageStartIndexInSection, badgePageStartIndexInSection + badgesPerPage);
  const sectionStartGlobal = sectionRanges.get(activeSectionId)?.start ?? 0;
  // eslint-disable-next-line no-unused-vars
  const submitDisabled = !canSubmit || isSaving || isSubmitted || isViewOnly;
  const saveDisabled = !hasAnsweredQuestion || isSaving || isSubmitted || isViewOnly;

  // ShouldShowDescribe unchanged
  const shouldShowDescribe = (() => {
    if (!currentRow) return false;
    const a = answers[currentRow.id];
    if (!a) return false;
    if (a.unk || a.na) return false;
    const s = a.score;
    return s === 2 || s === 3;
  })();

  return (
    <>
      <div style={styles.container}>
      <div style={styles.header}>
        Child and Adolescent Needs and Strengths (CANS)
        {isViewOnly && (
          <span style={{ 
            marginLeft: 16, 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#636F9E",
            background: "#f5f5f5",
            padding: "4px 12px",
            borderRadius: 4
          }}>
            Read-Only Mode
          </span>
        )}
      </div>

      <div style={styles.overviewCard}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Overview</div>
        <div style={styles.overviewGrid}>
          <div>
            <div>
              <span style={styles.overviewLabel}>Case ID</span>
              <span style={styles.overviewValue}>{formData.caseId || "123456"}</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={styles.overviewLabel}>Person ID</span>
              <span style={styles.overviewValue}>{formData.personId || "789456"}</span>
            </div>
          </div>

          <div>
            <div>
              <span style={styles.overviewLabel}>Case name</span>
              <span style={styles.overviewValue}>
                <a
                  href={`/cases/${formData.caseId || ""}`}
                  style={styles.overviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.caseName || "Bryant, Dianne"}
                </a>
              </span>
            </div>
            <div style={{ marginTop: 10 }}>
              <span style={styles.overviewLabel}>Member name</span>
              <span style={styles.overviewValue}>
                <span style={styles.overviewLink}>{formData.memberName || "Bryant, Dianne"}</span>
              </span>
            </div>
          </div>

          <div>
            <div>
              <span style={styles.overviewLabel}>Date of assessment</span>
              <span style={styles.overviewValue}>{formData.dateOfAssessment || todayIso}</span>
            </div>

            <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
              <span style={styles.overviewLabel}>Member date of birth</span>
              <span style={styles.overviewValue}>{formData.memberDob || "2002-12-25"}</span>
            </div>
          </div>

          <div>
            <div>
              <span style={styles.overviewLabel}>Worker name</span>
              <span style={styles.overviewValue}>
                <span style={styles.overviewLink}>{formData.workerName || "Johnson, Hilary"}</span>
              </span>
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
              <span style={styles.overviewLabel}>Member role</span>
              <select
                value={formData.memberRole || ""}
                onChange={(e) => updateFormField("memberRole", e.target.value)}
                style={{ ...styles.memberRoleInput, padding: "6px 8px" }}
                aria-label="Member role"
                disabled={isSubmitted || isViewOnly}
              >
                <option value="">-- Select role --</option>
                <option value="Child">Child</option>
                <option value="Caregiver">Caregiver</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* panel wraps left + right into a single white container */}
      <div style={styles.panel}>
        <aside style={styles.leftNav}>
          <div style={styles.sectionListTitle}>Sections</div>

          {visibleSections.map((s) => {
            const active = s.id === activeSectionId;
            const completed = completedSections.has(s.id);
            const incomplete = incompleteSections.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                style={styles.leftBtn(active)}
                onClick={() => { 
                  if (showReviewScreen) {
                    // Exit review screen and go to selected section
                    setShowReviewScreen(false);
                    const r = sectionRanges.get(s.id);
                    if (r) {
                      setActiveSectionId(s.id);
                      setCurrentGlobalIndex(r.start);
                      setBadgePageIndex(0);
                    }
                  } else if (isSubmitted && !isViewOnly) {
                    // Exit success screen and go to selected section in read-only mode
                    setIsViewOnly(true);
                    const r = sectionRanges.get(s.id);
                    if (r) {
                      setActiveSectionId(s.id);
                      setCurrentGlobalIndex(r.start);
                      setBadgePageIndex(0);
                    }
                  } else {
                    onSelectSection(s.id); 
                    setShowWarningScreen(false);
                  }
                }}
                title={s.title}
              >
                <span style={styles.sectionBadge(completed, incomplete)}>
                  {completed ? <Checkmark20Filled style={{ width: 16, height: 16 }} /> : incomplete ? <Warning20Filled style={{ width: 16, height: 16 }} /> : ""}
                </span>
                <span style={styles.leftBtnText}>{s.title}</span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT PANEL */}
        <section style={styles.rightCard(styles.pageHeight)}>
          {isSubmitted && !isViewOnly ? (
            <SubmitSuccessScreen 
              formData={formData}
              sections={visibleSections}
              answers={answers}
              onClose={() => {
                // You can redirect or close the window here
                if (typeof onClose === "function") {
                  if (!hasAnsweredQuestion) {
                    // User hasn't answered any questions, discard the form
                    console.log('🗑️ CANS: Discarding form - no questions answered');
                    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
                    const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
                    localStorage.setItem('assessments', JSON.stringify(filteredAssessments));
                  }
                  onClose();
                } else if (window.history && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.close();
                }
              }} 
            />
          ) : showWarningScreen ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", padding: 48, height: "100%", gap: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <Warning20Regular style={{ width: 32, height: 32, color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 400, color: "#111827", margin: 0 }}>
                {incompleteSections.size} {incompleteSections.size === 1 ? 'section requires' : 'sections require'} your attention...
              </h2>
              <p style={{ fontSize: 14, color: "#616161", lineHeight: 1.6, maxWidth: 450, margin: 0 }}>
                Please finish entering all required information for the sections shown as incomplete.
              </p>
            </div>
          ) : showReviewScreen ? (
            <ReviewScreen 
              sections={visibleSections}
              answers={answers}
              overview={formData}
              onBack={() => {
                setShowReviewScreen(false);
                // Go to first section, first question
                const firstSection = visibleSections[0];
                if (firstSection) {
                  setActiveSectionId(firstSection.id);
                  setCurrentGlobalIndex(0);
                  setBadgePageIndex(0);
                }
              }} 
              onSubmit={handleComplete}
              isSaving={isSaving}
              activeSectionId={activeSectionId}
              onSectionChange={(sectionId) => {
                // Exit review screen and go to the selected section
                setShowReviewScreen(false);
                const r = sectionRanges.get(sectionId);
                if (r) {
                  setActiveSectionId(sectionId);
                  setCurrentGlobalIndex(r.start);
                  setBadgePageIndex(0);
                }
              }}
            />
          ) : (
            <>
          {/* Content area - scrollable */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 auto", overflow: "auto", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {flatRows[currentGlobalIndex]?.sectionTitle ?? activeSection.title ?? "Domain"}
            </div>

          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <div style={styles.badgeRail}>
                {badgeRowsForPage.map((r, idx) => {
                  const globalIndex = sectionStartGlobal + badgePageStartIndexInSection + idx;
                  const active = currentGlobalIndex === globalIndex;
                  const a = answers[r.id];
                  const saved = isQuestionCompleted(a);
                  const incomplete = warningTriggered && !saved;
                  return (
                    <React.Fragment key={r.id}>
                      <div
                        style={styles.badge(active, saved, incomplete)}
                        onClick={() => {setCurrentGlobalIndex(globalIndex); setShowWarningScreen(false); }}
                        role="button"
                        title={r.title}
                      >
                        {r.id}
                      </div>
                      {idx < badgeRowsForPage.length - 1 && <div aria-hidden style={styles.connector} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* QUESTION CARD: title + options inside a bordered container */}
            <div>
              <div style={styles.questionCard}>
                <div style={styles.qHeader}>{currentRow ? `${currentRow.id}. ${currentRow.title}` : "No questions"}</div>

                <div style={styles.qInner}>
                  {currentRow ? (
                    <>
                      {(currentRow.help || []).map((text, idx) => {
                        const raw = String(text || "");
                        const special = /^\s*(unknown|unkown|not applicable|n\/a)/i.test(raw);
                        const a = answers[currentRow.id] || { score: null, description: "", unk: false, na: false };

                        if (special) {
                          const isUnknown = /^unk/i.test(raw);
                          const checked = isUnknown ? a.unk === true : a.na === true;
                          return (
                            <label key={idx} style={styles.optionRow(checked)}>
                              {/* radio before option */}
                              <input
                                type="radio"
                                name={`q-${currentRow.id}`}
                                checked={checked}
                                onChange={() => setAnswer(currentRow.id, { score: null, unk: isUnknown, na: !isUnknown })}
                                style={styles.visibleRadio}
                                aria-label={raw}
                                disabled={isSubmitted || isViewOnly}
                              />
                              {/* empty numeric space for alignment */}
                              <div style={styles.optionNumber(false, checked)} />
                              <div style={styles.optionBody}>
                                <div style={{ color: "#374151" }}>{raw}</div>
                              </div>
                            </label>
                          );
                        }

                        const checked = (answers[currentRow.id] || {}).score === idx;
                        return (
                          <label key={idx} style={styles.optionRow(checked)}>
                            <input
                              type="radio"
                              name={`q-${currentRow.id}`}
                              checked={checked}
                              onChange={() => {
                                setAnswer(currentRow.id, { score: idx, unk: false, na: false });
                              }}
                              style={styles.visibleRadio}
                              aria-label={`Option ${idx}: ${raw}`}
                              disabled={isSubmitted || isViewOnly}
                            />

                            {/* plain number label (no box) */}
                            <div style={styles.optionNumber(true, checked)}>{idx}</div>

                            <div style={styles.optionBody}>
                              <div style={{ color: "#111827" }}>{raw}</div>
                            </div>
                          </label>
                        );
                      })}

                      {shouldShowDescribe && (
                        <div style={{ marginTop: 24 }}>
                          <label style={{ fontWeight: 50, marginBottom: 6 }}>
                            Describe <span style={{ color: "#eb0606ff", fontWeight: 700 }}>*</span>
                          </label>
                          <textarea
                            style={{
                              ...styles.describeArea,
                              border: missingDescriptions.has(currentRow.id) ? "1px solid #6b7280" : "1px solid #d1d5db",
                            }}
                            placeholder="Explain the description here"
                            value={(answers[currentRow.id] || {}).description || ""}
                            onChange={(e) => setAnswer(currentRow.id, { description: e.target.value })}
                            disabled={isSubmitted || isViewOnly}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ color: "#6b7280" }}>No questions in this section.</div>
                  )}
                </div>
              </div>
            </div>

          {/* Footer - below the question */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, width: "100%" }}>
            {/* Left side: Save as Draft inside the container */}
            <div style={{ display: "flex", gap: 16 }}>
              <button
                type="button"
                style={{ ...styles.btn, ...(saveDisabled ? styles.disabledBtn : {}) }}
                onClick={() => { if (!saveDisabled) handleSaveDraft(); }}
                disabled={saveDisabled}
                aria-disabled={saveDisabled}
              >
                {isSaving ? "Saving..." : isAutosaving ? "Autosaving..." : "Save as Draft & Close Form"}
              </button>
            </div>

            {/* Right side: Back / Next navigation */}
            <div style={{ display: "flex", gap: 16 }}>
              <button type="button" style={{ ...styles.btn, ...(isFirst ? styles.disabledBtn : {}) }} onClick={goPrev} disabled={isFirst}>
                Back
              </button>
              <button 
                type="button" 
                style={{ 
                  ...styles.btnPrimary, 
                  ...((isLast && isViewOnly) ? styles.disabledBtn : {}) 
                }} 
                onClick={goNext}
                disabled={isLast && isViewOnly}
              >
                Next
              </button>
            </div>
          </div>
          </div>
          </div>
          </>
          )}
        </section>

        {/* Confirmation modal */}
          {confirmOpen && (
            <div style={styles.confirmOverlay}>
              <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" style={styles.confirmBox}>
                <div id="confirm-title" style={{ fontWeight: 700, marginBottom: 8 }}>Confirm submission</div>
                <div style={{ color: "#374151" }}>Are you sure you want to submit the form? This action will finalize the assessment.</div>
                <div style={styles.confirmButtons}>
                  <button
                    type="button"
                    style={styles.btn}
                    onClick={() => setConfirmOpen(false)}
                    disabled={isSaving}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.btnPrimary, ...(isSaving ? styles.disabledBtn : {}) }}
                    onClick={async () => {
                      setConfirmOpen(false);
                      // call existing handler which handles isSaving/isSubmitted logic
                      await handleComplete();
                    }}
                    disabled={isSaving}
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
  }
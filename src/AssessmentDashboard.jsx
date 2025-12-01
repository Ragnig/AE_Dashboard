import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, CheckCircle, Clock, FileText, X, Search, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './dashboard.css';
import FAREQuestionnaire from './FAREQuestionnaire';
import CANSForm from './CANSForm';
import ResidentialForm from './Residentialform';
 
export default function AssessmentDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // 'fare', 'cans', 'residential', or null
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showEmpty, setShowEmpty] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
 
  // Filter states
  const [filterColumn, setFilterColumn] = useState('all');
  const [filterValue, setFilterValue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState('');
 
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 
  useEffect(() => {
    loadAssessments();
   
    // Check URL hash for direct assessment links (from new tabs)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#assessment/')) {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        const formType = parts[1]; // 'cans', 'fare', 'residential'
        const assessmentId = parts[2];
        
        // Try to get additional data from URL params (for private windows)
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
       
        console.log('🔗 Loading from URL hash:', formType, assessmentId);
       
        // First, try to get from URL encoded data (works in private windows)
        if (encodedData) {
          try {
            const assessmentData = JSON.parse(atob(encodedData));
            if (assessmentData.id === assessmentId) {
              setSelectedDraft(assessmentData);
              setActiveForm(formType);
              console.log('✅ Assessment loaded from URL encoded data (private window compatible)');
              return;
            }
          } catch (error) {
            console.error('Failed to parse encoded data from URL:', error);
          }
        }
       
        // Check localStorage first (for new tabs), then sessionStorage (for same tab)
        let savedDraftData = null;
        try {
          savedDraftData = localStorage.getItem('currentAssessmentDraft') || sessionStorage.getItem('selectedDraft');
        } catch (error) {
          console.log('Storage not accessible (private window)');
        }
        
        if (savedDraftData) {
          try {
            const draftData = JSON.parse(savedDraftData);
            if (draftData.id === assessmentId) {
              setSelectedDraft(draftData);
              setActiveForm(formType);
              // Clear the localStorage temp data after using it
              try {
                localStorage.removeItem('currentAssessmentDraft');
              } catch (error) {
                console.log('Cannot clear localStorage in private window');
              }
              console.log('✅ Assessment loaded from storage');
              return;
            }
          } catch (error) {
            console.error('Failed to parse draft from storage:', error);
          }
        }
       
        // If not in storage, try to load from localStorage assessments
        try {
          const stored = localStorage.getItem('assessments');
          if (stored) {
            const allAssessments = JSON.parse(stored);
            const assessment = allAssessments.find(a => a.id === assessmentId);
            if (assessment) {
              setSelectedDraft(assessment);
              setActiveForm(formType);
              console.log('✅ Assessment loaded from localStorage assessments');
              return;
            }
          }
        } catch (error) {
          console.error('Failed to load assessment from localStorage:', error);
        }
        
        // If we reach here, create a basic assessment object for private windows
        console.log('⚠️ Creating basic assessment for private window');
        const basicAssessment = {
          id: assessmentId,
          caseId: 'N/A',
          type: formType.toUpperCase() === 'CANS' ? 'CANS' : formType.toUpperCase() === 'FARE' ? 'F.A.R.E' : 'Residential',
          status: 'In-progress',
          createdBy: 'User',
          createdOn: new Date().toLocaleString(),
          submittedOn: null,
          data: {}
        };
        setSelectedDraft(basicAssessment);
        setActiveForm(formType);
      }
    }
   
    // Check for active form in sessionStorage (for page refresh recovery)
    const savedActiveForm = sessionStorage.getItem('activeForm');
    const savedDraftData = sessionStorage.getItem('selectedDraft');
   
    if (savedActiveForm && !hash.startsWith('#assessment/')) {
      setActiveForm(savedActiveForm);
      if (savedDraftData) {
        try {
          setSelectedDraft(JSON.parse(savedDraftData));
        } catch (error) {
          console.error('Failed to parse saved draft data:', error);
        }
      }
    }
  }, []);
 
  // Save activeForm to sessionStorage whenever it changes
  useEffect(() => {
    if (activeForm) {
      sessionStorage.setItem('activeForm', activeForm);
      if (selectedDraft) {
        sessionStorage.setItem('selectedDraft', JSON.stringify(selectedDraft));
        // Update URL hash for shareable/bookmarkable links
        window.location.hash = `#assessment/${activeForm}/${selectedDraft.id}`;
      }
    } else {
      // Clear when returning to dashboard
      sessionStorage.removeItem('activeForm');
      sessionStorage.removeItem('selectedDraft');
      window.location.hash = '';
    }
  }, [activeForm, selectedDraft]);
 
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterColumn, filterValue, searchQuery]);
 
  const loadAssessments = () => {
    try {
      const stored = localStorage.getItem('assessments');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only use localStorage data if it's not empty
        if (parsed && parsed.length > 0) {
          setAssessments(parsed);
          return;
        }
      }
     
      // If localStorage is empty, start with empty array
      setAssessments([]);
     
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };
 
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setShowEmpty(false);
   
    // Clear all filters and reset to default view
    setFilterColumn('all');
    setFilterValue('all');
    setSearchQuery('');
    setActiveDropdown(null);
    setDropdownSearch('');
    setCurrentPage(1);
   
    // Add a small delay to show the animation
    await new Promise(resolve => setTimeout(resolve, 500));
   
    loadAssessments();
    setIsRefreshing(false);
  };
 
  const saveAssessment = (assessment) => {
    try {
      const updatedAssessments = [...assessments];
      const existingIndex = updatedAssessments.findIndex(a => a.id === assessment.id);
     
      if (existingIndex >= 0) {
        updatedAssessments[existingIndex] = assessment;
      } else {
        updatedAssessments.unshift(assessment); // Add new assessments to the top
      }
     
      // Update both localStorage and state immediately
      localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
      setAssessments(updatedAssessments);
      console.log('🔵 Updated assessments array:', updatedAssessments);
      
      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      return false;
    }
  };
 
  const handleCANSSave = (data) => {
    console.log('🔵 handleCANSSave called with data:', data);
    
    // Use existing ID from selectedDraft if available, otherwise use data.id
    const assessmentId = selectedDraft?.id || data.id || `CANS-${Date.now()}`;
    console.log('🔵 Assessment ID:', assessmentId);
   
    // Find existing assessment to preserve creation details
    const existingAssessment = assessments.find(a => a.id === assessmentId);
    console.log('🔵 Existing assessment:', existingAssessment);
    
    // Use case ID from data, with fallback to hardcoded value
    let caseId = data.caseId || "123456";
    console.log('🔵 Case ID:', caseId);
   
    const newAssessment = {
      id: assessmentId,
      caseId: caseId,
      type: 'CANS',
      createdBy: data.createdBy || 'Current User',
      status: data.status || 'In-progress',
      createdOn: existingAssessment?.createdOn || new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      submittedOn: data.status === 'Completed' 
        ? (existingAssessment?.submittedOn || new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }))
        : null,
      overview: data.overview,
      answers: data.answers,
      data: data
    };
    
    console.log('🔵 New assessment object:', newAssessment);
   
    const saved = saveAssessment(newAssessment);
    console.log('🔵 Save result:', saved);
   
    if (saved) {
      console.log('🔵 Assessment saved successfully');
      // No need for additional loadAssessments() or state updates since saveAssessment handles it
      
      // ✅ FIXED: Only show alerts and close form for manual saves (not auto-saves)
      if (!data.autoSaved) {
        if (data.status === 'Completed') {
          // For completed status, keep form open to show SubmitSuccessScreen
          // Success screen will handle closing via onClose
        } else {
          // For draft status, show alert and close form
          alert('✅ CANS assessment saved as draft!');
          setActiveForm(null);
          setSelectedDraft(null);
        }
      }
      // For auto-saves: just save silently in background, don't close form or show alerts
      // User stays on the form and can continue working
    } else {
      // Only show error alerts for manual saves (not auto-saves)
      if (!data.autoSaved) {
        alert('Failed to save assessment. Please try again.');
      }
    }
  };
 
  const handleFARESave = (data) => {
    // Use existing ID from selectedDraft if available, otherwise create new one
    const assessmentId = selectedDraft?.id || data.id || `${Math.floor(100000 + Math.random() * 900000)}`;
   
    // Find existing assessment to preserve creation details
    const existingAssessment = assessments.find(a => a.id === assessmentId);
   
    const newAssessment = {
      id: assessmentId,
      caseId: data.caseId || 'N/A',
      type: 'F.A.R.E',
      status: data.status || 'In-progress',
      createdBy: existingAssessment?.createdBy || data.createdBy || 'Current User',
      createdOn: existingAssessment?.createdOn || new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      submittedOn: (data.status === 'Completed') ? new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) : existingAssessment?.submittedOn || null,
      overview: data.overview,
      answers: data.answers,
      data: data
    };
   
    const saved = saveAssessment(newAssessment);
   
    if (saved) {
      // ✅ FIXED: Only show alerts and close form for manual saves (not auto-saves)
      if (!data.autoSaved) {
        if (data.status === 'Completed') {
          alert('✅ FARE assessment submitted successfully!');
          setActiveForm(null);
          setSelectedDraft(null);
          loadAssessments();
        } else {
          alert('✅ FARE assessment saved as draft!');
          setActiveForm(null);
          setSelectedDraft(null);
          loadAssessments();
        }
      }
      // For auto-saves: just save silently in background, don't close form or show alerts
      // User stays on the form and can continue working
    } else {
      // Only show error alerts (not for auto-saves)
      if (!data.autoSaved) {
        alert('Failed to save assessment. Please try again.');
      }
    }
  };
 
  const handleResidentialSave = (data) => {
    // Use existing ID from selectedDraft if available, otherwise create new one
    const assessmentId = selectedDraft?.id || data.id || `${Math.floor(100000 + Math.random() * 900000)}`;
   
    // Find existing assessment to preserve creation details
    const existingAssessment = assessments.find(a => a.id === assessmentId);
   
    const newAssessment = {
      id: assessmentId,
      caseId: data.contract_number || 'N/A',
      type: 'Residential',
      status: data.status || 'In-progress',
      createdBy: existingAssessment?.createdBy || data.createdBy || 'Current User',
      createdOn: existingAssessment?.createdOn || new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      submittedOn: (data.status === 'Completed') ? new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) : existingAssessment?.submittedOn || null,
      data: data
    };
   
    const saved = saveAssessment(newAssessment);
   
    if (saved) {
      // ✅ FIXED: Only show alerts and close form for manual saves (not auto-saves)
      if (!data.autoSaved) {
        if (data.status === 'Completed') {
          alert('✅ Residential assessment submitted successfully!');
        } else {
          alert('✅ Residential assessment saved as draft!');
        }
        setActiveForm(null);
        setSelectedDraft(null);
        loadAssessments();
      }
      // For auto-saves: just save silently in background, don't close form or show alerts
      // User stays on the form and can continue working
    } else {
      // Only show error alerts for manual saves (not auto-saves)
      if (!data.autoSaved) {
        alert('Failed to save assessment. Please try again.');
      }
    }
  };
 
  const handleCloseForm = () => {
    setActiveForm(null);
    setSelectedDraft(null);
    // Clear URL hash
    window.location.hash = '';
    // Session will be cleared by the useEffect above
  };
 
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-in-progress';
    }
  };
 
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="icon-sm" />;
      case 'in-progress':
        return <Clock className="icon-sm" />;
      default:
        return <Clock className="icon-sm" />;
    }
  };
 
  const filteredAssessments = assessments.filter(assessment => {
    // Search functionality
    const matchesSearch = searchQuery === '' ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Column-based filtering
    let matchesFilter = true;
    if (filterColumn !== 'all' && filterValue !== 'all') {
      switch (filterColumn) {
        case 'assessmentId':
          matchesFilter = assessment.id.toLowerCase().includes(filterValue.toLowerCase());
          break;
        case 'caseId':
          matchesFilter = assessment.caseId.toLowerCase().includes(filterValue.toLowerCase());
          break;
        case 'assessmentType':
          matchesFilter = assessment.type === filterValue;
          break;
        case 'status':
          matchesFilter = assessment.status.toLowerCase() === filterValue.toLowerCase();
          break;
        case 'createdBy':
          matchesFilter = assessment.createdBy === filterValue;
          break;
        case 'createdOn':
          const assessmentDate = new Date(assessment.createdOn);
          const now = new Date();
          switch(filterValue) {
            case 'today':
              matchesFilter = assessmentDate.toDateString() === now.toDateString();
              break;
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesFilter = assessmentDate >= weekAgo;
              break;
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              matchesFilter = assessmentDate >= monthAgo;
              break;
          }
          break;
        case 'submittedOn':
          if (filterValue === 'submitted') {
            matchesFilter = assessment.submittedOn && assessment.submittedOn !== '-';
          } else if (filterValue === 'notSubmitted') {
            matchesFilter = !assessment.submittedOn || assessment.submittedOn === '-';
          }
          break;
      }
    }
   
    return matchesSearch && matchesFilter;
  });
 
  // Pagination calculations
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex);
 
  const goToPage = (page) => {
    setCurrentPage(page);
  };
 
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
 
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
 
  const clearFilters = () => {
    setFilterColumn('all');
    setFilterValue('all');
    setSearchQuery('');
  };
 
  const hasActiveFilters = filterColumn !== 'all' || filterValue !== 'all' || searchQuery !== '';

  // Handle column header dropdown
  const handleColumnClick = (column, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Dropdown clicked for:', column);
    
    if (activeDropdown === column) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(column);
      setFilterColumn(column);
      setDropdownSearch('');
    }
  };

  // Handle filter selection from dropdown
  const handleFilterSelect = (value) => {
    setFilterValue(value);
    setActiveDropdown(null);
    setDropdownSearch('');
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setDropdownSearch('');
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Get filtered dropdown options based on search
  const getFilteredOptions = (column) => {
    let options = [];
    
    switch (column) {
      case 'assessmentId':
        options = [...new Set(assessments.map(a => a.id).filter(Boolean))];
        break;
      case 'caseId':
        options = [...new Set(assessments.map(a => a.caseId).filter(Boolean))];
        break;
      case 'assessmentType':
        options = ['CANS', 'F.A.R.E', 'Residential'];
        break;
      case 'status':
        options = ['Completed', 'In Progress'];
        break;
      case 'createdBy':
        options = [...new Set(assessments.map(a => a.createdBy).filter(Boolean))];
        break;
      case 'createdOn':
        options = ['Today', 'Last 7 Days', 'Last 30 Days'];
        break;
      case 'submittedOn':
        options = ['Submitted', 'Not Submitted'];
        break;
      default:
        options = [];
    }
    
    if (dropdownSearch.trim()) {
      return options.filter(option => 
        option.toString().toLowerCase().includes(dropdownSearch.toLowerCase())
      );
    }
    
    return options;
  };

  // Get unique values for Created By filter
  const uniqueCreatedBy = [...new Set(assessments.map(assessment => assessment.createdBy).filter(Boolean))];

  // Get unique values for Assessment ID and Case ID
  const uniqueAssessmentIds = [...new Set(assessments.map(a => a.id).filter(Boolean))];
  const uniqueCaseIds = [...new Set(assessments.map(a => a.caseId).filter(Boolean))];

  // Get filter options for dropdowns
  const getFilterOptions = () => {
    switch (filterColumn) {
      case 'assessmentType':
        return [
          { value: 'CANS', label: 'CANS' },
          { value: 'F.A.R.E', label: 'F.A.R.E' },
          { value: 'Residential', label: 'Residential' }
        ];
      case 'status':
        return [
          { value: 'completed', label: 'Completed' },
          { value: 'in-progress', label: 'In Progress' }
        ];
      case 'createdOn':
        return [
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'Last 7 Days' },
          { value: 'month', label: 'Last 30 Days' }
        ];
      case 'createdBy':
        return uniqueCreatedBy.map(user => ({ value: user, label: user }));
      case 'submittedOn':
        return [
          { value: 'submitted', label: 'Submitted' },
          { value: 'notSubmitted', label: 'Not Submitted' }
        ];
      default:
        return [];
    }
  };

  // If a form is active, show only the form
  if (activeForm) {
    return (
      <div className="form-container">
        <div className="form-header">
          <button className="back-button" onClick={handleCloseForm}>
            <ArrowLeft className="icon-sm" />
            Back to Dashboard
          </button>
        </div>
       
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {activeForm === 'fare' && (
            <FAREQuestionnaire
              onClose={handleCloseForm}
              onSave={handleFARESave}
              draftData={selectedDraft}
            />
          )}
         
          {activeForm === 'cans' && (
            <CANSForm
              onClose={handleCloseForm}
              onSave={handleCANSSave}
              draftData={selectedDraft}
            />
          )}
         
          {activeForm === 'residential' && (
            <ResidentialForm
              onClose={handleCloseForm}
              onSave={handleResidentialSave}
              draftData={selectedDraft}
            />
          )}
        </div>
      </div>
    );
  }
 
  // Otherwise show the dashboard
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content-center">
          <h1 className="header-title-center">
            ASSESSMENT ENGINE DASHBOARD
          </h1>
        </div>
      </div>
 
      <div className="main-content">
        <div>
          <div className="section-header">
            <FileText />
            <h2>List of Assessments</h2>
          </div>
          <div className="assessment-cards">
            <div className="assessment-card" onClick={() => setActiveForm('cans')}>
              <div className="assessment-card-icon cans">📋</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Child and Adolescent Needs and Strengths (CANS)
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>
 
            <div className="assessment-card" onClick={() => setActiveForm('fare')}>
              <div className="assessment-card-icon fare">📝</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Foster Care Rating At Exit Interview (F.A.R.E)
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>
 
            <div className="assessment-card" onClick={() => setActiveForm('residential')}>
              <div className="assessment-card-icon residential">🏢</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Residential Contract Performance Monitoring
                </div>
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>
          </div>
        </div>
 
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <CheckCircle className="icon" />
              My Assessments
              <span className="results-count">{filteredAssessments.length} of {assessments.length} results</span>
            </h2>
            <button
              onClick={handleRefresh}
              className="refresh-button"
              disabled={isRefreshing}
            >
              <RefreshCw className={`icon-sm ${isRefreshing ? 'spinning' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="table-container">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('assessmentId', e)}>
                      <span>Assessment ID <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'assessmentId' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-search">
                          <input
                            type="text"
                            placeholder="Search Assessment ID..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="dropdown-search-input"
                          />
                        </div>
                        {/* <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Assessment IDs</div> */}
                        {assessments.map(a => a.id).filter((id, index, self) => self.indexOf(id) === index)
                          .filter(id => id.toLowerCase().includes(dropdownSearch.toLowerCase()))
                          .map(id => (
                          <div key={id} className="dropdown-option" onClick={() => handleFilterSelect(id)}>{id}</div>
                        ))}
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('caseId', e)}>
                      <span>Case ID <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'caseId' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-search">
                          <input
                            type="text"
                            placeholder="Search Case ID..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="dropdown-search-input"
                          />
                        </div>
                        {/* <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Case IDs</div> */}
                        {assessments.map(a => a.caseId).filter((id, index, self) => self.indexOf(id) === index)
                          .filter(id => id.toLowerCase().includes(dropdownSearch.toLowerCase()))
                          .map(id => (
                          <div key={id} className="dropdown-option" onClick={() => handleFilterSelect(id)}>{id}</div>
                        ))}
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('assessmentType', e)}>
                      <span>Assessment Type <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'assessmentType' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Types</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('CANS')}>CANS</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('F.A.R.E')}>F.A.R.E</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('Residential')}>Residential</div>
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('status', e)}>
                      <span>Status <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'status' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Statuses</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('completed')}>Completed</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('in-progress')}>In Progress</div>
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('createdOn', e)}>
                      <span>Created On <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'createdOn' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Dates</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('today')}>Today</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('week')}>Last 7 Days</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('month')}>Last 30 Days</div>
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('createdBy', e)}>
                      <span>Created By <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'createdBy' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-search">
                          <input
                            type="text"
                            placeholder="Search Users..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="dropdown-search-input"
                          />
                        </div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All Users</div>
                        {uniqueCreatedBy.filter(user => user.toLowerCase().includes(dropdownSearch.toLowerCase())).map(user => (
                          <div key={user} className="dropdown-option" onClick={() => handleFilterSelect(user)}>{user}</div>
                        ))}
                      </div>
                    )}
                  </th>
                  <th className="table-header-with-dropdown">
                    <div className="header-content" onClick={(e) => handleColumnClick('submittedOn', e)}>
                      <span>Submitted On <ChevronDown className="dropdown-arrow" /></span>
                      
                    </div>
                    {activeDropdown === 'submittedOn' && (
                      <div className="column-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('all')}>All</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('submitted')}>Submitted</div>
                        <div className="dropdown-option" onClick={() => handleFilterSelect('notSubmitted')}>Not Submitted</div>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {!showEmpty && currentAssessments.length > 0 ? (
                  currentAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>
                        <a
                          href={`${window.location.origin}${window.location.pathname}?data=${btoa(JSON.stringify(assessment))}#assessment/${assessment.type.toLowerCase().replace(/\./g, '').replace(/\s+/g, '')}/${assessment.id}`}
                          className="assessment-link"
                          data-assessment-id={assessment.id}
                          data-assessment-type={assessment.type}
                          onClick={(e) => {
                            // Save data immediately for all click types
                            const assessmentData = JSON.stringify(assessment);
                            
                            try {
                              localStorage.setItem('currentAssessmentDraft', assessmentData);
                              sessionStorage.setItem('selectedDraft', assessmentData);
                            } catch (error) {
                              console.log('Storage not available');
                            }
                            
                            // For modifier keys or special clicks, don't prevent default
                            if (e.ctrlKey || e.metaKey || e.button === 1 || e.button === 2 || e.shiftKey) {
                              // Let the browser handle opening in new tab/window/incognito
                              return true;
                            }
                            
                            // Only prevent default for regular left-clicks
                            e.preventDefault();
                            
                            // Handle same-tab navigation
                            setSelectedDraft(assessment);
                           
                            if (assessment.type === 'CANS') {
                              setActiveForm('cans');
                            }
                            else if (assessment.type === 'F.A.R.E') {
                              setActiveForm('fare');
                            }
                            else if (assessment.type === 'Residential') {
                              setActiveForm('residential');
                            }
                          }}
                          onMouseDown={(e) => {
                            // Save data on mouse down for all click types (including right-click)
                            const assessmentData = JSON.stringify(assessment);
                            try {
                              localStorage.setItem('currentAssessmentDraft', assessmentData);
                              sessionStorage.setItem('selectedDraft', assessmentData);
                            } catch (error) {
                              console.log('Storage not available on mousedown');
                            }
                          }}
                          onContextMenu={(e) => {
                            // Additional save for right-click context menu
                            const assessmentData = JSON.stringify(assessment);
                            try {
                              localStorage.setItem('currentAssessmentDraft', assessmentData);
                              sessionStorage.setItem('selectedDraft', assessmentData);
                            } catch (error) {
                              console.log('Storage not available in context menu');
                            }
                            // Don't prevent default - allow context menu to show
                          }}
                        >
                          {assessment.id}
                        </a>
                      </td>
                      <td>{assessment.caseId}</td>
                      <td>{assessment.type}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(assessment.status)}`}>
                          {getStatusIcon(assessment.status)}
                          {assessment.status}
                        </span>
                      </td>
                      <td>{assessment.createdOn}</td>
                      <td>{assessment.createdBy || 'N/A'}</td>
                      <td>{assessment.submittedOn || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state">
                        <div className="empty-state-content">
                          <div className="empty-state-icon">
                            <FileText />
                          </div>
                          <span className="empty-state-title">No Assessment Found</span>
                          <span className="empty-state-subtitle">
                            No assessments have been performed yet
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
 
          {/* Pagination - only show if more than 10 items */}
          {filteredAssessments.length > itemsPerPage && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                {startIndex + 1} - {Math.min(endIndex, filteredAssessments.length)} of {filteredAssessments.length} (0 selected)
              </div>
             
              <div className="pagination-controls">
                <button
                  className="pagination-arrow"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
 
                <div className="pagination-page-display">
                  Page {currentPage}
                </div>
 
                <button
                  className="pagination-arrow"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
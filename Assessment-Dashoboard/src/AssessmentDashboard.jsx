import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, CheckCircle, Clock, FileText, X, Search, ExternalLink, ArrowLeft } from 'lucide-react';
import './dashboard.css';
import FAREQuestionnaire from './FAREQuestionnaire';
import CANSForm from './CANSForm';
import ResidentialForm from './Residentialform';

export default function AssessmentDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [activeForm, setActiveForm] = useState(null); // 'fare', 'cans', 'residential', or null
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showEmpty, setShowEmpty] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    try {
      const stored = localStorage.getItem('assessments');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAssessments(parsed);
      } else {
        setAssessments([
          {
            id: '345968',
            caseId: '12345',
            type: 'F.A.R.E',
            status: 'Completed',
            createdOn: '08/10/2025'
          },
          {
            id: '789614',
            caseId: '23456',
            type: 'CANS',
            status: 'In-progress',
            createdOn: '11/09/2025'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
  };

  const saveAssessment = (assessment) => {
    try {
      const updatedAssessments = [...assessments];
      const existingIndex = updatedAssessments.findIndex(a => a.id === assessment.id);
      
      if (existingIndex >= 0) {
        updatedAssessments[existingIndex] = assessment;
      } else {
        updatedAssessments.push(assessment);
      }
      
      setAssessments(updatedAssessments);
      localStorage.setItem('assessments', JSON.stringify(updatedAssessments));
      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      return false;
    }
  };

  const handleCANSSave = (data) => {
    const assessmentId = data.id || `CANS-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.caseId || data.overview?.caseId || 'N/A',
      type: 'CANS',
      status: data.status || 'Draft',
      createdOn: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      overview: data.overview,
      answers: data.answers,
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      alert('CANS assessment saved successfully!');
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleFARESave = (data) => {
    const assessmentId = data.id || `FARE-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.caseId || 'N/A',
      type: 'F.A.R.E',
      status: data.status || 'Draft',
      createdOn: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      overview: data.overview,
      answers: data.answers,
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      alert('FARE assessment saved successfully!');
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleResidentialSave = (data) => {
    const assessmentId = data.id || `RES-${Date.now()}`;
    
    const newAssessment = {
      id: assessmentId,
      caseId: data.contract_number || 'N/A',
      type: 'Residential',
      status: data.status || 'Draft',
      createdOn: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      data: data
    };
    
    const saved = saveAssessment(newAssessment);
    
    if (saved) {
      alert('Residential assessment saved successfully!');
      setActiveForm(null);
      setSelectedDraft(null);
      loadAssessments();
    } else {
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setActiveForm(null);
    setSelectedDraft(null);
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
      case 'draft':
        return 'status-in-progress';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="icon-sm" />;
      case 'in-progress':
      case 'draft':
        return <Clock className="icon-sm" />;
      default:
        return null;
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const clearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || searchQuery !== '';

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
        <div className="header-content">
          <h1 className="header-title">
            Assessment Simple Dashboard - Phase 1
          </h1>
          <div className="header-info">
            <div className="header-date">
              <Calendar className="icon-sm" />
              <span>Monday, November 10, 2025</span>
            </div>
            <span>•</span>
            <span>9:59 AM</span>
          </div>
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
                {/* <div className="assessment-card-subtitle">CANS: React App</div> */}
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>

            <div className="assessment-card" onClick={() => setActiveForm('fare')}>
              <div className="assessment-card-icon fare">📝</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  FOSTER CARE RATING AT EXIT INTERVIEW (F.A.R.E)
                </div>
                {/* <div className="assessment-card-subtitle">F.A.R.E: React App</div> */}
              </div>
              <ExternalLink className="assessment-card-arrow" />
            </div>

            <div className="assessment-card" onClick={() => setActiveForm('residential')}>
              <div className="assessment-card-icon residential">🏢</div>
              <div className="assessment-card-content">
                <div className="assessment-card-title">
                  Residential Contract Performance Monitoring
                </div>
                {/* <div className="assessment-card-subtitle">Residential: React App</div> */}
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
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) {
                  loadAssessments();
                }
              }}
              className="refresh-button"
            >
              <RefreshCw className="icon-sm" />
              Refresh
            </button>
          </div>

          <div className="filters-row">
            <div className="filter-search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                className="filter-search"
                placeholder="Search by ID, Case ID, or Type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="CANS">CANS</option>
              <option value="F.A.R.E">F.A.R.E</option>
              <option value="Residential">Residential</option>
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          <div className="table-container">
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Assessment ID</th>
                  <th>Case ID</th>
                  <th>Assessment Type</th>
                  <th>Status</th>
                  <th>Created On</th>
                </tr>
              </thead>
              <tbody>
                {!showEmpty && filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td>
                        <a 
                          href="#" 
                          className="assessment-link"
                          onClick={(e) => {
                            e.preventDefault();
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
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
        </div>
      </div>
    </div>
  );
}
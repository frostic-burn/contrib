import React, { useState, useEffect } from 'react';

interface BreakdownItem {
  [key: string]: string | number;
}


interface ResultData {
  marks: number;
  maxMarks: number;
  type: string;
  breakdown: BreakdownItem;
}

const CUMarksCalculator: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<'theory' | 'hybrid' | 'practical'>('theory');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [gaugePercentage, setGaugePercentage] = useState<number>(0);

  // Theory form state
  const [theoryForm, setTheoryForm] = useState({
    assignment: '',
    attendance: '',
    caseStudy: '',
    mst1: '',
    mst2: ''
  });

  // Hybrid form state
  const [hybridForm, setHybridForm] = useState({
    assignment: '',
    attendance: '',
    caseStudy: '',
    mst1: '',
    mst2: '',
    endSem: '',
    labMst: '',
    assess1: '',
    assess2: '',
    assess3: ''
  });

  // Practical form state
  const [practicalForm, setPracticalForm] = useState({
    labMst: '',
    assess1: '',
    assess2: '',
    assess3: '',
    endSem: ''
  });

  const selectSubject = (subject: 'theory' | 'hybrid' | 'practical') => {
    setCurrentSubject(subject);
    setShowResults(false);
    setResultData(null);
  };

  const calculateTheory = () => {
    const assignment = parseFloat(theoryForm.assignment) || 0;
    const attendance = parseFloat(theoryForm.attendance) || 0;
    const caseStudy = parseFloat(theoryForm.caseStudy) || 0;
    const mst1 = parseFloat(theoryForm.mst1) || 0;
    const mst2 = parseFloat(theoryForm.mst2) || 0;

    const caseStudyConverted = (caseStudy / 16) * 8;
    const mstAverage = (mst1 + mst2) / 2;
    const totalMarks = assignment + attendance + caseStudyConverted + mstAverage;

    displayResults(totalMarks, 40, 'Theory', {
      'Assignment Marks': assignment,
      'Attendance Marks': attendance,
      'Case Study (Converted)': caseStudyConverted.toFixed(2),
      'MST Average': mstAverage.toFixed(2),
      'Total Internal Marks': totalMarks.toFixed(2)
    });
  };

  const calculateHybrid = () => {
    const assignment = parseFloat(hybridForm.assignment) || 0;
    const attendance = parseFloat(hybridForm.attendance) || 0;
    const caseStudy = parseFloat(hybridForm.caseStudy) || 0;
    const mst1 = parseFloat(hybridForm.mst1) || 0;
    const mst2 = parseFloat(hybridForm.mst2) || 0;
    const endSem = parseFloat(hybridForm.endSem) || 0;
    const labMst = parseFloat(hybridForm.labMst) || 0;
    const assess1 = parseFloat(hybridForm.assess1) || 0;
    const assess2 = parseFloat(hybridForm.assess2) || 0;
    const assess3 = parseFloat(hybridForm.assess3) || 0;

    const assignmentWeighted = (assignment / 12) * 6;
    const caseStudyWeighted = (caseStudy / 16) * 8;
    const mstAverage = (mst1 + mst2) / 4;
    const endSemWeighted = (endSem / 40) * 20;
    const labMstWeighted = (labMst / 15) * 4;
    const totalAssessmentsWeighted = (((assess1 + assess2 + assess3) / 3) / 15) * 20;

    const totalMarks = assignmentWeighted + attendance + caseStudyWeighted + mstAverage +
                     totalAssessmentsWeighted + endSemWeighted + labMstWeighted;

    displayResults(totalMarks, 70, 'Hybrid', {
      'Assignment (Weighted)': assignmentWeighted.toFixed(2),
      'Attendance Marks': attendance,
      'Case Study (Weighted)': caseStudyWeighted.toFixed(2),
      'MST Average': mstAverage.toFixed(2),
      'Assessments (Weighted)': totalAssessmentsWeighted.toFixed(2),
      'End Sem (Weighted)': endSemWeighted.toFixed(2),
      'Lab MST (Weighted)': labMstWeighted.toFixed(2),
      'Total Internal Marks': totalMarks.toFixed(2)
    });
  };

  const calculatePractical = () => {
    const labMst = parseFloat(practicalForm.labMst) || 0;
    const assess1 = parseFloat(practicalForm.assess1) || 0;
    const assess2 = parseFloat(practicalForm.assess2) || 0;
    const assess3 = parseFloat(practicalForm.assess3) || 0;
    const endSem = parseFloat(practicalForm.endSem) || 0;

    const adjustedLabMarks = (labMst / 15) * 15;
    const totalAssessments = assess1 + assess2 + assess3;
    const finalMarks = totalAssessments + adjustedLabMarks + endSem;

    displayResults(finalMarks, 100, 'Practical', {
      'Lab MST (Adjusted)': adjustedLabMarks.toFixed(2),
      'Assessment 1': assess1,
      'Assessment 2': assess2,
      'Assessment 3': assess3,
      'End Semester Practical': endSem,
      'Final Marks': finalMarks.toFixed(2)
    });
  };

  const displayResults = (marks: number, maxMarks: number, type: string, breakdown: BreakdownItem) => {
    const percentage = Math.min((marks / maxMarks) * 100, 100);
    
    setResultData({ marks, maxMarks, type, breakdown });
    setGaugePercentage(percentage);
    setShowResults(true);
  };

  const updateTheoryForm = (field: keyof typeof theoryForm, value: string) => {
    setTheoryForm(prev => ({ ...prev, [field]: value }));
  };

  const updateHybridForm = (field: keyof typeof hybridForm, value: string) => {
    setHybridForm(prev => ({ ...prev, [field]: value }));
  };

  const updatePracticalForm = (field: keyof typeof practicalForm, value: string) => {
    setPracticalForm(prev => ({ ...prev, [field]: value }));
  };

  const getGaugeColor = (percentage: number): string => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (gaugePercentage / 100) * circumference;

  return (
    <div className="min-h-screen p-5" style={{ background: '#ad1c1c' }}>
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-3">
            CU Internal Marks Calculator
          </h1>
          <p className="text-gray-600 text-lg">Calculate your internal marks for various subjects</p>
        </div>

        {/* Subject Selector */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {[
            { key: 'theory', label: 'Theory (40 marks)' },
            { key: 'hybrid', label: 'Hybrid (70 marks)' },
            { key: 'practical', label: 'Practical (100 marks)' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => selectSubject(key as 'theory' | 'hybrid' | 'practical')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                currentSubject === key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Theory Calculator */}
        {currentSubject === 'theory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'assignment', label: 'Assignment Marks' },
                { key: 'attendance', label: 'Attendance Marks' },
                { key: 'caseStudy', label: 'Case Study Marks (out of 16)', max: '16' },
                { key: 'mst1', label: 'MST 1 Marks' },
                { key: 'mst2', label: 'MST 2 Marks' }
              ].map(({ key, label, max }) => (
                <div key={key} className="bg-gray-50 p-5 rounded-2xl border-2 border-transparent hover:border-indigo-300 transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={max}
                    value={theoryForm[key as keyof typeof theoryForm]}
                    onChange={(e) => updateTheoryForm(key as keyof typeof theoryForm, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculateTheory}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Calculate Theory Marks
            </button>
          </div>
        )}

        {/* Hybrid Calculator */}
        {currentSubject === 'hybrid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'assignment', label: 'Assignment Marks (out of 12)', max: '12' },
                { key: 'attendance', label: 'Attendance Marks' },
                { key: 'caseStudy', label: 'Case Study Marks (out of 16)', max: '16' },
                { key: 'mst1', label: 'MST 1 Marks' },
                { key: 'mst2', label: 'MST 2 Marks' },
                { key: 'endSem', label: 'End Semester Practical (out of 40)', max: '40' },
                { key: 'labMst', label: 'Lab MST Marks (out of 15)', max: '15' },
                { key: 'assess1', label: 'Assessment 1 (out of 15)', max: '15' },
                { key: 'assess2', label: 'Assessment 2 (out of 15)', max: '15' },
                { key: 'assess3', label: 'Assessment 3 (out of 15)', max: '15' }
              ].map(({ key, label, max }) => (
                <div key={key} className="bg-gray-50 p-5 rounded-2xl border-2 border-transparent hover:border-indigo-300 transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={max}
                    value={hybridForm[key as keyof typeof hybridForm]}
                    onChange={(e) => updateHybridForm(key as keyof typeof hybridForm, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculateHybrid}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Calculate Hybrid Marks
            </button>
          </div>
        )}

        {/* Practical Calculator */}
        {currentSubject === 'practical' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'labMst', label: 'Lab MST Marks (out of 15)', max: '15' },
                { key: 'assess1', label: 'Assessment 1' },
                { key: 'assess2', label: 'Assessment 2' },
                { key: 'assess3', label: 'Assessment 3' },
                { key: 'endSem', label: 'End Semester Practical' }
              ].map(({ key, label, max }) => (
                <div key={key} className="bg-gray-50 p-5 rounded-2xl border-2 border-transparent hover:border-indigo-300 transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={max}
                    value={practicalForm[key as keyof typeof practicalForm]}
                    onChange={(e) => updatePracticalForm(key as keyof typeof practicalForm, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={calculatePractical}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Calculate Practical Marks
            </button>
          </div>
        )}

        {/* Results Section */}
        {showResults && resultData && (
          <div className="mt-8 text-center bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
            {/* Gauge */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={getGaugeColor(gaugePercentage)}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {Math.round(gaugePercentage)}%
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your {resultData.type} Internal Marks: {resultData.marks.toFixed(2)}/{resultData.maxMarks}
            </h2>

            {/* Breakdown */}
            <div className="bg-white p-6 rounded-xl text-left max-w-md mx-auto">
              {Object.entries(resultData.breakdown).map(([key, value], index, array) => (
                <div
                  key={key}
                  className={`flex justify-between py-2 ${
                    index === array.length - 1
                      ? 'border-t-2 border-indigo-200 pt-4 font-bold text-indigo-600'
                      : 'border-b border-gray-200'
                  }`}
                >
                  <span>{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-gray-600">
            Made with ❤️ by{' '}
            <a
              href="https://atinders-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold hover:underline transition-colors duration-300"
            >
              Atinder
            </a>
        <p className="text-gray-600 text-lg">Not Affiliated with Chandigarh University in any way</p>

          </p>
        </div>
      </div>
    </div>
  );
};

export default CUMarksCalculator;

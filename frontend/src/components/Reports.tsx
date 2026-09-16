import React, { useState } from 'react';

import { getRoomUsageReport, getPeakHoursReport } from '../services/reportService';


 

const Reports: React.FC = () => {

  const [fromDate, setFromDate] = useState('');

  const [toDate, setToDate] = useState('');

  const [roomUsageData, setRoomUsageData] = useState<Record<string, number> | null>(null);

  const [peakHoursData, setPeakHoursData] = useState<Record<number, number> | null>(null);

  const [loadingRoomUsage, setLoadingRoomUsage] = useState(false);

  const [loadingPeakHours, setLoadingPeakHours] = useState(false);

  const [error, setError] = useState('');


 

  const getYesterdayDate = (): string => {

    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const year = yesterday.getFullYear();

    const month = String(yesterday.getMonth() + 1).padStart(2, '0');

    const day = String(yesterday.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

  };


 

  const validateDates = (): boolean => {

    setError('');

   

    if (!fromDate || !toDate) {

      setError('Please select both From Date and To Date.');

      return false;

    }

   

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const from = new Date(fromDate);

    const to = new Date(toDate);

   

    // Validate that dates are in the past

    if (from >= today) {

      setError('From date must be in the past. Reports can only be generated for completed bookings.');

      return false;

    }

   

    if (to >= today) {

      setError('To date must be in the past. Reports can only be generated for completed bookings.');

      return false;

    }

   

    // Validate that from date is before to date

    if (from > to) {

      setError('From date must be earlier than or equal to To date.');

      return false;

    }

   

    return true;

  };


 

  const handleGenerateRoomUsageReport = async () => {

    if (!validateDates()) return;

   

    setLoadingRoomUsage(true);

    setPeakHoursData(null); // Clear the other report


 

    try {

      const roomUsage = await getRoomUsageReport(fromDate, toDate);

      setRoomUsageData(roomUsage);

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to generate room usage report');

    } finally {

      setLoadingRoomUsage(false);

    }

  };


 

  const handleGeneratePeakHoursReport = async () => {

    if (!validateDates()) return;

   

    setLoadingPeakHours(true);

    setRoomUsageData(null); // Clear the other report


 

    try {

      const peakHours = await getPeakHoursReport(fromDate, toDate);

      setPeakHoursData(peakHours);

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to generate peak hours report');

    } finally {

      setLoadingPeakHours(false);

    }

  };


 

  const formatHour = (hour: number): string => {

    if (hour === 0) return '12:00 AM';

    if (hour < 12) return `${hour}:00 AM`;

    if (hour === 12) return '12:00 PM';

    return `${hour - 12}:00 PM`;

  };


 

  const getMaxValue = (data: Record<number, number> | Record<string, number>): number => {

    return Math.max(...Object.values(data), 1);

  };


 

  return (

    <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

      <div className="card-body p-4">

        <div className="d-flex align-items-center mb-4">

          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>

            <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="url(#gradient6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

            <defs>

              <linearGradient id="gradient6" x1="3" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">

                <stop stopColor="#4f46e5"/>

                <stop offset="1" stopColor="#06b6d4"/>

              </linearGradient>

            </defs>

          </svg>

          <h5 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reports & Analytics</h5>

        </div>


 

        <div className="mb-4" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px' }}>

          <div className="row g-3">

            <div className="col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>📅 From Date</label>

              <input

                type="date"

                className="form-control"

                value={fromDate}

                max={getYesterdayDate()}

                onChange={(e) => setFromDate(e.target.value)}

              />

            </div>

            <div className="col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>📅 To Date</label>

              <input

                type="date"

                className="form-control"

                value={toDate}

                max={getYesterdayDate()}

                onChange={(e) => setToDate(e.target.value)}

              />

            </div>

            <div className="col-md-6">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Generate Report</label>

              <div className="d-flex gap-2">

                <button

                  type="button"

                  className="btn btn-success flex-fill"

                  onClick={handleGenerateRoomUsageReport}

                  disabled={loadingRoomUsage || loadingPeakHours}

                  style={{ padding: '0.625rem', fontWeight: 600 }}

                >

                  {loadingRoomUsage ? (

                    <>

                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                      Loading...

                    </>

                  ) : (

                    <>

                      📊 Room Usage

                    </>

                  )}

                </button>

                <button

                  type="button"

                  className="btn btn-info flex-fill"

                  onClick={handleGeneratePeakHoursReport}

                  disabled={loadingRoomUsage || loadingPeakHours}

                  style={{ padding: '0.625rem', fontWeight: 600, color: 'white' }}

                >

                  {loadingPeakHours ? (

                    <>

                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                      Loading...

                    </>

                  ) : (

                    <>

                      ⏰ Peak Hours

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>


 

        {error && (

          <div className="alert alert-danger" role="alert">

            {error}

          </div>

        )}


 

        {(roomUsageData || peakHoursData) && (

          <div className="row">

            {/* Room Usage Report */}

            {roomUsageData && (

              <div className="col-md-6 mb-4">

                <div className="card shadow-custom" style={{ borderRadius: '12px', overflow: 'hidden', height: '100%' }}>

                  <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '1rem 1.25rem' }}>

                    <h6 className="mb-0" style={{ fontWeight: 700, fontSize: '1.1rem' }}>📈 Room Usage Report</h6>

                  </div>

                  <div className="card-body" style={{ padding: '1.5rem' }}>

                    {Object.keys(roomUsageData).length === 0 ? (

                      <div className="text-center py-4">

                        <p className="text-muted">No bookings found in this date range</p>

                      </div>

                    ) : (

                      <div>

                        <table className="table table-hover" style={{ marginBottom: '1.5rem' }}>

                          <thead>

                            <tr>

                              <th style={{ fontWeight: 700, fontSize: '0.85rem' }}>Room Name</th>

                              <th className="text-end" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Bookings</th>

                              <th style={{ width: '40%', fontWeight: 700, fontSize: '0.85rem' }}>Usage</th>

                            </tr>

                          </thead>

                          <tbody>

                            {Object.entries(roomUsageData)

                              .sort(([, a], [, b]) => b - a)

                              .map(([room, count]) => (

                                <tr key={room}>

                                  <td style={{ fontWeight: 600 }}>{room}</td>

                                  <td className="text-end"><span className="badge bg-success" style={{ fontSize: '0.85rem' }}>{count}</span></td>

                                  <td>

                                    <div className="progress" style={{ height: '24px', borderRadius: '8px' }}>

                                      <div

                                        className="progress-bar"

                                        role="progressbar"

                                        style={{

                                          width: `${(count / getMaxValue(roomUsageData)) * 100}%`,

                                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',

                                          fontWeight: 600,

                                          fontSize: '0.85rem'

                                        }}

                                      >

                                        {count > 0 && count}

                                      </div>

                                    </div>

                                  </td>

                                </tr>

                              ))}

                          </tbody>

                        </table>

                        <div className="alert alert-success" style={{ marginBottom: 0 }}>

                          <strong>📊 Total Bookings:</strong>{' '}

                          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>

                            {Object.values(roomUsageData).reduce((a, b) => a + b, 0)}

                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            )}


 

            {/* Peak Hours Report */}

            {peakHoursData && (

              <div className="col-md-6 mb-4">

                <div className="card shadow-custom" style={{ borderRadius: '12px', overflow: 'hidden', height: '100%' }}>

                  <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '1rem 1.25rem' }}>

                    <h6 className="mb-0" style={{ fontWeight: 700, fontSize: '1.1rem' }}>⏰ Peak Hours Report</h6>

                  </div>

                  <div className="card-body" style={{ padding: '1.5rem' }}>

                    {Object.keys(peakHoursData).length === 0 ? (

                      <div className="text-center py-4">

                        <p className="text-muted">No bookings found in this date range</p>

                      </div>

                    ) : (

                      <div>

                        <table className="table table-hover" style={{ marginBottom: '1.5rem' }}>

                          <thead>

                            <tr>

                              <th style={{ fontWeight: 700, fontSize: '0.85rem' }}>Time</th>

                              <th className="text-end" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Bookings</th>

                              <th style={{ width: '40%', fontWeight: 700, fontSize: '0.85rem' }}>Activity</th>

                            </tr>

                          </thead>

                          <tbody>

                            {Object.entries(peakHoursData)

                              .sort(([a], [b]) => Number(a) - Number(b))

                              .map(([hour, count]) => (

                                <tr key={hour}>

                                  <td style={{ fontWeight: 600 }}>{formatHour(Number(hour))}</td>

                                  <td className="text-end"><span className="badge bg-info" style={{ fontSize: '0.85rem' }}>{count}</span></td>

                                  <td>

                                    <div className="progress" style={{ height: '24px', borderRadius: '8px' }}>

                                      <div

                                        className="progress-bar"

                                        role="progressbar"

                                        style={{

                                          width: `${(count / getMaxValue(peakHoursData)) * 100}%`,

                                          background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',

                                          fontWeight: 600,

                                          fontSize: '0.85rem'

                                        }}

                                      >

                                        {count > 0 && count}

                                      </div>

                                    </div>

                                  </td>

                                </tr>

                              ))}

                          </tbody>

                        </table>

                        <div className="alert alert-info" style={{ marginBottom: 0 }}>

                          <strong>🔥 Most Active Hour:</strong>{' '}

                          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>

                            {formatHour(

                              Number(

                                Object.entries(peakHoursData).sort(([, a], [, b]) => b - a)[0][0]

                              )

                            )}

                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            )}

          </div>

        )}


 

        {!roomUsageData && !peakHoursData && !loadingRoomUsage && !loadingPeakHours && (

          <div className="alert alert-info" role="alert" style={{ borderLeft: '4px solid #3b82f6', padding: '1.25rem' }}>

            <strong>📊 Generate Reports:</strong> Select a date range and click either <strong>"Room Usage"</strong> or <strong>"Peak Hours"</strong> button to view the respective report.

          </div>

        )}

      </div>

    </div>

  );

};


 

export default Reports;


 
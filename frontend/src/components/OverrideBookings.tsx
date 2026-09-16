import React, { useEffect, useState } from 'react';

import { BookingDto } from '../models/booking';

import { overrideBooking } from '../services/bookingService';

import { getAllRooms } from '../services/roomService';

import { RoomDto } from '../models/room';

import { useAuth } from '../services/AuthContext';

import api from '../services/api';


 

const OverrideBookings: React.FC = () => {

  const { user } = useAuth();

  const [allBookings, setAllBookings] = useState<BookingDto[]>([]);

  const [loading, setLoading] = useState(true);

  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);

  const [rooms, setRooms] = useState<RoomDto[]>([]);



  // Override form fields

  const [title, setTitle] = useState('');

  const [startTime, setStartTime] = useState('');

  const [endTime, setEndTime] = useState('');

  const [overrideLoading, setOverrideLoading] = useState(false);

  const [error, setError] = useState('');


 

  const loadAllBookings = async () => {

    setLoading(true);

    try {

      // Fetch all bookings from all rooms

      const response = await api.get<BookingDto[]>('/bookings/all');

      console.log('All bookings from API:', response.data);

      // Filter only active bookings (BOOKED status)

      const activeBookings = response.data.filter(b => b.status === 'BOOKED');

      console.log('Filtered BOOKED bookings:', activeBookings);

      setAllBookings(activeBookings);

    } catch (error: any) {

      console.error('Failed to load bookings', error);

      console.error('Error response:', error.response?.data);

     

      let errorMessage = 'Failed to load bookings. ';

      if (error.response?.status === 404) {

        errorMessage += 'The /api/bookings/all endpoint was not found. Please restart the backend server to load the new endpoint.';

      } else if (error.response?.status === 403) {

        errorMessage += 'Access denied. Only admins can view all bookings.';

      } else if (error.response?.status === 401) {

        errorMessage += 'Authentication required. Please log in again.';

      } else {

        errorMessage += error.response?.data?.message || error.message;

      }

     

      alert(errorMessage);

    } finally {

      setLoading(false);

    }

  };


 

  const loadRooms = async () => {

    try {

      const roomsData = await getAllRooms();

      setRooms(roomsData);

    } catch (error) {

      console.error('Failed to load rooms', error);

    }

  };


 

  useEffect(() => {

    loadAllBookings();

    loadRooms();

  }, []);


 

  const formatDateTime = (dateTime: string) => {

    return new Date(dateTime).toLocaleString('en-IN', {

      month: 'short',

      day: 'numeric',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit',

      hour12: true

    });

  };


 

  const getTodayDateBoundaries = () => {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, '0');

    const day = String(now.getDate()).padStart(2, '0');

   

    const todayStart = `${year}-${month}-${day}T00:00`;

    const todayEnd = `${year}-${month}-${day}T23:59`;

   

    return { todayStart, todayEnd };

  };


 

  const handleOverrideClick = (booking: BookingDto) => {

    setSelectedBooking(booking);

    setTitle('');

    setStartTime('');

    setEndTime('');

    setError('');

    setShowOverrideModal(true);

  };


 

  const validateWorkingHours = (dateTimeStr: string): boolean => {

    const date = new Date(dateTimeStr);

    const hours = date.getHours();

    const day = date.getDay();

   

    if (day === 0 || day === 6) return false;

    if (hours < 9 || hours >= 18) return false;

   

    return true;

  };


 

  const isSameDay = (date1: Date, date2: Date): boolean => {

    return date1.getFullYear() === date2.getFullYear() &&

           date1.getMonth() === date2.getMonth() &&

           date1.getDate() === date2.getDate();

  };


 

  const handleOverrideSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');


 

    if (!selectedBooking) return;


 

    const today = new Date();

    const startDate = new Date(startTime);

    const endDate = new Date(endTime);


 

    // Validate that booking is for today only

    if (!isSameDay(startDate, today)) {

      setError('Bookings can only be made for today. Please select today\'s date.');

      return;

    }

   

    if (!isSameDay(endDate, today)) {

      setError('Booking end time must be on the same day (today).');

      return;

    }


 

    // Validate working hours

    if (!validateWorkingHours(startTime)) {

      setError('Start time must be within working hours (9 AM - 6 PM, Monday to Friday)');

      return;

    }

   

    if (!validateWorkingHours(endTime)) {

      setError('End time must be within working hours (9 AM - 6 PM, Monday to Friday)');

      return;

    }


 

    // Validate that end time is after start time

    if (endDate <= startDate) {

      setError('End time must be after start time');

      return;

    }


 

    // Validate maximum booking duration (2 hours)

    const durationInMs = endDate.getTime() - startDate.getTime();

    const durationInHours = durationInMs / (1000 * 60 * 60);

    if (durationInHours > 2) {

      setError('Maximum booking duration is 2 hours. Please select a shorter time slot.');

      return;

    }


 

    setOverrideLoading(true);


 

    try {

      await overrideBooking(selectedBooking.id!, {

        roomId: selectedBooking.roomId!,

        userId: user!.id,

        title,

        startTime,

        endTime,

      });

     

      setShowOverrideModal(false);

      loadAllBookings();

      alert('Booking overridden successfully!');

    } catch (err: any) {

      setError(err.response?.data?.message || 'Failed to override booking');

    } finally {

      setOverrideLoading(false);

    }

  };


 

  if (loading) {

    return (

      <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

        <div className="card-body p-5 text-center">

          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>

            <span className="visually-hidden">Loading...</span>

          </div>

          <p className="mt-3 text-muted">Loading all bookings...</p>

        </div>

      </div>

    );

  }


 

  return (

    <>

      <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

        <div className="card-body p-4">

          <div className="d-flex align-items-center mb-4">

            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>

              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="url(#gradient5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              <defs>

                <linearGradient id="gradient5" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">

                  <stop stopColor="#f59e0b"/>

                  <stop offset="1" stopColor="#ef4444"/>

                </linearGradient>

              </defs>

            </svg>

            <h5 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Override Bookings</h5>

          </div>

         

          <div className="alert alert-warning" role="alert" style={{ borderLeft: '4px solid #f59e0b' }}>

            <strong>⚠️ Admin Override:</strong> You can override any existing booking and replace it with a new one. The original booking will be marked as overridden.

          </div>


 

          {allBookings.length === 0 ? (

            <div className="text-center py-5">

              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: '1rem' }}>

                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>

              </svg>

              <p className="text-muted" style={{ fontSize: '1.1rem' }}>No active bookings found.</p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover" style={{ marginBottom: 0 }}>

                <thead>

                  <tr>

                    <th style={{ fontWeight: 700 }}>📝 Title</th>

                    <th style={{ fontWeight: 700 }}>👤 User</th>

                    <th style={{ fontWeight: 700 }}>🏢 Room</th>

                    <th style={{ fontWeight: 700 }}>🕐 Start Time</th>

                    <th style={{ fontWeight: 700 }}>🕐 End Time</th>

                    <th style={{ fontWeight: 700 }}>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {allBookings.map((booking) => (

                    <tr key={booking.id}>

                      <td style={{ fontWeight: 600 }}>{booking.title}</td>

                      <td>{booking.username || 'N/A'}</td>

                      <td>{booking.roomName}</td>

                      <td>{formatDateTime(booking.startTime)}</td>

                      <td>{formatDateTime(booking.endTime)}</td>

                      <td>

                        <button

                          className="btn btn-warning btn-sm"

                          onClick={() => handleOverrideClick(booking)}

                          style={{ borderRadius: '6px', fontWeight: 600 }}

                        >

                          ⚠️ Override

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


 

      {/* Override Modal */}

      {showOverrideModal && selectedBooking && (

        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>

          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>

            <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>

              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', color: 'white', borderBottom: 'none' }}>

                <div className="d-flex align-items-center">

                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>

                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                  </svg>

                  <h5 className="modal-title mb-0" style={{ fontWeight: 700, fontSize: '1.35rem' }}>Override Booking</h5>

                </div>

                <button type="button" className="btn-close btn-close-white" onClick={() => setShowOverrideModal(false)}></button>

              </div>

              <form onSubmit={handleOverrideSubmit}>

                <div className="modal-body" style={{ padding: '2rem' }}>

                  <div className="alert alert-warning" role="alert" style={{ borderLeft: '4px solid #f59e0b' }}>

                    <strong>⚠️ Overriding Booking:</strong>

                    <div className="mt-2">

                      <strong>Current Booking:</strong> {selectedBooking.title}<br/>

                      <strong>User:</strong> {selectedBooking.username}<br/>

                      <strong>Time:</strong> {formatDateTime(selectedBooking.startTime)} - {formatDateTime(selectedBooking.endTime)}

                    </div>

                  </div>


 

                  <div className="alert alert-info" role="alert" style={{ borderLeft: '4px solid #3b82f6' }}>

                    <strong>📘 Booking Rules:</strong>

                    <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>

                      <li>📅 Bookings allowed for TODAY only</li>

                      <li>🗓️ Office Hours: Monday to Friday, 9:00 AM - 6:00 PM</li>

                      <li>⏱️ Maximum Duration: 2 hours per booking</li>

                    </ul>

                  </div>


 

                  {error && (

                    <div className="alert alert-danger" role="alert" style={{ borderLeft: '4px solid #ef4444' }}>

                      <strong>⚠️ Error:</strong> {error}

                    </div>

                  )}


 

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                      🏢 Room

                    </label>

                    <input

                      type="text"

                      className="form-control"

                      value={selectedBooking.roomName}

                      disabled

                      style={{ background: '#f8fafc', fontWeight: 500 }}

                    />

                  </div>


 

                  <div className="mb-3">

                    <label htmlFor="overrideTitle" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                      📝 New Meeting Title

                    </label>

                    <input

                      type="text"

                      className="form-control"

                      id="overrideTitle"

                      placeholder="Enter new meeting title"

                      value={title}

                      onChange={(e) => setTitle(e.target.value)}

                      required

                    />

                  </div>


 

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label htmlFor="overrideStartTime" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                        🕐 New Start Time

                      </label>

                      <input

                        type="datetime-local"

                        className="form-control"

                        id="overrideStartTime"

                        value={startTime}

                        min={getTodayDateBoundaries().todayStart}

                        max={getTodayDateBoundaries().todayEnd}

                        onChange={(e) => setStartTime(e.target.value)}

                        required

                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label htmlFor="overrideEndTime" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                        🕐 New End Time

                      </label>

                      <input

                        type="datetime-local"

                        className="form-control"

                        id="overrideEndTime"

                        value={endTime}

                        min={getTodayDateBoundaries().todayStart}

                        max={getTodayDateBoundaries().todayEnd}

                        onChange={(e) => setEndTime(e.target.value)}

                        required

                      />

                    </div>

                  </div>

                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem' }}>

                  <button

                    type="button"

                    className="btn btn-secondary"

                    onClick={() => setShowOverrideModal(false)}

                    style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}

                  >

                    Cancel

                  </button>

                  <button

                    type="submit"

                    className="btn btn-warning"

                    disabled={overrideLoading}

                    style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}

                  >

                    {overrideLoading ? (

                      <>

                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                        Overriding...

                      </>

                    ) : (

                      '⚠️ Override Booking'

                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </>

  );

};


 

export default OverrideBookings;


 
import React, { useState, useEffect } from 'react';

import { RoomDto } from '../models/room';

import { BookingDto } from '../models/booking';

import { createBooking, getBookingsForRoom } from '../services/bookingService';

import { useAuth } from '../services/AuthContext';




interface BookingModalProps {

    room: RoomDto;

    onClose: () => void;

    onSuccess: () => void;

}




const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onSuccess }) => {

    const { user } = useAuth();

    const [title, setTitle] = useState('');

    const [startTime, setStartTime] = useState('');

    const [endTime, setEndTime] = useState('');

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [existingBookings, setExistingBookings] = useState<BookingDto[]>([]);

    const [loadingBookings, setLoadingBookings] = useState(true);



    const isAdmin = user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');




    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const bookings = await getBookingsForRoom(room.id!);

                // Filter only booked (not cancelled) bookings

                const activeBookings = bookings.filter(b => b.status === 'BOOKED');

                setExistingBookings(activeBookings);

            } catch (error) {

                console.error('Failed to load existing bookings', error);

            } finally {

                setLoadingBookings(false);

            }

        };




        fetchBookings();

    }, [room.id]);




    const getTodayDateBoundaries = () => {

        const now = new Date();

        const year = now.getFullYear();

        const month = String(now.getMonth() + 1).padStart(2, '0');

        const day = String(now.getDate()).padStart(2, '0');



        const todayStart = `${year}-${month}-${day}T00:00`;

        const todayEnd = `${year}-${month}-${day}T23:59`;



        return { todayStart, todayEnd, todayDate: `${year}-${month}-${day}` };

    };




    const isSameDay = (date1: Date, date2: Date): boolean => {

        return date1.getFullYear() === date2.getFullYear() &&

            date1.getMonth() === date2.getMonth() &&

            date1.getDate() === date2.getDate();

    };




    const validateWorkingHours = (dateTimeStr: string): boolean => {

        const date = new Date(dateTimeStr);

        const hours = date.getHours();

        const day = date.getDay(); // 0 = Sunday, 6 = Saturday



        // Check if it's a weekend

        if (day === 0 || day === 6) {

            return false;

        }



        // Check if within working hours (9 AM to 6 PM)

        if (hours < 9 || hours >= 18) {

            return false;

        }



        return true;

    };




    const checkTimeSlotConflict = (start: string, end: string): BookingDto | null => {

        const requestStart = new Date(start);

        const requestEnd = new Date(end);




        for (const booking of existingBookings) {

            const bookingStart = new Date(booking.startTime);

            const bookingEnd = new Date(booking.endTime);




            // Check if there's any overlap

            if (requestStart < bookingEnd && requestEnd > bookingStart) {

                return booking; // Return conflicting booking

            }

        }

        return null; // No conflict

    };




    const formatDateTime = (dateTimeStr: string): string => {

        const date = new Date(dateTimeStr);

        return date.toLocaleString('en-IN', {

            month: 'short',

            day: 'numeric',

            hour: '2-digit',

            minute: '2-digit',

            hour12: true

        });

    };




    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setError('');



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

        if (new Date(endTime) <= new Date(startTime)) {

            setError('End time must be after start time');

            return;

        }




        // Validate maximum booking duration (2 hours)

        const durationInMs = new Date(endTime).getTime() - new Date(startTime).getTime();

        const durationInHours = durationInMs / (1000 * 60 * 60);

        if (durationInHours > 2) {

            setError('Maximum booking duration is 2 hours. Please select a shorter time slot.');

            return;

        }




        // Check for time slot conflicts

        const conflictingBookingFound = checkTimeSlotConflict(startTime, endTime);



        if (conflictingBookingFound) {

            setError(`This time slot conflicts with an existing booking by ${conflictingBookingFound.username || 'another user'}. Please choose a different time or use the Override Bookings feature (Admin only).`);

            return;

        }



        setLoading(true);




        try {

            await createBooking({

                roomId: room.id!,

                userId: user!.id,

                title,

                startTime,

                endTime,

            });

            onSuccess();

            onClose();

        } catch (err: any) {

            setError(err.response?.data?.message || 'Booking failed');

        } finally {

            setLoading(false);

        }

    };




    return (

        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>

            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>

                <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>

                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderBottom: 'none' }}>

                        <div className="d-flex align-items-center">

                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>

                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />

                            </svg>

                            <h5 className="modal-title mb-0" style={{ fontWeight: 700, fontSize: '1.35rem' }}>Book {room.name}</h5>

                        </div>

                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body" style={{ padding: '2rem' }}>

                            <div className="alert alert-info" role="alert" style={{ borderLeft: '4px solid #3b82f6' }}>

                                <strong>📘 Booking Rules:</strong>

                                <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>

                                    <li> Bookings allowed for TODAY only</li>

                                    <li>🗓️ Office Hours: Monday to Friday, 9:00 AM - 6:00 PM</li>

                                    <li>⏱️ Maximum Duration: 2 hours per booking</li>

                                </ul>

                            </div>

                            {error && (

                                <div className="alert alert-danger" role="alert" style={{ borderLeft: '4px solid #ef4444' }}>

                                    <strong>⚠️ Error:</strong> {error}

                                </div>

                            )}



                            {/* Existing Bookings Section */}

                            {loadingBookings ? (

                                <div className="text-center mb-3 py-3">

                                    <div className="spinner-border spinner-border-sm text-primary" role="status">

                                        <span className="visually-hidden">Loading...</span>

                                    </div>

                                    <span className="ms-2" style={{ fontSize: '0.9rem', color: '#64748b' }}>Loading existing bookings...</span>

                                </div>

                            ) : existingBookings.length > 0 ? (

                                <div className="mb-3">

                                    <div className="alert alert-warning" role="alert" style={{ borderLeft: '4px solid #f59e0b' }}>

                                        <strong>🚫 Unavailable Time Slots:</strong>

                                        <ul className="mb-0 mt-2" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>

                                            {existingBookings.map((booking) => (

                                                <li key={booking.id}>

                                                    <strong>{formatDateTime(booking.startTime)}</strong> - <strong>{formatDateTime(booking.endTime)}</strong>

                                                    <span className="text-muted"> ({booking.title})</span>

                                                </li>

                                            ))}

                                        </ul>

                                    </div>

                                </div>

                            ) : (

                                <div className="mb-3">

                                    <div className="alert alert-success" role="alert" style={{ borderLeft: '4px solid #10b981' }}>

                                        <strong>✅ No existing bookings</strong> - This room is available for booking

                                    </div>

                                </div>

                            )}




                            <div className="mb-3">

                                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                                    🏢 Room

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    value={`${room.name} - ${room.building}, Floor ${room.floor}`}

                                    disabled

                                    style={{ background: '#f8fafc', fontWeight: 500 }}

                                />

                            </div>

                            <div className="mb-3">

                                <label htmlFor="title" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                                    📝 Meeting Title

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    id="title"

                                    placeholder="Enter meeting title"

                                    value={title}

                                    onChange={(e) => setTitle(e.target.value)}

                                    required

                                />

                            </div>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label htmlFor="startTime" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                                        🕐 Start Time

                                    </label>

                                    <input

                                        type="datetime-local"

                                        className="form-control"

                                        id="startTime"

                                        value={startTime}

                                        min={getTodayDateBoundaries().todayStart}

                                        max={getTodayDateBoundaries().todayEnd}

                                        onChange={(e) => setStartTime(e.target.value)}

                                        required

                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label htmlFor="endTime" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>

                                        🕐 End Time

                                    </label>

                                    <input

                                        type="datetime-local"

                                        className="form-control"

                                        id="endTime"

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

                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}>

                                Cancel

                            </button>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}>

                                {loading ? (

                                    <>

                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                                        Booking...

                                    </>

                                ) : (

                                    '📅 Book Room'

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};




export default BookingModal;



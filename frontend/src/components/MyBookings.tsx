import React, { useEffect, useState } from 'react';

import { BookingDto } from '../models/booking';

import { getBookingsForUser, cancelBooking } from '../services/bookingService';

import { useAuth } from '../services/AuthContext';




const MyBookings: React.FC = () => {

    const { user } = useAuth();

    const [bookings, setBookings] = useState<BookingDto[]>([]);

    const [loading, setLoading] = useState(true);




    const loadBookings = async () => {

        try {

            const data = await getBookingsForUser(user!.id);

            setBookings(data);

        } catch (error) {

            console.error('Failed to load bookings', error);

        } finally {

            setLoading(false);

        }

    };




    useEffect(() => {

        if (user) {

            loadBookings();

        }

    }, [user]);




    const handleCancel = async (id: number) => {

        if (!confirm('Are you sure you want to cancel this booking?')) return;




        try {

            await cancelBooking(id);

            loadBookings();

        } catch (error: any) {

            alert(error.response?.data?.message || 'Failed to cancel booking');

        }

    };




    const formatDateTime = (dateTime: string) => {

        return new Date(dateTime).toLocaleString();

    };




    if (loading) {

        return (

            <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

                <div className="card-body p-5 text-center">

                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>

                        <span className="visually-hidden">Loading...</span>

                    </div>

                    <p className="mt-3 text-muted">Loading your bookings...</p>

                </div>

            </div>

        );

    }




    return (

        <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

            <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>

                        <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="url(#gradient4)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />

                        <defs>

                            <linearGradient id="gradient4" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">

                                <stop stopColor="#4f46e5" />

                                <stop offset="1" stopColor="#06b6d4" />

                            </linearGradient>

                        </defs>

                    </svg>

                    <h5 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Bookings</h5>

                </div>

                {bookings.length === 0 ? (

                    <div className="text-center py-5">

                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: '1rem' }}>

                            <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />

                        </svg>

                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>No bookings yet. Start by searching for available rooms!</p>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover" style={{ marginBottom: 0 }}>

                            <thead>

                                <tr>

                                    <th style={{ fontWeight: 700 }}>📝 Title</th>

                                    <th style={{ fontWeight: 700 }}>🏢 Room</th>

                                    <th style={{ fontWeight: 700 }}>🕐 Start Time</th>

                                    <th style={{ fontWeight: 700 }}>🕐 End Time</th>

                                    <th style={{ fontWeight: 700 }}>Status</th>

                                    <th style={{ fontWeight: 700 }}>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {bookings.map((booking) => (

                                    <tr key={booking.id}>

                                        <td style={{ fontWeight: 600 }}>{booking.title}</td>

                                        <td>{booking.roomName}</td>

                                        <td>{formatDateTime(booking.startTime)}</td>

                                        <td>{formatDateTime(booking.endTime)}</td>

                                        <td>

                                            <span className={`badge bg-${booking.status === 'BOOKED' ? 'success' :

                                                    booking.status === 'CANCELLED' ? 'danger' :

                                                        'warning'

                                                }`} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>

                                                {booking.status}

                                            </span>

                                        </td>

                                        <td>

                                            {booking.status === 'BOOKED' && (

                                                <button

                                                    className="btn btn-sm btn-danger"

                                                    onClick={() => handleCancel(booking.id!)}

                                                    style={{ padding: '0.4rem 1rem', fontWeight: 600, borderRadius: '8px' }}

                                                >

                                                    ❌ Cancel

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};




export default MyBookings;



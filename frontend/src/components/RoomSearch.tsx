import React, { useEffect, useState } from 'react';

import { RoomDto } from '../models/room';

import { getAllRooms, searchRooms } from '../services/roomService';

import BookingModal from './BookingModal';


 

const RoomSearch: React.FC = () => {

  const [capacity, setCapacity] = useState<number | ''>('');

  const [building, setBuilding] = useState('');

  const [floor, setFloor] = useState('');

  const [equipments, setEquipments] = useState('');

  const [rooms, setRooms] = useState<RoomDto[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);


 

  useEffect(() => {

    getAllRooms().then(setRooms).catch(() => setRooms([]));

  }, []);


 

  const handleSearch = async (e: React.FormEvent) => {

    e.preventDefault();

    const params: any = {};

    if (capacity !== '') params.capacity = capacity;

    if (building) params.building = building;

    if (floor) params.floor = floor;

    if (equipments) params.equipments = equipments;


 

    const result = await searchRooms(params);

    setRooms(result);

  };


 

  const handleBookRoom = (room: RoomDto) => {

    setSelectedRoom(room);

  };


 

  return (

    <>

      <div className="card shadow-custom mb-4" style={{ borderRadius: '12px' }}>

        <div className="card-body p-4">

          <div className="d-flex align-items-center mb-4">

            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>

              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              <defs>

                <linearGradient id="gradient3" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">

                  <stop stopColor="#4f46e5"/>

                  <stop offset="1" stopColor="#06b6d4"/>

                </linearGradient>

              </defs>

            </svg>

            <h5 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Search Rooms</h5>

          </div>

          <form className="row g-3 mb-4" onSubmit={handleSearch} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px' }}>

            <div className="col-6 col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Min Capacity</label>

              <input

                type="number"

                className="form-control"

                placeholder="e.g. 10"

                value={capacity}

                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')}

              />

            </div>

            <div className="col-6 col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Building</label>

              <input

                type="text"

                className="form-control"

                placeholder="Building number"

                value={building}

                onChange={(e) => setBuilding(e.target.value)}

              />

            </div>

            <div className="col-6 col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Floor</label>

              <input

                type="text"

                className="form-control"

                placeholder="Floor number"

                value={floor}

                onChange={(e) => setFloor(e.target.value)}

              />

            </div>

            <div className="col-6 col-md-3">

              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Equipments</label>

              <input

                type="text"

                className="form-control"

                placeholder="Projector, TV"

                value={equipments}

                onChange={(e) => setEquipments(e.target.value)}

              />

            </div>

            <div className="col-12 mt-3">

              <button className="btn btn-primary" type="submit" style={{ padding: '0.625rem 2rem', fontWeight: 600 }}>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', display: 'inline-block' }}>

                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                </svg>

                Search Rooms

              </button>

            </div>

          </form>


 

          <div className="table-responsive">

            <table className="table table-hover align-middle" style={{ marginBottom: 0 }}>

              <thead>

                <tr>

                  <th style={{ fontWeight: 700 }}>🏢 Room Name</th>

                  <th style={{ fontWeight: 700 }}>🏛️ Building</th>

                  <th style={{ fontWeight: 700 }}>📍 Floor</th>

                  <th style={{ fontWeight: 700 }}>👥 Capacity</th>

                  <th style={{ fontWeight: 700 }}>🛠️ Equipments</th>

                  <th style={{ fontWeight: 700 }}>Actions</th>

                </tr>

              </thead>

              <tbody>

                {rooms.map((room) => (

                  <tr key={room.id}>

                    <td style={{ fontWeight: 600 }}>{room.name}</td>

                    <td>{room.building}</td>

                    <td>{room.floor}</td>

                    <td><span className="badge bg-primary" style={{ fontSize: '0.85rem' }}>{room.capacity}</span></td>

                    <td>

                      {room.equipments.length > 0 ? (

                        <span style={{ fontSize: '0.9rem' }}>{room.equipments.join(', ')}</span>

                      ) : (

                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>None</span>

                      )}

                    </td>

                    <td>

                      <button

                        className="btn btn-sm btn-success"

                        onClick={() => handleBookRoom(room)}

                        style={{ padding: '0.4rem 1rem', fontWeight: 600, borderRadius: '8px' }}

                      >

                        📅 Book

                      </button>

                    </td>

                  </tr>

                ))}

                {rooms.length === 0 && (

                  <tr>

                    <td colSpan={6} className="text-center text-muted py-4">

                      <div>

                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: '10px' }}>

                          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                        </svg>

                        <div style={{ fontSize: '1rem' }}>No rooms found. Try adjusting your search criteria.</div>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


 

      {selectedRoom && (

        <BookingModal

          room={selectedRoom}

          onClose={() => setSelectedRoom(null)}

          onSuccess={() => {

            alert('Room booked successfully!');

          }}

        />

      )}

    </>

  );

};


 

export default RoomSearch;



 
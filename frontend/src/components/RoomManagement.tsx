import React, { useState, useEffect } from 'react';

import { RoomDto } from '../models/room';

import { getAllRooms, createRoom, updateRoom, deleteRoom } from '../services/roomService';


 

const RoomManagement: React.FC = () => {

  const [rooms, setRooms] = useState<RoomDto[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);

  const [formData, setFormData] = useState<RoomDto>({

    name: '',

    building: '',

    floor: '',

    capacity: 0,

    equipments: [],

  });

  const [equipmentInput, setEquipmentInput] = useState('');


 

  const loadRooms = async () => {

    try {

      const data = await getAllRooms();

      setRooms(data);

    } catch (error) {

      console.error('Failed to load rooms', error);

    }

  };


 

  useEffect(() => {

    loadRooms();

  }, []);


 

  const handleOpenModal = (room?: RoomDto) => {

    if (room) {

      setEditingRoom(room);

      setFormData(room);

      setEquipmentInput(room.equipments.join(', '));

    } else {

      setEditingRoom(null);

      setFormData({

        name: '',

        building: '',

        floor: '',

        capacity: 0,

        equipments: [],

      });

      setEquipmentInput('');

    }

    setShowModal(true);

  };


 

  const handleCloseModal = () => {

    setShowModal(false);

    setEditingRoom(null);

  };


 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();


 

    const roomData = {

      ...formData,

      equipments: equipmentInput.split(',').map((e) => e.trim()).filter((e) => e),

    };


 

    try {

      if (editingRoom) {

        await updateRoom(editingRoom.id!, roomData);

      } else {

        await createRoom(roomData);

      }

      loadRooms();

      handleCloseModal();

    } catch (error: any) {

      alert(error.response?.data?.message || 'Failed to save room');

    }

  };


 

  const handleDelete = async (id: number) => {

    if (!confirm('Are you sure you want to delete this room?')) return;


 

    try {

      await deleteRoom(id);

      loadRooms();

    } catch (error: any) {

      alert(error.response?.data?.message || 'Failed to delete room');

    }

  };


 

  return (

    <div className="card shadow-custom" style={{ borderRadius: '12px' }}>

      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div className="d-flex align-items-center">

            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>

              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="url(#gradient5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              <defs>

                <linearGradient id="gradient5" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">

                  <stop stopColor="#4f46e5"/>

                  <stop offset="1" stopColor="#06b6d4"/>

                </linearGradient>

              </defs>

            </svg>

            <h5 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Room Management</h5>

          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', display: 'inline-block' }}>

              <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

            </svg>

            Add Room

          </button>

        </div>


 

        <div className="table-responsive">

          <table className="table table-hover" style={{ marginBottom: 0 }}>

            <thead>

              <tr>

                <th style={{ fontWeight: 700 }}>🏢 Name</th>

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

                      className="btn btn-sm btn-warning me-2"

                      onClick={() => handleOpenModal(room)}

                      style={{ padding: '0.4rem 0.875rem', fontWeight: 600, borderRadius: '8px' }}

                    >

                      ✏️ Edit

                    </button>

                    <button

                      className="btn btn-sm btn-danger"

                      onClick={() => handleDelete(room.id!)}

                      style={{ padding: '0.4rem 0.875rem', fontWeight: 600, borderRadius: '8px' }}

                    >

                      🗑️ Delete

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


 

      {showModal && (

        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>

          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px' }}>

            <div className="modal-content" style={{ borderRadius: '16px' }}>

              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderBottom: 'none', padding: '1.5rem' }}>

                <h5 className="modal-title" style={{ fontWeight: 700 }}>{editingRoom ? '✏️ Edit Room' : '➕ Add Room'}</h5>

                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="modal-body" style={{ padding: '2rem' }}>

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>🏢 Room Name</label>

                    <input

                      type="text"

                      className="form-control"

                      placeholder="e.g. Conference Room A"

                      value={formData.name}

                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                      required

                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>🏛️ Building</label>

                    <input

                      type="text"

                      className="form-control"

                      placeholder="e.g. Building A"

                      value={formData.building}

                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}

                      required

                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>📍 Floor</label>

                    <input

                      type="text"

                      className="form-control"

                      placeholder="e.g. 3rd Floor"

                      value={formData.floor}

                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}

                      required

                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>👥 Capacity</label>

                    <input

                      type="number"

                      className="form-control"

                      placeholder="e.g. 10"

                      value={formData.capacity}

                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}

                      required

                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem' }}>🛠️ Equipments (comma-separated)</label>

                    <input

                      type="text"

                      className="form-control"

                      value={equipmentInput}

                      onChange={(e) => setEquipmentInput(e.target.value)}

                      placeholder="Projector, Whiteboard, TV"

                    />

                  </div>

                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem' }}>

                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}>

                    Cancel

                  </button>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', fontWeight: 600, borderRadius: '8px' }}>

                    {editingRoom ? '✅ Update' : '➕ Create'}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


 

export default RoomManagement;


 
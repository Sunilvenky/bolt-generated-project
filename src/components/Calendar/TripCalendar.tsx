import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: string;
}

const TripCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'Planning'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('trip_events')
        .insert([newEvent]);

      if (error) throw error;
      
      setShowEventForm(false);
      setNewEvent({
        title: '',
        start_date: '',
        end_date: '',
        description: '',
        status: 'Planning'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="p-3"></td>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === currentDate.toDateString();
      });

      days.push(
        <td key={day} className="p-3 border align-top" style={{ height: '120px', minWidth: '120px' }}>
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-bold">{day}</span>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setNewEvent(prev => ({
                  ...prev,
                  start_date: currentDate.toISOString().split('T')[0]
                }));
                setShowEventForm(true);
              }}
            >
              +
            </button>
          </div>
          {dayEvents.map(event => (
            <div 
              key={event.id}
              className={`p-1 mb-1 rounded small text-white ${
                event.status === 'Planning' ? 'bg-warning' :
                event.status === 'Confirmed' ? 'bg-success' : 'bg-primary'
              }`}
            >
              {event.title}
            </div>
          ))}
        </td>
      );
    }

    return days;
  };

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Trip Calendar</h1>
        <div>
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
          >
            Previous
          </button>
          <span className="fw-bold mx-3">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            className="btn btn-outline-secondary ms-2"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
          >
            Next
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-center">Sun</th>
                <th className="text-center">Mon</th>
                <th className="text-center">Tue</th>
                <th className="text-center">Wed</th>
                <th className="text-center">Thu</th>
                <th className="text-center">Fri</th>
                <th className="text-center">Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil((getFirstDayOfMonth(selectedDate) + getDaysInMonth(selectedDate)) / 7) }, (_, i) => (
                <tr key={i}>
                  {renderCalendarDays().slice(i * 7, (i + 1) * 7)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEventForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Trip Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowEventForm(false)}></button>
              </div>
              <form onSubmit={handleAddEvent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEvent.title}
                      onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newEvent.start_date}
                      onChange={e => setNewEvent(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newEvent.end_date}
                      onChange={e => setNewEvent(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={newEvent.description}
                      onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={newEvent.status}
                      onChange={e => setNewEvent(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="Planning">Planning</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEventForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Event
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

export default TripCalendar;

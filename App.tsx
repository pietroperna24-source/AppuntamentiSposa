import React, { useState, useEffect } from 'react';
import { Appointment, formatCurrency } from './types';
import { requestNotificationPermission, scheduleWebNotification } from './NotificationService';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', customerName: "Mario Rossi", serviceName: "Taglio Capelli", price: 25.0, date: new Date(), isPaid: true },
    { id: '2', customerName: "Giulia Bianchi", serviceName: "Colore e Piega", price: 85.0, date: new Date(Date.now() + 3600000), isPaid: false },
  ]);
  
  const [searchText, setSearchText] = useState("");
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesPaid = !showOnlyUnpaid || !app.isPaid;
    return matchesSearch && matchesPaid;
  });

  const togglePaidStatus = (id: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        const updated = { ...app, isPaid: !app.isPaid };
        scheduleWebNotification(updated);
        return updated;
      }
      return app;
    }));
  };

  const sendWhatsAppReminder = (app: Appointment) => {
    const message = `Ciao ${app.customerName}, ti ricordiamo il pagamento di ${formatCurrency(app.price)} per il servizio di ${app.serviceName}. Grazie!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Ricerca e Filtri */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-4">
          <input 
            type="text" 
            placeholder="Cerca cliente..." 
            className="w-full p-2 border rounded-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={showOnlyUnpaid} 
              onChange={() => setShowOnlyUnpaid(!showOnlyUnpaid)}
            />
            <span>Mostra solo da pagare</span>
          </label>
        </div>

        {/* Lista Appuntamenti */}
        <div className="space-y-3">
          {filteredAppointments.map(app => (
            <div 
              key={app.id} 
              onClick={() => setSelectedAppointment(app)}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{app.customerName}</h3>
                <p className="text-gray-500">{app.serviceName}</p>
                <p className="text-sm text-gray-400">{app.date.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">{formatCurrency(app.price)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${app.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {app.isPaid ? 'Pagato' : 'In sospeso'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dettaglio (Equivalente di AppointmentDetailView) */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >✕</button>
            
            <h2 className="text-2xl font-bold mb-4">Dettaglio</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="text-lg font-medium">{selectedAppointment.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Servizio</p>
                <p className="text-lg font-medium">{selectedAppointment.serviceName}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Stato Pagamento</span>
                <button 
                  onClick={() => togglePaidStatus(selectedAppointment.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedAppointment.isPaid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedAppointment.isPaid ? 'Pagato' : 'Segna come Pagato'}
                </button>
              </div>
            </div>

            {!selectedAppointment.isPaid && (
              <button 
                onClick={() => sendWhatsAppReminder(selectedAppointment)}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
              >
                <span>Invia Sollecito WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
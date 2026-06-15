import Foundation
import Combine

class AppointmentStore: ObservableObject {
    @Published var appointments: [Appointment] = [
        Appointment(id: UUID(), customerName: "Mario Rossi", serviceName: "Taglio Capelli", price: 25.0, date: Date(), isPaid: true),
        Appointment(id: UUID(), customerName: "Giulia Bianchi", serviceName: "Colore e Piega", price: 85.0, date: Date().addingTimeInterval(3600), isPaid: false),
        Appointment(id: UUID(), customerName: "Luca Verdi", serviceName: "Barba", price: 15.0, date: Date().addingTimeInterval(7200), isPaid: false),
        Appointment(id: UUID(), customerName: "Elena Neri", serviceName: "Trattamento Viso", price: 50.0, date: Date().addingTimeInterval(86400), isPaid: false)
    ]
    
    init() {
        NotificationManager.shared.requestAuthorization()
    }
    
    func addAppointment(_ appointment: Appointment) {
        appointments.append(appointment)
        NotificationManager.shared.scheduleNotification(for: appointment)
    }
}
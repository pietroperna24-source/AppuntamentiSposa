import SwiftUI
import UIKit // Necessario per UIApplication.shared.open

struct AppointmentDetailView: View {
    @Binding var appointment: Appointment

    var body: some View {
        Form {
            Section(header: Text("Informazioni Appuntamento")) {
                Text("Cliente: \(appointment.customerName)")
                Text("Servizio: \(appointment.serviceName)")
                Text("Data: \(appointment.date, style: .date)")
                Text("Prezzo: \(appointment.formattedPrice)")
            }

            Section(header: Text("Gestione Pagamento")) {
                Toggle("Pagato", isOn: $appointment.isPaid)
                    .tint(.green)
                
                if !appointment.isPaid {
                    Button(action: {
                        sendWhatsAppReminder(for: appointment)
                    }) {
                        Label("Invia Sollecito", systemName: "message.fill")
                    }
                }
            }
        }
        .navigationTitle("Dettaglio")
        // Ogni volta che cambia lo stato del pagamento, aggiorniamo la notifica programmata
        .onChange(of: appointment.isPaid) { _ in
            NotificationManager.shared.scheduleNotification(for: appointment)
        }
    }

    private func sendWhatsAppReminder(for appointment: Appointment) {
        let message = "Ciao \(appointment.customerName), ti ricordiamo il pagamento di \(appointment.formattedPrice) per il servizio di \(appointment.serviceName). Grazie!"
        if let encodedMessage = message.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) {
            let whatsappURLString = "whatsapp://send?text=\(encodedMessage)"
            if let whatsappURL = URL(string: whatsappURLString) {
                if UIApplication.shared.canOpenURL(whatsappURL) {
                    UIApplication.shared.open(whatsappURL, options: [:], completionHandler: nil)
                } else {
                    print("WhatsApp non è installato sul dispositivo.")
                }
            }
        }
    }
}
struct AppointmentDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            AppointmentDetailView(appointment: .constant(Appointment(
                id: UUID(), customerName: "Mario Rossi", serviceName: "Taglio e Barba", price: 35.0, date: Date(), isPaid: false
            )))
        }
    }
}
import SwiftUI

struct AddAppointmentView: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var store: AppointmentStore
    
    @State private var customerName = ""
    @State private var serviceName = ""
    @State private var price: Double = 0.0
    @State private var date = Date()
    @State private var isPaid = false

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Dati Cliente")) {
                    TextField("Nome Cliente", text: $customerName)
                    TextField("Servizio", text: $serviceName)
                }
                
                Section(header: Text("Dettagli Servizio")) {
                    DatePicker("Data e Ora", selection: $date)
                    HStack {
                        Text("Prezzo")
                        Spacer()
                        TextField("0.00", value: $price, format: .currency(code: "EUR"))
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    Toggle("Già Pagato", isOn: $isPaid)
                }
            }
            .navigationTitle("Nuovo Appuntamento")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annulla") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Salva") {
                        let newAppointment = Appointment(
                            id: UUID(),
                            customerName: customerName,
                            serviceName: serviceName,
                            price: price,
                            date: date,
                            isPaid: isPaid
                        )
                        store.addAppointment(newAppointment)
                        dismiss()
                    }
                    .disabled(customerName.isEmpty || serviceName.isEmpty)
                }
            }
        }
    }
}
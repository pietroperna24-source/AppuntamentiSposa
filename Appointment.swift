import Foundation

struct Appointment: Identifiable {
    let id: UUID
    var customerName: String
    var serviceName: String
    var price: Double
    var date: Date
    var isPaid: Bool
    
    var formattedPrice: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = Locale(identifier: "it_IT")
        return formatter.string(from: NSNumber(value: price)) ?? "€0,00"
    }
}
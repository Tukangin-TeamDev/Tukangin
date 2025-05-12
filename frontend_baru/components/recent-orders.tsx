import Link from "next/link"
import { ArrowRight, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface Order {
  id: string
  service: string
  provider: string
  date: string
  status: "completed" | "in-progress" | "scheduled" | "cancelled"
  price: number
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp")
  }

  // Status badge color
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Status icon
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  // Status text
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai"
      case "in-progress":
        return "Dalam Proses"
      case "scheduled":
        return "Terjadwal"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pesanan Terbaru</h2>
        <Link href="/dashboard/orders" className="text-blue-500 hover:text-blue-600 flex items-center text-sm">
          Lihat Semua
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Layanan</th>
                <th className="pb-3 font-medium">Penyedia</th>
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Harga</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4">
                    <Link href={`/dashboard/orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                      {order.service}
                    </Link>
                  </td>
                  <td className="py-4">{order.provider}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium">{formatPrice(order.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

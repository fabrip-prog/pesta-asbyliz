import { BookingScreen } from "@/screens/BookingScreen";
import { getServices, getAvailableSlots } from "@/app/actions";

export default async function ReservaPage() {
  const services = await getServices();
  const availableSlots = await getAvailableSlots();
  
  return <BookingScreen services={services} availableSlots={availableSlots} />;
}
export const dynamic = 'force-dynamic';

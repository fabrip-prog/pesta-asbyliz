import { HomeScreen } from "@/screens/HomeScreen";
import { getAppointments } from "@/app/actions";

export default async function Home() {
  const appointments = await getAppointments();
  return <HomeScreen appointments={appointments} />;
}

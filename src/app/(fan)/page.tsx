import { getCurrentUser } from "@/features/auth";
import { getHomeSnapshot, HomeScreen } from "@/features/home";

export default async function HomePage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  const snapshot = await getHomeSnapshot(user);
  return <HomeScreen snapshot={snapshot} />;
}

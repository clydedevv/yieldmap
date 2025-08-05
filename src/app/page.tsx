import { getCategoryNodes, getStrategies, getTopStrategiesFromDB } from '@/lib/data-service';
import ClientHomePage from '@/components/ClientHomePage';

export default async function Home() {
  // Fetch data from database on server side
  const categoryNodes = await getCategoryNodes();
  const allStrategies = getStrategies();
  const topStrategies = getTopStrategiesFromDB(5);

  return (
    <ClientHomePage 
      categoryNodes={categoryNodes}
      allStrategies={allStrategies}
      topStrategies={topStrategies}
    />
  );
}
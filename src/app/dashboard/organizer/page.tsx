import { useSession } from '@/lib/auth-client';


const OrganizerDashboardPage = () => {
  const {} = useSession()
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default OrganizerDashboardPage;
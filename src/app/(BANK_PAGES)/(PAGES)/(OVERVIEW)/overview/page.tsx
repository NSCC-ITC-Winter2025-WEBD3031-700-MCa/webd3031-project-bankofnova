'use client';

import PageContainer from "../../../components/container/PageContainer";
import AccountTabs from "../../../components/OverviewAccounts"; // ✅ import your new component
import { useSession } from "next-auth/react";

const OverviewPage = () => {
  const { status } = useSession();

  return (
    <PageContainer title="Overview" description="This is your account overview">
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <AccountTabs /> 
      )}
    </PageContainer>
  );
};

export default OverviewPage;

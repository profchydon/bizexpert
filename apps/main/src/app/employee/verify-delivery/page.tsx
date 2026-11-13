import EmployeeVerification from "@/container/Employee/Verification";

interface PageProps {
  searchParams: Promise<{
    company?: string;
    companyId?: string;
    token?: string;
  }>;
}

const VerificationPage = async ({ searchParams }: PageProps) => {
  const { token, company, companyId } = await searchParams;

  return (
    <EmployeeVerification
      token={token || ""}
      companyId={companyId || company || ""}
    />
  );
};

export default VerificationPage;

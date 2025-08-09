import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/dashboard/credit-score-overview-dashboard',
      permanent: false,
    },
  };
};

export default function DashboardIndex() {
  return null; // chỉ redirect, không render
}

import { GuestRoute } from "../components/auth/GuestRoutes";


export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestRoute>
      {children}
    </GuestRoute>
  );
}
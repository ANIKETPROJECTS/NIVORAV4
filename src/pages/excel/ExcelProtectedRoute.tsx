import { Navigate } from 'react-router-dom'

export default function ExcelProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = sessionStorage.getItem('nivora_excel_admin') === 'true'
  if (!isLoggedIn) return <Navigate to="/excelsheet" replace />
  return <>{children}</>
}

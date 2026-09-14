import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#14120f",
            border: "1px solid #e7e4e0",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 12px 32px rgba(20,18,15,.08)",
          },
          success: {
            iconTheme: { primary: "#1f8a4c", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#d4351c", secondary: "#ffffff" },
          },
        }}
      />
    </>
  );
};

export default App;
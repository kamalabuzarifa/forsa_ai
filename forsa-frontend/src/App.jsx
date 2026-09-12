import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return <AppRoutes />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

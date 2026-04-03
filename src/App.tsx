import { HashRouter, Routes, Route } from 'react-router-dom';
import MobileApp from './pages/MobileApp';
import AdminDashboard from './pages/AdminDashboard';
import Headquarters from './pages/Headquarters';

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={
                    <div className="app-container">
                        <MobileApp />
                    </div>
                } />
                <Route path="/hq" element={<Headquarters />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
        </HashRouter>
    );
}

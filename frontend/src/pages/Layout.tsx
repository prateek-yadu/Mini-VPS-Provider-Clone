import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export default function Layout() {
    return (
        <>
            <Toaster position='top-center' duration={1500}/> {/* sonner toast */}
            <Outlet />
        </>
    );
}

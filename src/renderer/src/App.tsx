import { Login } from '@/views/login'
import { Dashboard } from '@/views/dashboard'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useState } from 'react'

function App() {
    const [view, setView] = useState('login')

    return (
        <div>
            {view === 'login' && <Login setView={setView} />}
            {view === 'dashboard' && <Dashboard setView={setView} />}
        </div>
    )
}

export default App
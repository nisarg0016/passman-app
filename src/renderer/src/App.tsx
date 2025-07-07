import { Login } from '@/views/login'
import { Dashboard } from '@/views/dashboard'
import { User } from '@/views/user'
import { useState } from 'react'

function App() {
    const [view, setView] = useState('login')

    return (
        <div className="flex justify-center items-center">
            {view === 'login' && <Login setView={setView} />}
            {view === 'dashboard' && <Dashboard setView={setView} />}
            {view === 'user' && <User setView={setView} />}
        </div>
    )
}

export default App
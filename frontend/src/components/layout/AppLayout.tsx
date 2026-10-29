 
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FloatingAIAssistant from './FloatingAIAssistant'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="gl-app">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="gl-main">
        <Topbar onMenuClick={() => setSidebarOpen((open) => !open)} />

        <main className="gl-content">
          <Outlet />
        </main>
         <FloatingAIAssistant />
      </div>
    </div>
  )
}

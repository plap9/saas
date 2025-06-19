// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useState } from 'react';

// Welcome page component with design system showcase
function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-success-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-display font-semibold text-gradient">
              AI Assistant Platform
            </h1>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="btn-ghost p-2 rounded-lg"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Welcome to the Future of
            <span className="text-gradient block">AI Assistance</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience next-generation AI with beautiful design, seamless interactions, 
            and intelligent automation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-base hover-lift">
              Get Started
            </button>
            <button className="btn-secondary px-8 py-3 text-base hover-lift">
              Learn More
            </button>
          </div>
        </section>

        {/* Design System Showcase */}
        <section className="mb-16">
          <h3 className="text-2xl font-display font-semibold mb-8 text-center">
            Design System Preview
          </h3>
          
          {/* Color Palette */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card-hover p-6">
              <h4 className="font-semibold mb-4">Primary Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 500, 900].map((shade) => (
                  <div
                    key={shade}
                    className={`w-8 h-8 rounded-lg bg-primary-${shade}`}
                    title={`primary-${shade}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="card-hover p-6">
              <h4 className="font-semibold mb-4">Success Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 500, 900].map((shade) => (
                  <div
                    key={shade}
                    className={`w-8 h-8 rounded-lg bg-success-${shade}`}
                    title={`success-${shade}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="card-hover p-6">
              <h4 className="font-semibold mb-4">Glassmorphism</h4>
              <div className="glass p-4 rounded-xl">
                <p className="text-sm">Glass effect with backdrop blur</p>
              </div>
            </div>
            
            <div className="card-hover p-6">
              <h4 className="font-semibold mb-4">Animations</h4>
              <div className="space-y-2">
                <div className="w-full h-2 bg-primary-500 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-success-500 rounded-full animate-breathe"></div>
              </div>
            </div>
          </div>

          {/* Component Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <div className="card p-6">
              <h4 className="font-semibold mb-4">Buttons</h4>
              <div className="space-y-3">
                <button className="btn-primary w-full">Primary Button</button>
                <button className="btn-secondary w-full">Secondary Button</button>
                <button className="btn-ghost w-full">Ghost Button</button>
              </div>
            </div>

            {/* Inputs */}
            <div className="card p-6">
              <h4 className="font-semibold mb-4">Form Elements</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Text input"
                  className="input-base"
                />
                <input 
                  type="email" 
                  placeholder="Email input"
                  className="input-base"
                />
                <textarea 
                  placeholder="Textarea"
                  className="input-base resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="card-hover p-6">
              <h4 className="font-semibold mb-4">Stats Card</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-1">
                  1,234
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Users
                </div>
                <div className="text-xs text-success-500 mt-1">
                  ↗ +12% from last week
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="mb-16">
          <h3 className="text-2xl font-display font-semibold mb-8 text-center">
            Upcoming Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-hover p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-500 text-xl">💬</span>
              </div>
              <h4 className="font-semibold mb-2">AI Chat Interface</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Real-time conversations with intelligent AI assistant
              </p>
            </div>
            
            <div className="card-hover p-6 text-center">
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-success-500 text-xl">📊</span>
              </div>
              <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive insights and data visualization
              </p>
            </div>
            
            <div className="card-hover p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-500 text-xl">📁</span>
              </div>
              <h4 className="font-semibold mb-2">Document Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Smart document processing and organization
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass mt-16 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 AI Assistant Platform. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

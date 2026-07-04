import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';
import Footer from './components/Footer/Footer';
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/Auth/PrivateRoute.jsx';
import ProfileDashboard from './pages/ProfileDashboard.jsx';
import Editor from './components/Editor/Editor.jsx';
import TshirtCustomizer from './components/Cart/TshirtCustomizer.jsx';



function App() {
  const privateRoutes = [
    { path: '/profileDashBord', element: <ProfileDashboard /> },
    { path: '/editor', element: <Editor /> },
    { path: '/tshirtCustomizer', element: <TshirtCustomizer /> },
  ];
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
          ))}
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>

  );
}

export default App;
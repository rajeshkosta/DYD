
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import UserList from './components/Users/UserList';
import PageList from './components/Pages/PageList';
import PrivateRoute from './components/Auth/PrivateRoute';
import Home from './components/Home/Home';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import ReviewList from './components/Reviews/ReviewList';
import QueryList from './components/Querys/QueryList';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import ProductForm from './components/Products/ProductForm';
import OrderList from './components/Bookings/OrderList';
import BookingDetails from './components/Bookings/bookingDetails';
import PageForm from './components/Pages/PageForm';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="users" element={<UserList />} />
            <Route path="home" element={<Home />} />
            <Route path="pages" element={<PageList />} />
            <Route path="pagesForm" element={<PageForm />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="queries" element={<QueryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="productDetails" element={<ProductDetails />} />
            <Route path="productForm" element={<ProductForm />} />
            <Route path="orders" element={<OrderList />} />
            <Route path='bookingDetails' element={<BookingDetails />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;

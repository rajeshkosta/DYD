import { useState } from 'react';
import { Button, Drawer, Steps, message, Input, Form, Menu, Dropdown } from 'antd';
import { UserOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import { CircleUserRound } from 'lucide-react';
import { useEffect } from 'react';
import { authService } from '../services/api';
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from '../store/slices/authSlice';
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../services/firebase';
import placeHolder from "../assets/img/placeHolder.svg";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import logo from "../assets/img/logo.svg";
import logoBlue from "../assets/img/logo-blue.svg";

const Navbar = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const user = useSelector((state) => state?.auth?.user?.data);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // useEffect(() => {
  //   console.log("user", user);

  // }, [user]);



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdown, resendDisabled]);

  const startCountdown = () => {
    setCountdown(45);
    setResendDisabled(true);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  const resetFields = () => {
    setPhoneNumber('');
    setOtp('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setCurrentStep(0);
    setResendDisabled(true);
    setCountdown(45);
  }
  const handleSendOtp = async () => {
    try {
      const response = await authService.sendOtp({ number: `+91${phoneNumber}` });
      message.success(response.data.message);
      setCurrentStep(1);
      startCountdown();
    } catch (error) {
      startCountdown();
      setCurrentStep(1);
      message.error(error?.response?.data?.message || error.message);
    }
  }

  // const handleSendOtp = async () => {
  //   try {
  //     if (!phoneNumber) {
  //       message.error("Please enter a valid phone number.");
  //       return;
  //     }
  //     if (!window.recaptchaVerifier) {
  //       window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //         size: "invisible",
  //         callback: (response) => {
  //           console.log("Recaptcha Verified", response);
  //         },
  //         "expired-callback": () => {
  //           console.log("Recaptcha Expired");
  //         },
  //       });
  //     }

  //     const phoneNumberWithCode = `+91${phoneNumber}`;
  //     console.log("phoneNumberWithCode", phoneNumberWithCode);

  //     const appVerifier = window.recaptchaVerifier;
  //     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumberWithCode, appVerifier);
  //     console.log("confirmationResult", confirmationResult);


  //     window.confirmationResult = confirmationResult; // Store confirmationResult for verification step
  //     message.success("OTP sent successfully!");
  //     setCurrentStep(1);
  //     startCountdown();
  //   } catch (error) {
  //     message.error(error.message);
  //     console.log("error", error);

  //   }
  // };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await authService.verifyOtp({ number: `+91${phoneNumber}`, otp });
      // console.log("response", response.data);

      if (response.data.isNewUser) {
        setCurrentStep(2);
        message.success(response.data.message);
      } else if (response.data.token) {
        message.success(response.data.message);
        dispatch(setCredentials({
          user: response.data,
          token: response.data.token,
        }));
        setDrawerOpen(false);
        resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  // const handleVerifyOtp = async () => {
  //   try {
  //     if (!window.confirmationResult) {
  //       message.error("Please request OTP first.");
  //       return;
  //     }

  //     const result = await window.confirmationResult.confirm(otp);
  //     const user = result.user;

  //     message.success("OTP Verified Successfully!");

  //     // You can now save user details in Redux or call backend for user info
  //     dispatch(setCredentials({
  //       user: {
  //         phoneNumber: user.phoneNumber,
  //         uid: user.uid
  //       },
  //       token: user.accessToken
  //     }));

  //     setDrawerOpen(false);
  //     resetFields();
  //   } catch (error) {
  //     message.error("Invalid OTP. Please try again.");
  //   }
  // };


  const handleSubmitUserDetails = async () => {
    try {
      const response = await authService.login({
        number: `+91${phoneNumber}`, firstName, lastName, email
      });
      // console.log("response", response.data);
      message.success(response.data.message);
      dispatch(setCredentials({
        user: response.data,
        token: response.data.token,
      }));
      setDrawerOpen(false);
      resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to register");
    }
  };


  const steps = [
    {
      title: 'Login With mobile number',
      content: (
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <div className="w-16">
              <Input
                value="+91"
                className="bg-gray-50"
              />
            </div>
            <Input
              placeholder="Enter here"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button
            type="primary"
            block
            className="bg-[#3558A9] h-12"
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600">Terms of service</a> &{' '}
            <a href="#" className="text-blue-600">Privacy policy</a>
          </p>
          <div id="recaptcha-container"></div>

        </div>
      ),
    },
    {
      title: 'OTP verification',
      content: (
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            We have sent 4-digit OTP on your registered mobile number
          </p>
          <button
            className="text-blue-500 mb-4 hover:underline"
            onClick={() => setCurrentStep(0)}
          >
            Change number
          </button>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4"
          />
          <p className="text-sm text-gray-600 mb-4">
            Resend OTP in <span className="text-blue-600">{countdown} sec</span>
          </p>
          <Button
            type="primary"
            block
            className="bg-[#3558A9] h-12"
            onClick={handleVerifyOtp}
          >
            Verify
          </Button>
          <Button
            type="default"
            block
            disabled={resendDisabled}
            onClick={handleResendOtp}
            className='mt-4'
          >
            Resend OTP
          </Button>
        </div>
      ),
    },
    {
      title: 'Welcome to DYD',
      content: (
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Please fill some basic information to proceed.
          </p>
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button
            type="primary"
            block
            className="bg-[#3558A9] h-12"
            onClick={handleSubmitUserDetails}
          >
            Start Designing
          </Button>
        </div>
      ),
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined style={{ fontSize: "18px" }} />}>
        <Link to="/profileDashBord">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="order" icon={<ShoppingOutlined style={{ fontSize: "18px" }} />}>
        My Order
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined style={{ fontSize: "18px" }} />}>
        Logout
      </Menu.Item>
    </Menu>
  );


  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isHomePage ? 'bg-transparent' : 'bg-white'}  `}>
        <div className="max-w-7xl mx-auto px-4  py-6 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/"><img src={isHomePage && !scrolled ? logo : logoBlue} alt="Logo" className="h-12 transition-all duration-300" /></Link>
            </div>

            {isAuthenticated ? (
              <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
                <Button
                  type="button"
                  className={`transition-all duration-300 capitalize flex items-center gap-2
                     ${isHomePage && !scrolled ? "text-white" : "text-[#01B3D7]"
                    }`}
                >
                  <img src={placeHolder} alt="place" className="w-8 h-8 rounded-full" />
                  {user?.name}
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={`transition-all duration-300 ${scrolled ? 'text-[#01B3D7]' : 'text-white'}`}
              >
                {<CircleUserRound />}
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <Drawer
        title={steps[currentStep].title}
        placement="right"
        onClose={() => {
          setDrawerOpen(false);
          setCurrentStep(0);
          resetFields();
        }}
        open={drawerOpen}
        width={window.innerWidth < 768 ? '100%' : 400}
      // getContainer={false}
      >
        {steps[currentStep].content}
      </Drawer>
    </>
  );
};

export default Navbar;
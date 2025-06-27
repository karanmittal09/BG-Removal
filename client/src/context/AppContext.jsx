import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [credit, setCredit] = useState(5); // Default 5 credits for new users
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Wrapped in useCallback to prevent recreation on every render
  const loadCreditsData = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credits);
      } else {
        // Keep the default 5 credits if API fails to load user credits
        toast.error(data.message || "Failed to load credits");
      }
    } catch (error) {
      console.error("Credit Fetch Error:", error);
      if (error.response?.status === 401) {
        // Authentication error - user might need to sign in again
      }
      toast.error(error.response?.data?.message || error.message || "Failed to load credits");
    }
  }, [getToken, backendUrl]);

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      // Check if user has credits before processing
      if (credit <= 0) {
        toast.error("You don't have enough credits. Please purchase more credits to continue.");
        navigate("/buy");
        return;
      }

      setImage(image);
      setResultImage(false);

      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/image/remove-bg",
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        // Update credits after successful background removal
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        } else {
          // Fallback: reduce credit by 1 if backend doesn't return creditBalance
          setCredit(prevCredit => Math.max(0, prevCredit - 1));
        }
      } else {
        toast.error(data.message);
        // Handle specific error cases
        if (data.message === "Credit Balance is zero" || data.creditBalance === 0) {
          setCredit(0);
          toast.error("You've run out of credits. Redirecting to purchase page...");
          setTimeout(() => {
            navigate("/buy");
          }, 2000);
        } else {
          // Still update credits if provided
          if (data.creditBalance !== undefined) {
            setCredit(data.creditBalance);
          }
        }
      }
    } catch (error) {
      console.error(error);

      // Handle specific HTTP error responses
      if (error.response?.status === 403 && error.response?.data?.message === "Credit Balance is zero") {
        setCredit(0);
        toast.error("You've run out of credits. Redirecting to purchase page...");
        setTimeout(() => {
          navigate("/buy");
        }, 2000);
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to process image");
      }
    }
  };

  // Load credits when user signs in
  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    } else {
      // Set default credits for new/signed out users
      setCredit(5);
    }
  }, [isSignedIn, loadCreditsData]);

  // Function to check if user has credits and redirect if not
  const checkCreditsAndRedirect = () => {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }

    if (credit <= 0) {
      toast.error("You don't have enough credits. Please purchase more credits to continue.");
      navigate("/buy");
      return false;
    }

    return true;
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
    checkCreditsAndRedirect,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
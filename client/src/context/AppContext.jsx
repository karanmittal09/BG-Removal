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
      console.log("🔄 Loading credits data...");
      const token = await getToken();
      
      if (!token) {
        console.log("❌ No token available");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        console.log("✅ Credits loaded:", data.credits);
        setCredit(data.credits);
      } else {
        console.log("❌ Credits load failed, keeping default credits");
        // Keep the default 5 credits if API fails to load user credits
        toast.error(data.message || "Failed to load credits");
      }
    } catch (error) {
      console.error("❌ Credit Fetch Error:", error);
      if (error.response?.status === 401) {
        console.log("Authentication error - user might need to sign in again");
      }
      toast.error(error.response?.data?.message || error.message || "Failed to load credits");
    }
  }, [getToken, backendUrl]);

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
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
        // Still update credits even if image processing failed
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        }
        if (data.creditBalance === 0 || credit <= 1) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Load credits when user signs in
  useEffect(() => {
    console.log("AppContext useEffect - isSignedIn:", isSignedIn);
    if (isSignedIn) {
      loadCreditsData();
    } else {
      // Set default credits for new/signed out users
      setCredit(5);
    }
  }, [isSignedIn, loadCreditsData]);

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
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
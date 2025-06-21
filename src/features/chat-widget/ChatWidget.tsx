import { useState, useEffect } from "react";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { motion } from "framer-motion";

import { BYPASS_AUTH } from "@/lib/config";
import { ROLE_BASED_MESSAGES } from "./const";
import { useUser } from "@/hooks/use-user";

import { PopupMessage, ChatWindow } from "./components";

// Animation variants
const bounceVariants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 4, // Bounce every 4 seconds (during the gap between popups)
    },
  },
  static: {
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const ChatWidget = () => {
  const { user } = useUser();
  const [showPopup, setShowPopup] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Get messages for current user role
  const getRoleMessages = (): string[] => {
    if (!user?.role) return ROLE_BASED_MESSAGES.farmer;
    return ROLE_BASED_MESSAGES[user.role] || ROLE_BASED_MESSAGES.farmer;
  };

  // Handle popup message cycling (only when chat is closed)
  useEffect(() => {
    if (!user && !BYPASS_AUTH) return;
    if (isChatOpen) return; // Don't show popup when chat is open

    const messages = getRoleMessages();
    let messageIndex = 0;

    const showNextMessage = () => {
      if (isChatOpen) return; // Double check in case chat was opened during timeout

      setCurrentMessage(messages[messageIndex]);
      setShowPopup(true);
      messageIndex = (messageIndex + 1) % messages.length;

      // Hide popup after 4 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 4000);
    };

    // Show first message after 2 seconds
    const initialTimeout = setTimeout(showNextMessage, 2000);

    // Show subsequent messages every 8 seconds (4 seconds visible + 4 seconds hidden)
    const interval = setInterval(showNextMessage, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [user, isChatOpen]); // Add isChatOpen to dependency array

  const handleWidgetClick = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat window
    if (!isChatOpen) {
      setShowPopup(false); // Hide popup when opening chat
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  if (!user && !BYPASS_AUTH) return null;

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <PopupMessage
          message={currentMessage}
          isVisible={showPopup && !isChatOpen} // Only show popup when chat is closed
          onClose={handleClosePopup}
        />
        <motion.button
          variants={bounceVariants}
          animate={isChatOpen || showPopup ? "static" : "bounce"}
          onClick={handleWidgetClick}
          className="relative size-12 cursor-pointer bg-primary text-primary-foreground rounded-full p-2.5 hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
        >
          <BiSolidMessageSquareDots className="size-full" />
        </motion.button>
      </div>

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
};

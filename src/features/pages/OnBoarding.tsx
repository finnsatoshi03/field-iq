import React from "react";
import { Header } from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

interface OnboardingQuestion {
  id: number;
  question: string;
  emoji: string;
  alt: string;
}

interface QuestionItemProps {
  question: OnboardingQuestion;
  index: number;
}

// Configuration data - easily maintainable and extendable
const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 1,
    question: "Worried about your chickens?",
    emoji: "/images/emoji-1.svg",
    alt: "Worried Chick Icon",
  },
  {
    id: 2,
    question: "Hoping for bigger profits?",
    emoji: "/images/emoji-2.svg",
    alt: "Hopeful Chick Icon",
  },
  {
    id: 3,
    question: "Sure about the right feed?",
    emoji: "/images/emoji-3.svg",
    alt: "Questioning Chick Icon",
  },
  {
    id: 4,
    question: "Satisfied with your results?",
    emoji: "/images/emoji-4.svg",
    alt: "Satisfied Chick Icon",
  },
  {
    id: 5,
    question: "Stressed by problems?",
    emoji: "/images/emoji-5.svg",
    alt: "Stressed Chick Icon",
  },
  {
    id: 6,
    question: "Curious about best practices?",
    emoji: "/images/emoji-6.svg",
    alt: "Curious Chick Icon",
  },
  {
    id: 7,
    question: "Ready to expand?",
    emoji: "/images/emoji-7.svg",
    alt: "Ambitious Chick Icon",
  },
  {
    id: 8,
    question: "Want to increase your income even more?",
    emoji: "/images/emoji-8.svg",
    alt: "Money-focused Chick Icon",
  },
] as const;

// Typing indicator animation
const typingVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Message bubble animation (messenger style)
const messageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    x: -50,
    originX: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
};

// Avatar animation
const avatarVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 600,
      damping: 30,
    },
  },
};

/**
 * Typing indicator component (3 dots animation)
 */
const TypingIndicator = () => {
  return (
    <motion.div
      className="flex gap-1 px-4 py-2 bg-accent rounded-full w-fit"
      variants={typingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

/**
 * Messenger-style message component with original styling
 */
const QuestionItem: React.FC<QuestionItemProps> = ({ question, index }) => {
  const [showTyping, setShowTyping] = React.useState(true);
  const [showMessage, setShowMessage] = React.useState(false);
  const [showAvatar, setShowAvatar] = React.useState(false);

  React.useEffect(() => {
    const avatarDelay = index * 800; // Stagger avatars
    const typingDelay = avatarDelay + 300; // Show typing after avatar
    const messageDelay = typingDelay + 600; // Shorter typing indicator duration

    // Show avatar first
    const avatarTimer = setTimeout(() => {
      setShowAvatar(true);
    }, avatarDelay);

    // Hide typing and show message
    const messageTimer = setTimeout(() => {
      setShowTyping(false);
      setShowMessage(true);
    }, messageDelay);

    return () => {
      clearTimeout(avatarTimer);
      clearTimeout(messageTimer);
    };
  }, [index]);

  return (
    <div className="flex gap-1">
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0"
        variants={avatarVariants}
        initial="hidden"
        animate={showAvatar ? "visible" : "hidden"}
      >
        <img
          src={question.emoji}
          alt={question.alt}
          className="h-8 w-auto"
          loading="lazy"
        />
      </motion.div>

      {/* Message container */}
      <div className="flex flex-col">
        {/* Typing indicator */}
        {showTyping && showAvatar && <TypingIndicator />}

        {/* Message bubble - your original styling */}
        {showMessage && (
          <motion.p
            className="px-4 py-1.5 rounded bg-accent text-accent-foreground font-medium text-sm leading-relaxed"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            {question.question}
          </motion.p>
        )}
      </div>
    </div>
  );
};

/**
 * OnBoarding Page Component
 *
 * Displays a series of engaging questions to onboard users
 * Uses data-driven approach for easy maintenance and scalability
 */
export default function OnBoardingPage() {
  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <Header />

      <main className="max-w-md w-full mx-auto flex-1 flex flex-col min-h-0">
        {/* Main Content Area */}
        <div className="min-h-0 flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-[17rem] space-y-10">
            {/* Questions List */}
            <div className="space-y-1">
              {ONBOARDING_QUESTIONS.map((question, index) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
            <motion.h1
              className="text-center font-display text-2xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: ONBOARDING_QUESTIONS.length * 0.75 + 1,
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              Over time, you'll see patterns in your farm's performance and
              sales.
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: ONBOARDING_QUESTIONS.length * 0.75 + 1.5,
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          <Link to="/auth/sign-in">
            <Button className="w-full">
              <p>Continue with Email</p>
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

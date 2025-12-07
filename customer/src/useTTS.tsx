import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type TTSContextType = {
  enabled: boolean;
  toggle: () => void;
  speak: (text: string) => void;
};

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("ttsEnabled");
    return saved === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ttsEnabled", String(enabled));
  }, [enabled]);

  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  return (
    <TTSContext.Provider value={{ enabled, toggle, speak }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = (): TTSContextType => {
  const ctx = useContext(TTSContext);
  if (!ctx) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return ctx;
};

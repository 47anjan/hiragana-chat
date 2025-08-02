"use client";

import { useState, useEffect, useRef } from "react";
import { hiraganaData } from "@/lib/data";

interface Character {
  romaji: string;
  hiragana: string;
  pronounce: string;
  difficulty: number;
  category: string;
}

export default function HiraganaChart() {
  // Core state
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced UX state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showHiragana, setShowHiragana] = useState(true);

  // Audio ref for cleanup
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Enhanced audio playback with actual HTML Audio
  const playAudio = async (character: Character) => {
    try {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      setPlayingAudio(character.pronounce);

      // Create new audio element
      const audio = new Audio(character.pronounce);
      currentAudioRef.current = audio;

      // Handle audio events
      audio.addEventListener("ended", () => {
        setPlayingAudio(null);
        currentAudioRef.current = null;
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);

        setPlayingAudio(null);
        currentAudioRef.current = null;
      });

      // Play the audio
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingAudio(null);
      currentAudioRef.current = null;
    }
  };

  // Filter characters based on current settings
  const getFilteredCharacters = (characters: (Character | null)[]) => {
    return characters.filter((char) => {
      if (!char) return false;
      if (selectedCategory && char.category !== selectedCategory) return false;
      return true;
    });
  };

  const renderCharacterCard = (character: Character | null, index: number) => {
    if (!character) return <div key={index} className="w-20 h-20" />;

    const isPlaying = playingAudio === character.pronounce;

    const difficultyColors = {
      1: "border-green-200 bg-green-50",
      2: "border-blue-200 bg-blue-50",
      3: "border-yellow-200 bg-yellow-50",
      4: "border-orange-200 bg-orange-50",
      5: "border-red-200 bg-red-50",
    };

    return (
      <button
        key={character.romaji}
        className={`
          group relative will-change-transform transition-all duration-300 ease-out cursor-pointer
          w-20 h-20
          
        
          ${
            difficultyColors[
              character.difficulty as keyof typeof difficultyColors
            ] || "border-gray-200 bg-gray-50"
          }
          flex flex-col items-center justify-center rounded-2xl border-2 shadow-lg
          hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${!isLoaded ? "opacity-0 scale-90" : ""}
        `}
        style={{
          animationDelay: `${index * 30}ms`,
          transform: isPlaying ? "scale(1.1) rotate(3deg)" : undefined,
        }}
        onClick={() => playAudio(character)}
      >
        <div
          className={`text-xs font-medium text-gray-600 transition-colors ${
            isPlaying ? "text-blue-600" : ""
          } ${!showRomaji ? "opacity-0" : ""}`}
        >
          {character.romaji}
        </div>

        <div
          className={`font-japanese will-change-transform transition-all duration-200 text-3xl ${
            isPlaying ? "text-blue-600 scale-110" : "text-gray-800"
          } ${!showHiragana ? "opacity-0" : ""}`}
        >
          {character.hiragana}
        </div>

        {/* Hover effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-blue-100/30 transition-opacity ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
    );
  };

  const renderCharacterGrid = () => {
    return (
      <div className="space-y-8">
        {/* Basic Characters */}
        <section>
          <div className="space-y-3">
            {Object.entries(hiraganaData.basic).map(
              ([lineName, characters]) => {
                const filteredChars = getFilteredCharacters(characters);
                if (filteredChars.length === 0) return null;

                return (
                  <div key={lineName} className="flex items-center gap-4">
                    <div className="border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl  w-28 h-20 border-2 flex items-center justify-center font-semibold flex-col text-base text-center shadow-md">
                      {lineName}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {characters.map((char, idx) =>
                        char ? (
                          renderCharacterCard(char, idx)
                        ) : (
                          <div key={idx} className="w-20 h-20" />
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Voiced Characters */}
        <section>
          <div className="space-y-3">
            {Object.entries(hiraganaData.voiced).map(
              ([lineName, characters]) => {
                const filteredChars = getFilteredCharacters(characters);
                if (filteredChars.length === 0) return null;

                return (
                  <div key={lineName} className="flex items-center gap-4">
                    <div className="border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl  w-28 h-20 border-2 flex items-center justify-center font-semibold flex-col text-base text-center shadow-md">
                      {lineName}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {characters.map((char, idx) =>
                        char ? (
                          renderCharacterCard(char, idx)
                        ) : (
                          <div key={idx} className="w-20 h-20" />
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
                Master Japanese hiragana with interactive learning, smart
                practice, and progress tracking
              </p>
            </div>
          </div>

          {/* Learning Mode Selector */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Filters and Controls */}
              <div className="mt-8 bg-white rounded-2xl p-8  border border-slate-200 backdrop-blur-sm">
                <div className="space-y-8">
                  {/* Display Options Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Display Options
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Customize which character representations are visible
                      during practice
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <label className="group flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={showRomaji}
                            onChange={(e) => setShowRomaji(e.target.checked)}
                            className="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                            Romaji
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            Latin alphabet representation
                          </div>
                        </div>
                      </label>
                      <label className="group flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={showHiragana}
                            onChange={(e) => setShowHiragana(e.target.checked)}
                            className="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                            Hiragana
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            Japanese characters
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                  {/* Category Filter Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Character Categories
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Focus your practice on specific character groups
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
                      {[
                        {
                          value: null,
                          label: "All Categories",
                          desc: "Complete set",
                        },
                        {
                          value: "vowel",
                          label: "Vowels",
                          desc: "あ い う え お",
                        },
                        {
                          value: "consonant",
                          label: "Consonants",
                          desc: "か さ た な...",
                        },
                        {
                          value: "special",
                          label: "Special",
                          desc: "ん を つ...",
                        },
                        {
                          value: "voiced",
                          label: "Voiced",
                          desc: "が ざ だ ば...",
                        },
                      ].map((category) => (
                        <label
                          key={category.value || "all"}
                          className={`group flex flex-col p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            selectedCategory === category.value
                              ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
                              : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                              <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category.value}
                                onChange={() =>
                                  setSelectedCategory(category.value)
                                }
                                className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <span
                              className={`font-medium transition-colors ${
                                selectedCategory === category.value
                                  ? "text-blue-700"
                                  : "text-slate-700 group-hover:text-blue-700"
                              }`}
                            >
                              {category.label}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed ml-7">
                            {category.desc}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="transition-all duration-500">
          {renderCharacterGrid()}
        </main>

        {/* Enhanced Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Keep practicing daily for the best results • がんばって！</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

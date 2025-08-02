"use client";

import { useState, useEffect } from "react";
import { Volume2, BookOpen, Sparkles, Star, Brain } from "lucide-react";
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
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);
  const [playedCharacters, setPlayedCharacters] = useState<Set<string>>(
    new Set()
  );
  const [masteredCharacters, setMasteredCharacters] = useState<Set<string>>(
    new Set()
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced UX state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showHiragana, setShowHiragana] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced audio playback
  const playAudio = (character: Character) => {
    setPlayingAudio(character.pronounce);
    setPlayedCharacters((prev) => new Set([...prev, character.pronounce]));

    // Simulate audio playback
    setTimeout(() => {
      setPlayingAudio(null);
    }, 800);
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

    const isPlaying = playingAudio === character.romaji;
    const isHovered = hoveredCharacter === character.romaji;

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
            isPlaying ? "scale-110 rotate-3" : "hover:scale-105 hover:-rotate-1"
          }
        
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
        onMouseEnter={() => setHoveredCharacter(character.romaji)}
        onMouseLeave={() => setHoveredCharacter(null)}
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
            isHovered || isPlaying ? "opacity-100" : "opacity-0"
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
                  <div key={lineName} className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium w-28 h-20 border-2 border-transparent flex items-center justify-center flex-col text-base text-center">
                      {lineName === "n" ? "ん" : lineName.replace("-line", "")}
                    </div>
                    <div className="flex gap-2 flex-wrap">
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
                  <div key={lineName} className="flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-medium w-28 h-20 border-2 border-transparent flex items-center justify-center flex-col text-base text-center">
                      {lineName.replace("-line", "")}
                    </div>
                    <div className="flex gap-2 flex-wrap">
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
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            {/* Filters and Controls */}
            <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="space-y-6">
                {/* Character Display Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Select which characters to display:
                  </h3>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showRomaji}
                        onChange={(e) => setShowRomaji(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">Romaji</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showHiragana}
                        onChange={(e) => setShowHiragana(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700">Hiragana</span>
                    </label>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Select category to display:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: null, label: "All Categories" },
                      { value: "vowel", label: "Vowels" },
                      { value: "consonant", label: "Consonants" },
                      { value: "special", label: "Special" },
                      { value: "voiced", label: "Voiced" },
                    ].map((category) => (
                      <label
                        key={category.value || "all"}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.value}
                          onChange={() => setSelectedCategory(category.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {category.label}
                        </span>
                      </label>
                    ))}
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

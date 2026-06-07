import { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import MovieCard from "./MovieCard";
import { movies } from "./data";
import {
  genres,
  moods,
  languages
} from "./constants";
import { API_KEY } from "./config";

export default function App() {

  // Save user choices
  const [age, setAge] =
    useState("");

  const [mood, setMood] =
    useState("");

  const [genre, setGenre] =
    useState("");

  const [language,
    setLanguage] =
    useState("");

  // AI message
  const [aiMessage,
    setAiMessage] =
    useState("");

  // Movie cards
  const [movieResult,
    setMovieResult] =
    useState([]);

  // Recommend movie
  async function recommendMovie() {

    // Remove emoji from genre
    let cleanGenre =
      genre
        .replace(/[^\w\s]/gi, "")
        .trim();

    // Filter movies
    let filteredMovies =
      movies.filter(
        (movie) =>
          movie.genre
            .toLowerCase()
            .includes(
              cleanGenre
                .toLowerCase()
            ) &&
          movie.language ===
          language
      );

    setMovieResult(
      filteredMovies
    );

    // AI Prompt
    const prompt = `
Recommend 5 movies for:

Age: ${age}
Mood: ${mood}
Genre: ${genre}
Language: ${language}

Rules:
1. Do NOT write introduction text.
2. Start directly from movie list.
3. Use numbering.
4. Keep answers short.

Example:

1. Toy Story - Fun animated movie
2. Frozen - Magical adventure
`;

    try {

      const response =
        await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${API_KEY}`
            },

            body: JSON.stringify({
              model:
                "llama-3.1-8b-instant",

              messages: [
                {
                  role: "user",
                  content:
                    prompt
                }
              ]
            })
          }
        );

      const data =
        await response.json();

      setAiMessage(
        data.choices[0]
          .message.content
      );

    } catch (error) {

      console.log(error);

      setAiMessage(
        "AI is not working."
      );
    }
  }

  return (
    <div>

      <Navbar />

      <HeroSection />

      <div className="container">

        <h1>
          🎬 Find Your Movie
        </h1>

        {/* AGE */}

        <select
          onChange={(e) =>
            setAge(
              e.target.value
            )
          }
        >

          <option>
            Select Age
          </option>

          <option>
            Kids
          </option>

          <option>
            Teen
          </option>

          <option>
            Adult
          </option>

        </select>

        {/* MOOD */}

        <select
          onChange={(e) =>
            setMood(
              e.target.value
            )
          }
        >

          <option>
            Select Mood
          </option>

          {age &&
            moods[age].map(
              (
                item,
                index
              ) => (

                <option
                  key={index}
                >
                  {item}
                </option>

              )
            )}

        </select>

        {/* GENRE */}

        <select
          onChange={(e) =>
            setGenre(
              e.target.value
            )
          }
        >

          <option>
            Select Genre
          </option>

          {age &&
            genres[age].map(
              (
                item,
                index
              ) => (

                <option
                  key={index}
                >
                  {item}
                </option>

              )
            )}

        </select>

        {/* LANGUAGE */}

        <select
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
        >

          <option>
            Select Language
          </option>

          {languages.map(
            (
              item,
              index
            ) => (

              <option
                key={index}
              >
                {item}
              </option>

            )
          )}

        </select>

        <br />
        <br />

        {/* BUTTON */}

        <button
          onClick={
            recommendMovie
          }
        >
          🎥 Recommend Movie
        </button>

        {/* AI SECTION */}

        <div className="ai-box">

          <div className="ai-header">

            <h2>
              🤖 AI Movie Expert
            </h2>

            <span className="badge">

              Smart Recommendation

            </span>

          </div>

          <div className="ai-content">

            {aiMessage ? (

              <div className="ai-text">

                {aiMessage
                  .split(
                    /\d+\.\s/
                  )

                  .filter(
                    (movie) =>
                      movie
                        .trim()
                        .length >
                      20
                  )

                  .map(
                    (
                      movie,
                      index
                    ) => (

                      <div
                        key={index}
                        className="movie-suggestion"
                      >

                        <h3>

                          🎬 Movie{" "}
                          {index + 1}

                        </h3>

                        <p>
                          {movie.trim()}
                        </p>

                      </div>

                    ))}

              </div>

            ) : (

              <p className="placeholder">

                🎬 Choose
                age, mood,
                genre and
                language

                <br />
                <br />

                Then click

                <strong>

                  {" "}
                  Recommend
                  Movie

                </strong>

              </p>

            )}

          </div>

        </div>

        {/* MOVIE CARDS */}

        <h2>
          🍿 Movie Cards
        </h2>

        <div className="movie-list">

          {movieResult.map(
            (movie) => (

              <MovieCard
                key={
                  movie.id
                }
                movie={movie}
              />

            )
          )}

        </div>

      </div>
    </div>
  );
}
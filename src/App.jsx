import { useState } from 'react';
import Navbar from './Navbar';
import  HeroSection  from './HeroSection';
import MovieCard from './MovieCard';
import { movies } from './data';
import { genres, languages, moods } from './constants';
import { API_KEY } from './config';


export default function App() {
const [age, setAge] = useState('');
const [mood, setMood] = useState('');
const [genre, setGenre] = useState('');
const [language, setLanguage] = useState('');

const [aiMessage, setAiMessage] = useState('');

const [movieResult, setMovieResult] = useState([]);

async function reccomendMovies() {
  let cleanGenre = genre.replace(/[^\w\s]/gi, "").trim();

 let filteredMovies = movies.filter(

(movie) =>

movie.genre.toLowerCase() === cleanGenre.toLowerCase() &&

movie.language.toLowerCase() === language.toLowerCase()

);
  setMovieResult(filteredMovies);

  


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
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.1-8b-instant',
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();

  setAiMessage(data.choices[0].message.content);

} catch (error) {
  console.log (error);
  
setAiMessage(

"AI is not working."

);
}}

}
  return (

    <div>
      <Navbar />

      <HeroSection />

      <h1>
        Find Your Movie!
      </h1>

      <select
onChange={(e) =>
setAge(
e.target.value
)
}
>
        <option>Select Age</option>
        <option>Kid</option>
        <option>Teen</option>
        <option>Adult</option>
      </select>

      <select onChange={(e) => setMood(e.target.value)}>
        <option >Select Mood</option>

        {age && moods[age].map((item, index) => (
          <option key={index}> {item}
          </option>
        ))}
      </select>

      <select onChange={(e) => setGenre(e.target.value)}>
        <option >Select Genre</option>


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

      <select onChange={(e) => setLanguage(e.target.value)}>
        <option >Select Language</option>

        {languages.map((item, index) => (
          <option key={index}> {item}
          </option>
        ))}
      </select>

      <br/>
      <br/>

      <button onClick={reccomendMovie}>
        Recommend Movie
      </button>

      <div className='ai-box'>

        <div className='ai-header'>
          <h2>AI Recommendations:</h2>
      
        <span className='badge'>
          Smart Reccomendations
        </span>

      </div>

      <div classname='ai-content'>
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


          <p className='placeholder'>
            Choose age, mood, genre, and language to get movie recommendations!
            <br/>
            <br/>
             Then Click
            <strong>
              {""}
              Recommend Movie
            </strong>
            !
          </p>
       
        )}

      
      </div>
    
        </div>
    <h2>
      Movie Cards:
    </h2>

    <div className='movie-list'>
      {movieResult.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))
        }


          </div>
          </div>
          </div>
);
        }
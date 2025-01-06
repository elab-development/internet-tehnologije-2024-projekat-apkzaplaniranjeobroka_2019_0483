import React, { useState, useEffect } from 'react';
import './RecipeRecommendation.css';

const RecipeRecommendation = () => {
  const [preferences, setPreferences] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Učitavanje preferencija iz localStorage pri prvom renderovanju
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('dijetetske_preferencije')) || [];
    if (savedPreferences.length > 0) {
      setPreferences(savedPreferences.join(', ')); // Kombinujemo preferencije u jedan string
      fetchRecipes(savedPreferences.join(', ')); // Automatski učitavamo recepte
    }
  }, []);

  const fetchRecipes = async (diet) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?diet=${diet}&apiKey=dd2f0ac74d7b45dc979e6da9145e58cd`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes.');
      }

      const data = await response.json();
      setRecipes(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRecipes = () => {
    fetchRecipes(preferences);
  };

  return (
    <div className="recipe-container">
      <h1 className="title">Pronađite recepte</h1>
      <div className="input-section">
        <label htmlFor="preferences" className="label">
          Vaše dijetetske preferencije:
        </label>
        <input
          type="text"
          id="preferences"
          placeholder="npr. vegan, keto, vegetarian..."
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="input"
        />
        <button onClick={handleFetchRecipes} className="button">
          Prikaži recepte
        </button>
      </div>
      {loading && <p className="loading">Učitavanje...</p>}
      {error && <p className="error">{error}</p>}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
            />
            <h3 className="recipe-title">{recipe.title}</h3>
            <a
              href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="recipe-link"
            >
              Pogledaj recept
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeRecommendation;

import type { Recipe } from '$lib/types';

// Predefined recipe list — used instead of hitting the external API for
// the main browse experience. Real image URLs from TheMealDB's public CDN
// are reused here (just as static references, not live fetches) so images
// still render correctly.
export const seedRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    image: 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg',
    category: 'Pasta',
    cuisine: 'Italian',
    ingredients: [
      '200g spaghetti',
      '100g pancetta',
      '2 large eggs',
      '50g Parmesan cheese',
      '2 cloves garlic',
      'Black pepper',
      'Salt',
    ],
    instructions:
      'Cook spaghetti in salted boiling water until al dente. Fry pancetta with garlic until crisp. Whisk eggs with Parmesan. Off heat, toss hot pasta with pancetta, then quickly stir in the egg mixture so it turns creamy, not scrambled. Season with black pepper and serve immediately.',
    source: 'seed',
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    image: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
    category: 'Chicken',
    cuisine: 'Indian',
    ingredients: [
      '500g chicken breast, cubed',
      '200g yogurt',
      '2 tbsp tikka masala paste',
      '1 onion, diced',
      '400g canned tomatoes',
      '100ml cream',
      'Fresh coriander',
    ],
    instructions:
      'Marinate chicken in yogurt and half the tikka paste for at least 30 minutes. Grill or pan-sear until charred. Sauté onion, add remaining paste and tomatoes, simmer into a sauce. Stir in cream and the cooked chicken. Simmer 10 minutes and garnish with coriander.',
    source: 'seed',
  },
  {
    id: '3',
    title: 'Classic Beef Tacos',
    image: 'https://www.sargento.com/assets/Uploads/Recipe/Image/BeefTaco__FocusFillWyIwLjAwIiwiMC4wMCIsODAwLDQ3OF0_CompressedW10.jpg',
    category: 'Beef',
    cuisine: 'Mexican',
    ingredients: [
      '500g ground beef',
      '8 taco shells',
      '1 packet taco seasoning',
      'Lettuce, shredded',
      'Tomato, diced',
      'Cheddar cheese, grated',
      'Sour cream',
    ],
    instructions:
      'Brown the ground beef in a skillet, drain excess fat. Add taco seasoning with water per packet instructions and simmer until thickened. Warm taco shells. Fill with beef, then top with lettuce, tomato, cheese, and sour cream.',
    source: 'seed',
  },
  {
    id: '4',
    title: 'Margherita Pizza',
    image: 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
    category: 'Vegetarian',
    cuisine: 'Italian',
    ingredients: [
      '1 pizza dough base',
      '100ml tomato sauce',
      '150g fresh mozzarella',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt',
    ],
    instructions:
      'Preheat oven to its highest setting. Spread tomato sauce over the dough, leaving a border. Tear mozzarella over the top. Bake until the crust is golden and cheese bubbles. Finish with fresh basil, a drizzle of olive oil, and salt.',
    source: 'seed',
  },
  {
    id: '5',
    title: 'Pad Thai',
    image: 'https://www.recipetineats.com/tachyon/2018/05/Chicken-Pad-Thai_9.jpg?resize=900%2C1260&zoom=0.72',
    category: 'Noodles',
    cuisine: 'Thai',
    ingredients: [
      '200g rice noodles',
      '200g shrimp or tofu',
      '2 eggs',
      '3 tbsp fish sauce',
      '2 tbsp tamarind paste',
      '2 tbsp palm sugar',
      'Bean sprouts',
      'Crushed peanuts',
      'Lime wedges',
    ],
    instructions:
      'Soak rice noodles until pliable. Stir-fry shrimp/tofu, push aside, scramble eggs in the same pan. Add noodles, fish sauce, tamarind paste, and palm sugar; toss to combine. Fold in bean sprouts. Serve topped with crushed peanuts and lime.',
    source: 'seed',
  },
  {
    id: '6',
    title: 'Chocolate Lava Cake',
    image: 'https://images.unsplash.com/photo-1585504455924-3d3b0eb2b8ee?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Dessert',
    cuisine: 'French',
    ingredients: [
      '100g dark chocolate',
      '100g butter',
      '2 eggs',
      '2 egg yolks',
      '50g sugar',
      '2 tbsp flour',
    ],
    instructions:
      'Melt chocolate and butter together. Whisk eggs, egg yolks, and sugar until pale, then fold in the chocolate mixture and flour. Pour into buttered ramekins and bake at 200°C for 10-12 minutes, until the edges are set but the center is still soft. Serve immediately.',
    source: 'seed',
  },
  {
    id: '7',
    title: 'Greek Salad',
    image: 'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg',
    category: 'Salad',
    cuisine: 'Greek',
    ingredients: [
      '3 tomatoes, chopped',
      '1 cucumber, sliced',
      '1 red onion, thinly sliced',
      '200g feta cheese',
      'Kalamata olives',
      'Olive oil',
      'Dried oregano',
    ],
    instructions:
      'Combine tomatoes, cucumber, and red onion in a bowl. Top with a block or crumbled feta and olives. Drizzle generously with olive oil, sprinkle with oregano, and season with salt.',
    source: 'seed',
  },
  {
    id: '8',
    title: 'Vegetable Fried Rice',
    image: 'https://www.themealdb.com/images/media/meals/1529444830.jpg',
    category: 'Vegetarian',
    cuisine: 'Chinese',
    ingredients: [
      '3 cups cooked, cooled rice',
      '2 eggs',
      '1 cup mixed vegetables',
      '3 tbsp soy sauce',
      '2 spring onions, sliced',
      '2 tbsp vegetable oil',
    ],
    instructions:
      'Heat oil in a wok. Scramble eggs and set aside. Stir-fry mixed vegetables until just tender. Add rice, breaking up clumps, and stir-fry until heated through. Return eggs to the wok, add soy sauce, and toss everything together. Garnish with spring onions.',
    source: 'seed',
  },
];
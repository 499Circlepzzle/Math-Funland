# Dice Counting & Subtraction Funland

A joyful math app for preschool learners (Ages 4-6).

## Features

- **Module A: Roll & Count**: Interactive dice rolling and counting practice.
- **Module B: Jump Path**: Number line navigation game.
- **Module C: Feeding Time**: Subtraction stories with visual cues.
- **Child-Friendly**: No reading required, audio cues, large touch targets.
- **Offline Capable**: All assets are local.

## How to Run

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev:client`
3.  Open the application in your browser.

## Adding Content

### New Modules
To add a new game module:
1.  Create a new page in `client/src/pages/`.
2.  Add the route in `client/src/App.tsx`.
3.  Add a link card in `client/src/pages/home.tsx`.

### Customizing Assets
- **Avatars**: Defined in `client/src/components/ui/character-avatar.tsx`.
- **Audio**: Managed in `client/src/lib/audio.ts`.

## Tech Stack
- React
- Tailwind CSS
- Framer Motion (Animations)
- Zustand (State Management)
- Wouter (Routing)

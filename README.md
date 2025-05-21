```
A security dashboard for monitoring credential leaks and exposed secrets in code repositories and websites.

## Features

- Real-time monitoring of security vulnerabilities
- Detection of exposed API keys, passwords, and credentials
- Security metrics and scoring
- Domain monitoring
- Integration with GitHub repositories

## Technologies

- Next.js
- React
- Tailwind CSS
- Supabase for database storage
- TypeScript

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account


### Installation

1. Clone the repository
```

git clone [https://github.com/shikjupyter/Leakwatch.git](https://github.com/shikjupyter/Leakwatch.git)
cd Leakwatch

```plaintext

2. Install dependencies
```

npm install

# or

yarn install

```plaintext

3. Set up environment variables
Create a `.env.local` file with the following variables:
```

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```plaintext

4. Run the development server
```

npm run dev

# or

yarn dev

```plaintext

5. Open [http://localhost:3000](http://localhost:3000) in your browser
```

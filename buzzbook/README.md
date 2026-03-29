# 🧠 Movie Booking Platform
The Movie Booking Platform is a comprehensive application designed to provide users with a seamless experience in booking movie tickets. The platform allows users to browse through various movies, theaters, and showtimes, and book tickets online. It also provides features such as user authentication, location management, and snack ordering. The platform is built using a range of technologies, including Next.js and Socket.IO.

## 🚀 Features
- User authentication and authorization
- Location management (cities, movies, theaters)
- Booking management (seat selection, payment processing)
- Snack ordering and management
- Real-time updates using Socket.IO
- Image optimization using Next.js
- API endpoint management using Axios

## 🛠️ Tech Stack
- Frontend: Next.js,Socket.IO
- Backend: Node.js, Express.js
- Database: MongoDB
- API: Axios
- Authentication: JWT, OAuth
- Utilities: clsx, tailwindCSS
- Validation: zod

## 📦 Installation
To get started with the project, follow these steps:
1. Clone the repository using `git clone`
2. Install the dependencies using `npm install`
3. Set up the environment variables in a `.env` file
4. Start the development server using `npm run dev`

## 💻 Usage
To use the application, follow these steps:
1. Start the development server
2. Open the application in a web browser
3. Browse through the movies, theaters, and showtimes
4. Book tickets online using the booking feature
5. Order snacks using the snack ordering feature

## 📂 Project Structure
```markdown
.
├── app
│   ├── context
│   │   ├── AuthContext.tsx
│   │   ├── BookingContext.tsx
│   │   ├── LocationContext.tsx
│   │   └── SnackContext.tsx
│   ├── layout
│   │   └── RootLayout.tsx
│   ├── page
│   │   └── LandingPage.tsx
│   └── ...
├── lib
│   ├── api.ts
│   ├── interceptor.ts
│   ├── utils.ts
│   └── validation
│       └── SignUpschema.ts
├── actions
│   ├── forgot.ts
│   ├── login.ts
│   ├── reset.ts
│   └── signup.ts
├── next.config.ts
├── package.json
└── ...
```
## 🤝 Contributing
To contribute to the project, follow these steps:
1. Fork the repository
2. Create a new branch
3. Make changes and commit them
4. Open a pull request

## 📬 Contact
For any questions or concerns, please contact us at [anshikamittal.2608@gmail.com](mailto:anshikamittal.2608@gmail.com).


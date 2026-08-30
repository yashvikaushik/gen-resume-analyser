# Gen Resume Analyser

An AI-powered full-stack application designed to help users analyse their resumes and prepare for interviews using Generative AI.

> 🚧 Project under development

## Overview

Gen Resume Analyser is a full-stack web application that combines modern web technologies with Generative AI to provide users with intelligent resume analysis and interview preparation.

The application is being built with a focus on clean backend architecture, authentication, AI integration, and scalable application design.

## Current Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Authentication using HTTP cookies
- User logout
- JWT token blacklisting using Redis
- MongoDB database integration
- REST API architecture

## Tech Stack

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt

### Database & Services
- MongoDB
- MongoDB Atlas
- Redis
- Upstash Redis

### AI
- Google Gemini
- Generative AI

## Backend Architecture

The backend follows a layered architecture separating different responsibilities:

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Models
  ↓
MongoDB

Authentication
  ↓
JWT
  ↓
Redis
  ↓
Token Blacklisting
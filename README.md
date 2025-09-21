Testing 2

# Goal Tracker - 30-Day Goal Tracking Application


A full-stack web application for tracking 30-day goals with daily check-ins. Built with Angular frontend, Java Spring Boot backend, H2 database, and Docker support.

## Features

- **Goal Management**: Create, edit, and delete 30-day goals
- **Daily Check-ins**: Track daily progress with mood and notes
- **Progress Tracking**: Visual progress bars and statistics
- **Dashboard**: Overview of all active goals and recent check-ins
- **Responsive Design**: Modern UI that works on desktop and mobile

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Maven
- Docker

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- Font Awesome
- Docker

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devops_2025
   ```

2. **Start the application**
   ```bash 
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - H2 Database Console: http://localhost:8080/h2-console

## Manual Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run with Maven**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Access the backend**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
   - Database URL: `jdbc:h2:mem:goaltracker`
   - Username: `sa`
   - Password: `password`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the frontend**
   - URL: http://localhost:4200

## API Endpoints

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/active` - Get active goals
- `GET /api/goals/{id}` - Get goal by ID
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal
- `GET /api/goals/for-date?date={date}` - Get goals for specific date
- `GET /api/goals/expired` - Get expired goals
- `GET /api/goals/upcoming` - Get upcoming goals

### Check-ins
- `GET /api/checkins/goal/{goalId}` - Get check-ins for goal
- `GET /api/checkins/goal/{goalId}/date/{date}` - Get check-in for specific date
- `POST /api/checkins` - Create new check-in
- `PUT /api/checkins/{id}` - Update check-in
- `DELETE /api/checkins/{id}` - Delete check-in
- `GET /api/checkins/goal/{goalId}/range?startDate={start}&endDate={end}` - Get check-ins in date range
- `GET /api/checkins/goal/{goalId}/count` - Get check-in count for goal
- `GET /api/checkins/goal/{goalId}/recent?limit={limit}` - Get recent check-ins

## Database Schema

### Goals Table
- `id` (Primary Key)
- `title` (VARCHAR, NOT NULL)
- `description` (VARCHAR)
- `start_date` (DATE, NOT NULL)
- `end_date` (DATE, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)
- `is_active` (BOOLEAN, NOT NULL)

### Check-ins Table
- `id` (Primary Key)
- `goal_id` (Foreign Key to Goals)
- `check_in_date` (DATE, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)
- `notes` (VARCHAR)
- `mood` (INTEGER, 1-5 scale)

## Docker Configuration

The application includes Docker configuration for both development and production:

- **Backend Dockerfile**: Multi-stage build with OpenJDK 17
- **Frontend Dockerfile**: Multi-stage build with Node.js and Nginx
- **docker-compose.yml**: Orchestrates both services with networking

## Development

### Backend Development
- Uses Spring Boot DevTools for hot reloading
- H2 in-memory database for development
- CORS configured for frontend integration

### Frontend Development
- Angular CLI for development server
- Hot module replacement enabled
- Proxy configuration for API calls

## Production Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

2. **Scale services if needed**
   ```bash
   docker-compose up --scale backend=2
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.